import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BoxComponent } from '../box/box.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BoxService } from '../services/box.service';
import { Box } from '../models/box';
import { fromEvent, Observable, switchMap, tap } from 'rxjs';
import Decimal from 'decimal.js';
@Component({
  selector: 'app-boxes',
  imports: [MatCardModule, BoxComponent, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesComponent implements OnInit, AfterViewInit{
  public total = new Decimal(0);
  @ViewChild('deleteButton') deleteButton!: MatButton;
  public click$ = new Observable<MouseEvent>();
  constructor(private boxService: BoxService) {
}

  ngAfterViewInit() {
    if (this.deleteButton._elementRef && this.deleteButton._elementRef.nativeElement) {
      fromEvent(this.deleteButton._elementRef.nativeElement, 'click')
        .pipe(
          switchMap(async () => this.deleteAllBoxes()) // <-- must return Observable
        )
        .subscribe();
    }
  }
  ngOnInit(): void {
    // every time there is a new emitted boxes, we are going to calculate the total
    this.boxService.boxes$.subscribe((boxes: Map<number, Box>) => {
      if (boxes) {
        this.total = this.calculateTotal(boxes);
      }
    });
  }
  // delete all boxes
  deleteAllBoxes() {
    this.boxService.deleteAllBoxes().subscribe();
  }

  // function to calculate sum
  calculateTotal(boxes:  Map<number, Box>): Decimal {
    let sum = new Decimal(0)
    boxes.forEach((value, key) => {
      let currentBox = boxes.get(key);
      if (currentBox && currentBox.value != null) {
        sum = sum.plus(new Decimal(currentBox.value));
      }
    });
    return sum;
  }

}
