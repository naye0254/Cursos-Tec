import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() sideOptions: any;
  @Input()
  public set isOpen(value: boolean) {
    this._isOpen = value;
  }
  public _isOpen: boolean;

  constructor() {
    this.setIsOpenDefaultValue();
  }

  // Set default value in case of this component didn't get an input.
  private setIsOpenDefaultValue() {
    this._isOpen = true;
  }

  // Function to toggle sidebar
  toggleSideBar() {
    this._isOpen = !this._isOpen;
  }
}
