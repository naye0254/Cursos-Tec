import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../shared/shared.service';
import {ActivatedRoute} from '@angular/router';
import {AlertService} from '../../utils/alerts/alerts.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-user-restore',
  templateUrl: './user-restore.component.html',
  styleUrls: ['./user-restore.component.scss'],
})
class UserRestoreComponent implements OnInit {
  public accessToken: any;
  public userId: any;
  public isEmail: boolean;
  public expiredAlertObj: any;

  public translatePath = 'landingPage.userRestore';

  /**
   * Constructor user-restore
   * @param route
   */
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    this.isEmail = true;
  }

  ngOnInit() {
    this.getTranslationsAlerts();
    window.scrollTo(0, 0);
    this.accessToken = this.route.snapshot.queryParamMap.get('access_token');
    this.userId = this.route.snapshot.queryParamMap.get('i');
    if (this.accessToken != null) {
      this.sharedService
        .verifyAccessTokenStillActive(this.accessToken, this.userId)
        .subscribe(
          data => {
            this.isEmail = false;
          },
          error => {
            this.accessToken = null;
            this.alertService.openAlert(
              this.expiredAlertObj.title,
              this.expiredAlertObj.text,
              'error',
              () => {},
            );
          },
        );
    }
  }

  /**
   * Translate the expired alert.
   */
  getTranslationsAlerts() {
    this.translate
      .get(this.translatePath + '.expiredAlert')
      .subscribe((res: any) => {
        this.expiredAlertObj = {
          title: res.title,
          text: res.text,
        };
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.expiredAlert')
        .subscribe((res: any) => {
          this.expiredAlertObj = {
            title: res.title,
            text: res.text,
          };
        });
    });
  }
}

export {UserRestoreComponent};
