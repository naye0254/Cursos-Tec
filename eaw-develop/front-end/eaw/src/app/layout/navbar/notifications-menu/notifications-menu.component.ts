import {Component, OnInit, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {NotificationsMenuService} from './notifications-menu.service';
import {SharedService} from '../../../shared/shared.service';
import {CommonConstants} from '../../../common/common.constants';
import {Notifications} from '../../../common/common.interfaces';

@Component({
  selector: 'app-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
  providers: [NotificationsMenuService],
})
export class NotificationsMenuComponent implements OnInit {
  @Input() menuOptions: any;
  public notifications: Notifications[];
  public name: string;
  public newNotifications: boolean;
  /**
   * Constructor notifications menu
   * @param translate
   */
  constructor(
    private translate: TranslateService,
    private notificationsMenuService: NotificationsMenuService,
    private router: Router,
    private sharedService: SharedService,
  ) {
    this.sharedService.notificationChange.subscribe(value => {
      this.getNotifications();
    });
  }

  ngOnInit() {
    const user = this.sharedService.getUserInfoFromLocalStorage();
    this.name = user.firstName;
    this.newNotifications = false;
    this.getNotifications();
  }

  /**
   * Logout of an user, delete userDetail from localstorage.
   */
  logout() {
    this.notificationsMenuService.logout().subscribe(
      data => {
        this.sharedService.deleteItemFromLocalStorage('userDetail');
        this.router.navigate(['']);
      },
      error => {
        // TODO: handle error
      },
    );
  }

  /**
   * To get the last unseen notifications, if there is no one get the last seen.
   */
  getNotifications() {
    this.notificationsMenuService
      .getNotifications(CommonConstants.QUANTITY_NOTIFICATIONS)
      .subscribe(data => {
        this.notifications = data.results;
        if (this.notifications.length === 0) {
          this.newNotifications = false;
          this.notificationsMenuService
            .getAllNotifications(CommonConstants.QUANTITY_NOTIFICATIONS)
            .subscribe(dataOptional => {
              this.notifications = dataOptional.results;
            });
        } else {
          this.newNotifications = true;
        }
      });
  }

  /**
   * To mark the notification as seen.
   * @param notificationId
   */
  setNotificationAsSeen(notificationId: number) {
    this.notificationsMenuService
      .setNotificationAsSeen(notificationId)
      .subscribe(data => {
        this.sharedService.toggleNotificationChange();
      });
  }

  /**
   * To activate the button with the key enter.
   * @param event
   */
  onKeyToSeeAllNotifications(event: any) {
    if (event.keyCode === CommonConstants.KEY_CODES.enter) {
      this.router.navigate([this.menuOptions.routerLink]);
    }
  }
}
