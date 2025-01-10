import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Box } from '../models/box';
import { BoxService } from '../services/box.service';
import { Observable, map, tap } from 'rxjs';
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
    this.box$ = this.boxService.boxes$.pipe(
      map((boxes: Map<number, Box>) => boxes.get(this.index) || null)
    );
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
