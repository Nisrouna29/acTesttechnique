import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Selector } from '../models/selector';
import { MatRippleModule } from '@angular/material/core';
import { BoxService } from '../services/box.service';
import { Box } from '../models/box';
import { CommonModule } from '@angular/common';
import { Observable, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-selector-option',
  imports: [MatRippleModule, CommonModule],
  standalone: true,
  templateUrl: './selector-option.component.html',
  styleUrls: ['./selector-option.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorOptionComponent implements OnInit, AfterViewInit {
  @ViewChild('selectorButton', { static: false }) selectorButton!: ElementRef;
  @Input() public selector!: Selector;
  public selected$!: Observable<boolean>;
  public click$ = new Observable<MouseEvent>();

  constructor(private boxService: BoxService) { }
  ngAfterViewInit() {
    this.click$ = fromEvent(this.selectorButton.nativeElement, 'click');
    // if we click on the button we patch the value with her new value
    this.click$.subscribe((event) => {
      this.boxService.patchBox(this.selector).subscribe();
    });

  }

  ngOnInit(): void {
    //check if the selector option id matches the id selector of the selected box
    this.selected$ =
      this.boxService.selectedBox$.pipe(
        map((selectedBox: Box | null) => {
          if (selectedBox && selectedBox!.idSelector === this.selector.id) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

}
