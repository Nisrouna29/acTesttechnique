import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SelectorOptionComponent } from '../selector-option/selector-option.component';
import { SelectorOptionsService } from '../services/selectorOptions.service';
import { Selector } from '../models/selector';
import { Observable, catchError, map, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selector',
  imports: [MatCardModule, SelectorOptionComponent, CommonModule],
  standalone: true,
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorComponent implements OnInit {
  public frontOptions$!: Observable<Selector[]>;
  public backOptions$!: Observable<Selector[]>;
  public othersOptions$!: Observable<Selector[]>;
  constructor(private selectorOptionsService: SelectorOptionsService) { }

  ngOnInit(): void {
    // get all options depending on their types
    const options$ = this.selectorOptionsService.getOptions().pipe(
      map((selectors: Selector[]) => ({
        front: selectors.filter(selector => selector.type === 'front'),
        back: selectors.filter(selector => selector.type === 'back'),
        other: selectors.filter(selector => selector.type === 'other')
      })),
      catchError((error) => {
        console.error("Error while fetching data", error)
        return of({
          front: [],
          back: [],
          other: []
        });
      })
    );

    this.frontOptions$ = options$.pipe(map(data => data.front));
    this.backOptions$ = options$.pipe(map(data => data.back));
    this.othersOptions$ = options$.pipe(map(data => data.other));
  }
}
