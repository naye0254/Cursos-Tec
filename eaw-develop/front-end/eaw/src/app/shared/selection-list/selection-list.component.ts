import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-selection-list',
  templateUrl: './selection-list.component.html',
  styleUrls: ['./selection-list.component.scss'],
})
export class SelectionListComponent {
  @Input() list: any;
  @Output() selectedItem;

  constructor() {
    this.selectedItem = new EventEmitter<any>();
  }

  nextStep(selectedItem: number): void {
    this.selectedItem.emit({
      id: selectedItem,
    });
  }
}
