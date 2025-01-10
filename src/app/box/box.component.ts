import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Box } from '../models/box';
import { BoxService } from '../services/box.service';
import { Observable, distinctUntilChanged, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxComponent {
  @Input() public index: number = 0;
  public box$!: Observable<Box | null>;
  public selected$!: Observable<boolean>;
  constructor(private boxService: BoxService) { }

  ngOnInit(): void {
    // everytime the boxes map is changed, the box is updated
    this.box$ = this.boxService.boxes$.pipe(
      map((boxes: Map<number, Box>) => boxes.get(this.index) || null),
      distinctUntilChanged((prev, curr) => prev === curr) // Prevent emitting if the object reference hasn't changed
    );
    // check if the current index of selected box in the service matches the index of box component
    this.selected$ = this.boxService.selectedBox$.pipe(
      map((box: Box | null) => box ? box.id === this.index : false)
    );
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.box$.pipe(
      tap((box) => {
        if (box) {
          this.boxService.updateSelectedBox(box);
        }
      })
    ).subscribe();
  }
}
