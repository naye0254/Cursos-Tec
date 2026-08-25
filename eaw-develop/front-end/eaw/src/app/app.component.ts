import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'eaw';

  /**
   * Constructor app
   * @param translate For service translate
   */
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('es');
  }
}
