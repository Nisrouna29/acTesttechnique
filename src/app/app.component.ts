import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SelectorComponent } from './selector/selector.component';
import { BoxesComponent } from './boxes/boxes.component';
import { BoxService } from './services/box.service';

@Component({
  selector: 'app-root',
  imports: [BoxesComponent, SelectorComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
   public title = 'interactive-box-selection';
   public showSelector = signal(false);
  constructor(private boxService: BoxService) {
  }
  ngOnInit(): void {
    this.boxService.idSelectedBox$.subscribe((box: number | null) => {
      if (box !== null) {
        this.showSelector.set(true);
      } else {
        this.showSelector.set(false);
      }
    });
  }
}
