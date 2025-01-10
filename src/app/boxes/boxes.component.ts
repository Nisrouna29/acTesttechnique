import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BoxComponent } from '../box/box.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BoxService } from '../services/box.service';
import { Box } from '../models/box';
import { tap } from 'rxjs';
import Decimal from 'decimal.js';
@Component({
  selector: 'app-boxes',
  imports: [MatCardModule, BoxComponent, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxesComponent implements OnInit {
  public total = new Decimal(0);
  constructor(private boxService: BoxService) {
  }
  ngOnInit(): void {
    this.boxService.boxes$.subscribe((boxes: Map<number, Box>) => {
      if (boxes) {
        this.total = new Decimal(0);
        boxes.forEach((value, key) => {
          let currentBox = boxes.get(key);
          if (currentBox && currentBox.value != null) {
            this.total = this.total.plus(new Decimal(currentBox.value));
          }
        });
      }
    });
  }

  deleteAllBoxes() {
    this.boxService.deleteAllboxes().pipe(tap(() => { this.total = new Decimal(0) })).subscribe();
  }

}
