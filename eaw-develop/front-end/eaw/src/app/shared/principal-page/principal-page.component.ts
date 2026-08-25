import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../../models/user.model';
import {SharedService} from '../../shared/shared.service';
import {CommonConstants} from '../../common/common.constants';

@Component({
  selector: 'app-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
  providers: [CommonConstants],
})
export class PrincipalPageComponent implements OnInit {
  /**
   * Options to set the principal menu
   */
  @Input() public principalMenuOptions: any;

  /**
   * User data to greeting
   */
  public user: User;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    const user = this.sharedService.getItemFromLocalStorage(
      CommonConstants.KEY_USER_DETAILS,
    );
    if (user) {
      this.user = JSON.parse(user) as User;
    } else {
      this.user = new User();
    }
  }

  /**
   * Function to navigate by url
   * @param url to redirect
   */
  public redirectTo(url: string) {
    this.router.navigate([url], {relativeTo: this.activatedRoute});
  }
}
