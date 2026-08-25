import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../shared/shared.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {ClientsPageConstants} from '../clients.constants';

@Component({
  selector: 'app-list-clients-super-administrator',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss'],
})

/**
 * ListClientsComponent manage a client list.
 */
export class ListClientsComponent implements OnInit {
  public userRole: number;
  public title: string;
  public langIANA: string;

  constructor(
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();

    this.title = ClientsPageConstants.TITLE[this.langIANA].title;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.title = ClientsPageConstants.TITLE[this.langIANA].title;
    });
  }

  ngOnInit() {
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
  }
}
