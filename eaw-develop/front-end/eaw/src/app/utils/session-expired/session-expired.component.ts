import {Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionExpiredComponent {
  public translatePath = 'utils.sessionExpired';

  /**
   * Constructor session-expired
   * @param router
   */
  constructor(private router: Router) {}

  /**
   * Go to login.
   */
  goLogin() {
    this.router.navigate(['login']);
  }
}
