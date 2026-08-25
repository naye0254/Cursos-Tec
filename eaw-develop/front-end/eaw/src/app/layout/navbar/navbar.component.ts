import {Component, Input, Inject} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {DOCUMENT} from '@angular/common';

import {ConfiguratinLanguageService} from '../../utils/language-config/language-config.service';
import {SharedService} from '../../shared/shared.service';
import {NavbarService} from './navbar.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [ConfiguratinLanguageService, NavbarService],
})
export class NavbarComponent {
  @Input() navOptions: any;
  @Input() menuOptions: any;
  /**
   * To specify the current language and be able to mark it in the select.
   */
  public actualLang: string;
  private dataLang: any;
  /**
   * Constructor navbar
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private router: Router,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService,
    private navbarService: NavbarService,
    @Inject(DOCUMENT) private document: Document,
    private configurationLanguageService: ConfiguratinLanguageService,
  ) {
    this.dataLang = {};

    if (this.sharedService.isItemInLocalStorage('userDetail')) {
      const userDetail = JSON.parse(
        this.sharedService.getItemFromLocalStorage('userDetail'),
      );
      this.useLanguageById(userDetail.userToken, userDetail.languagesId);
    } else {
      if (translateCacheService.getCachedLanguage() === null) {
        try {
          translate.use(translate.getBrowserLang());
          this.document.documentElement.lang = translate.getBrowserLang();
        } catch (error) {
          translate.use('es');
          this.document.documentElement.lang = 'es';
        }
      } else {
        translate.use(translateCacheService.getCachedLanguage());
        this.document.documentElement.lang = translateCacheService.getCachedLanguage();
      }
    }
    translateCacheService.init();
    this.actualLang = translateCacheService.getCachedLanguage();
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.actualLang = event.lang;
      this.document.documentElement.lang = event.lang;
    });
  }

  /**
   * Change current language to another one
   * @param language
   */
  useLanguage(language: string) {
    this.translate.use(language);

    const userDetail = this.sharedService.getUserInfoFromLocalStorage();

    this.navbarService
      .changeLanguageForUser(userDetail.id, language, userDetail.userToken)
      .subscribe(data => {
        this.dataLang = data;
        this.document.documentElement.lang = language;
        this.changeUserLanguageInLocalStorage(
          this.dataLang.messages.id,
          userDetail,
        );
      });
    this.configurationLanguageService.openConfigurationLanguagePage();
  }

  /**
   * Change the language of user in the current local storage.
   * @param idLang
   */
  changeUserLanguageInLocalStorage(idLang: string, userDetail: any) {
    userDetail.languagesId = JSON.parse(idLang);
    this.sharedService.setItemToLocalStorage(
      'userDetail',
      JSON.stringify(userDetail),
    );
  }
  /**
   * Change current language to another one by id language.
   * @param idLang
   * @param token
   */
  useLanguageById(token, idLang) {
    this.navbarService.getIana(token, idLang).subscribe(data => {
      if (
        this.translateCacheService.getCachedLanguage() !== data.iana &&
        this.sharedService.isItemInLocalStorage('changinLang')
      ) {
        this.configurationLanguageService.openConfigurationLanguagePage();
      }
      this.document.documentElement.lang = data.iana;
      this.translate.use(data.iana);
    });
  }

  /**
   * Logout the indirect client
   */
  logout() {
    this.sharedService.setItemToLocalStorage('isIndirectClient', 'false');
    this.router.navigate(['']);
  }
}
