import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SelectorComponent } from './selector/selector.component';
import { BoxesComponent } from './boxes/boxes.component';
import { BoxService } from './services/box.service';
import { Box } from './models/box';

@Component({
  selector: 'app-root',
  imports: [BoxesComponent, SelectorComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   public title = 'interactive-box-selection';
   public showSelector!: boolean;
  constructor(private boxService: BoxService) {
  }
  ngOnInit(): void {
    this.boxService.idSelectedBox$.subscribe((box: number | null) => {
      if (box !== null) {
        this.showSelector = true;
      } else {
        this.showSelector = false;
      }
    });
  }
}
