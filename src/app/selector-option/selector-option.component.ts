import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ISelectorOption } from '../models/selector.option';
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
  @ViewChild('optionButton', { static: false }) optionButton!: ElementRef;
  @Input() public option!: ISelectorOption;
  public selected$!: Observable<boolean>;
  public click$ = new Observable<MouseEvent>();

  constructor(private boxService: BoxService) { }
  ngAfterViewInit() {
    this.click$ = fromEvent(this.optionButton.nativeElement, 'click');
    // if we click on the button we patch the value with her new value
    this.click$.subscribe((event) => {
      this.boxService.patchBox(this.option).subscribe();
    });

  }

  ngOnInit(): void {
    //check if the selector option id matches the id selector of the selected box
    this.selected$ =
      this.boxService.selectedBox$.pipe(
        map((selectedBox: Box | null) => {
          if (selectedBox && selectedBox.idSelectorOption === this.option.id) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

}
