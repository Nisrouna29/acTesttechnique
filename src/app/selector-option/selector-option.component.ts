import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ISelectorOption } from '../models/selector.option';
import { MatRippleModule } from '@angular/material/core';
import { BoxService } from '../services/box.service'
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, fromEvent, map, switchMap } from 'rxjs';

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
    // if we click on the button we patch the value with her new value
    fromEvent(this.optionButton.nativeElement, 'click').pipe(
      switchMap(async () => this.boxService.patchBox(this.option).subscribe()) // <-- must return Observable
    ).subscribe();

  }

  ngOnInit(): void {
    this.selected$ = combineLatest({
      idSelectedBox: this.boxService.idSelectedBox$,
      boxes: this.boxService.boxes$,
    }).pipe(
      map(({ idSelectedBox, boxes }) => {
        return idSelectedBox !== null &&
               boxes.has(idSelectedBox) &&
               boxes.get(idSelectedBox)?.idSelectorOption === this.option.id;
      })
    );
  }

}
