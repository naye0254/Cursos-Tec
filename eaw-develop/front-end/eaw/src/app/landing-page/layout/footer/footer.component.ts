import {Component} from '@angular/core';

import {LayoutService} from '../layout.service';
import {SharedService} from '../../../shared/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public facebookLink = 'https://www.facebook.com/inclutecr/';
  public linkedinLink = 'https://www.linkedin.com/company/inclutec/about/';
  public youtubeLink =
    'https://www.youtube.com/channel/UCz3MCiuSh21YYTfqJA9QUXA/featured';

  public translatePath = 'landingPage.footer';

  /**
   * Constructor footer LandingPage.
   * @param layoutService
   * @param sharedService
   */
  constructor(
    private layoutService: LayoutService,
    private sharedService: SharedService,
  ) {}

  /**
   * Set the id div to redirect.
   * @param id
   */
  setIdDiv(id) {
    this.layoutService.idDivSubject = id;
    this.sharedService.setItemToLocalStorage('idDiv', id);
  }
}
