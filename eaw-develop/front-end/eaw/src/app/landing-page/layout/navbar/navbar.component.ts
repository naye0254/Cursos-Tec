import {Component, Inject, OnInit} from '@angular/core';

import {LayoutService} from '../layout.service';
import {SharedService} from '../../../shared/shared.service';
import {ConfiguratinLanguageService} from '../../../utils/language-config/language-config.service';

import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Router} from '@angular/router';

import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [ConfiguratinLanguageService]
})
export class NavbarComponent implements OnInit {
  public actualLang: string;
  public logInLabel: string;
  public translatePath = 'landingPage.navbar';

  /**
   * Constructor navbar LandingPage.
   * @param layoutService
   * @param sharedService
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private layoutService: LayoutService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private configurationLanguageService: ConfiguratinLanguageService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
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
    translateCacheService.init();
    this.actualLang = translateCacheService.getCachedLanguage();
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.actualLang = event.lang;
      this.document.documentElement.lang = event.lang;
    });
  }

  ngOnInit() {
    if (this.verifyAlreadyLogged()) {
      try {
        const user = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
        this.logInLabel = user.firstName;
      } catch (error) {
        this.sharedService.deleteItemFromLocalStorage('userDetail');
        this.setLoginLabel();
      }
    } else {
      this.setLoginLabel();
    }
  }

  /**
   * Function to set login label
   */
  private setLoginLabel() {
    this.translate.get(this.translatePath + '.login').subscribe((res: string) => {
      this.logInLabel = res;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate.get(this.translatePath + '.login').subscribe((res: string) => {
        this.logInLabel = res;
      });
    });
  }

  /**
   * Verify if an user is already logged to redirect to principal page of rol, otherwise redirect to login.
   */
  getInto() {
    if (this.verifyAlreadyLogged()) {
      const user = JSON.parse(this.sharedService.getItemFromLocalStorage('userDetail'));
      this.handleUserRole(user.roleTypesId);
    } else {
      this.router.navigate(['login']);
    }
  }

  /**
   * Verify is userDetail is at localstorage.
   */
  verifyAlreadyLogged() {
    return localStorage.getItem('userDetail') != null;
  }

  /**
   * Redirect the user after login to the corresponding profile.
   * @param response
   */
  handleUserRole(roleTypesId: number) {
    switch (roleTypesId) {
      case 1:
        this.router.navigate(['super-administrator']);
        break;

      case 2:
        this.router.navigate(['administrator']);
        break;

      case 3:
        this.router.navigate(['evaluator']);
        break;

      case 4:
        this.router.navigate(['direct-consultant']);
        break;

      default:
        break;
    }
  }

  /**
   * Set the id div to redirect.
   * @param id
   */
  setIdDiv(id) {
    this.layoutService.idDivSubject = id;
    this.sharedService.setTemporalItemToLocalStorage('idDiv', id, 10);
  }

  /**
   * Change current language to another one
   * @param language
   */
  useLanguage(language: string) {
    this.document.documentElement.lang = language;
    this.translate.use(language);
    this.configurationLanguageService.openConfigurationLanguagePage();
  }
}
