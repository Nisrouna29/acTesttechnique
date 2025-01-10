import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Selector } from '../models/selector';
import { MatRippleModule } from '@angular/material/core';
import { BoxService } from '../services/box.service';
import { Box } from '../models/box';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-selector-option',
  imports: [MatRippleModule, CommonModule],
  standalone: true,
  templateUrl: './selector-option.component.html',
  styleUrls: ['./selector-option.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorOptionComponent implements OnInit {
  @Input() public selector!: Selector;
  public selected$!: Observable<boolean>;

  constructor(private boxService: BoxService) {}
  ngOnInit(): void {
    this.selected$ = combineLatest([
      this.boxService.selectedBox$,
      this.boxService.boxes$
    ]).pipe(
      map(([selectedBox, boxes]: [Box | null, Map<number, Box>]) => {
        if (selectedBox && boxes.has(selectedBox.id) && boxes.get(selectedBox.id)!.idSelector === this.selector.id) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  updateBoxValue() {
    this.boxService.patchBox(this.selector).subscribe();
  }
}
