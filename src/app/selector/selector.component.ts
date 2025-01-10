import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SelectorOptionComponent } from '../selector-option/selector-option.component';
import { SelectoService } from '../services/selector.service';
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
  public frontSelectors$!: Observable<Selector[]>;
  public backSelectors$!: Observable<Selector[]>;
  public otherSelectors$!: Observable<Selector[]>;
  constructor(private selectoService: SelectoService) { }

  ngOnInit(): void {
    const selectors$ = this.selectoService.getSelectors().pipe(
      map((selectors: Selector[]) => ({
        front: selectors.filter(selector => selector.type === 'front'),
        back: selectors.filter(selector => selector.type === 'back'),
        other: selectors.filter(selector => selector.type === 'other')
      })),
      catchError((error) => {
        return of({
          front: [],
          back: [],
          other: []
        });
      })
    );

    this.frontSelectors$ = selectors$.pipe(map(data => data.front));
    this.backSelectors$ = selectors$.pipe(map(data => data.back));
    this.otherSelectors$ = selectors$.pipe(map(data => data.other));
  }
}
