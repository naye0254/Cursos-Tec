import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';

@Injectable()
class LayoutService {
  // tslint:disable-next-line: variable-name
  private _idDivSubject: Subject<any>;

  /**
   * Constructor layout
   */
  constructor() {
    this._idDivSubject = new Subject<any>();
  }

  /**
   * Service to set the id of the div, for make the anchor.
   */
  public set idDivSubject(value: any) {
    this._idDivSubject.next(value);
  }

  /**
   * Service to get the id of the div, for make the anchor.
   */
  public get idDivSubject(): any {
    return this._idDivSubject;
  }
}
export {LayoutService};
