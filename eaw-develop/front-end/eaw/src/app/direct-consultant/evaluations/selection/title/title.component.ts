import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-selection-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})

/**
 * Title component for selection state
 */
export class TitleComponent {
  @Input() public subtitle: any;

  constructor() {}
}
