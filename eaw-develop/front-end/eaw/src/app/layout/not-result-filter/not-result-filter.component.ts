import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-not-result-filter',
  templateUrl: './not-result-filter.component.html',
  styleUrls: ['./not-result-filter.component.scss'],
})
export class NotResultFilterComponent {
  @Input() notResultMessage: string;
  constructor() {}
}
