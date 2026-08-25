import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-not-result',
  templateUrl: './not-result.component.html',
  styleUrls: ['./not-result.component.scss'],
})
export class NotResultComponent {
  @Input() notResultMessage: string;
  constructor() {}
}
