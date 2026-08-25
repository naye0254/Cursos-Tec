import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ViewEncapsulation,
} from '@angular/core';

import {SharedService} from '../../shared/shared.service';
import {LayoutService} from '../layout/layout.service';

import {Unsubscribable} from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('packages', {static: true}) packagesElemRef: ElementRef;
  @ViewChild('aboutUs', {static: true}) aboutUsElemRef: ElementRef;

  public evaluation: any;
  public isRejected: boolean;
  public idDiv: any;
  public HC: any;

  public ElementPackage = 'packages';
  public ElementAboutUs = 'aboutUs';

  public translatePath = 'landingPage.home';
  public translatePathAbout = this.translatePath + '.aboutUs';
  public translatePathMiscellany = this.translatePath + '.miscellanySection';
  public translatePathPackages = this.translatePath + '.packages';

  private unsubscribeIdDiv: Unsubscribable;

  /**
   * Constructor home of LandingPage.
   * @param layoutService
   * @param sharedService
   */
  constructor(
    private layoutService: LayoutService,
    private sharedService: SharedService,
  ) {
    this.evaluation = {};
    this.isRejected = false;
    this.idDiv = '';
  }

  ngOnInit() {
    this.HC = this.sharedService.checkHC();
    this.packagesElemRef.nativeElement.tabIndex = -1;
    this.aboutUsElemRef.nativeElement.tabIndex = -1;
    window.scrollTo(0, 0);
    this.goToDivFromAnotherPage();
  }

  ngAfterViewChecked() {
    this.unsubscribeIdDiv = this.layoutService.idDivSubject.subscribe(idDiv => {
      if (idDiv != null) {
        this.goToDiv(idDiv);
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeIdDiv) {
      this.unsubscribeIdDiv.unsubscribe();
    }
  }

  /**
   * Redirect to one div, get it from localstorage, if the user came from another page.
   */
  goToDivFromAnotherPage() {
    if (this.sharedService.isItemInLocalStorage('idDiv') === true) {
      this.idDiv = this.sharedService.getItemFromLocalStorage('idDiv');
      switch (this.idDiv) {
        case this.ElementPackage:
          this.packagesElemRef.nativeElement.scrollIntoView({
            behavior: 'smooth',
          });
          this.packagesElemRef.nativeElement.tabIndex = 2;
          this.packagesElemRef.nativeElement.focus();
          this.idDiv = '';
          break;

        case this.ElementAboutUs:
          this.aboutUsElemRef.nativeElement.scrollIntoView({
            behavior: 'smooth',
          });
          this.aboutUsElemRef.nativeElement.tabIndex = 2;
          this.aboutUsElemRef.nativeElement.focus();
          this.idDiv = '';
          break;
      }
    }
  }

  /**
   * Redirect to one div, get it from param, if the user is in the same page.
   * @param id
   */
  goToDiv(id) {
    if (id !== 'top') {
      switch (id) {
        case this.ElementPackage:
          this.packagesElemRef.nativeElement.scrollIntoView({
            behavior: 'smooth',
          });
          this.packagesElemRef.nativeElement.tabIndex = 2;
          this.packagesElemRef.nativeElement.focus();
          break;

        case this.ElementAboutUs:
          this.aboutUsElemRef.nativeElement.scrollIntoView({
            behavior: 'smooth',
          });
          this.aboutUsElemRef.nativeElement.tabIndex = 2;
          this.aboutUsElemRef.nativeElement.focus();
          break;
      }
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
}
