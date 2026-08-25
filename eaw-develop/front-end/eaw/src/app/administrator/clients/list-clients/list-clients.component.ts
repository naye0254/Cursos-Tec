import {Component, OnInit, OnDestroy} from '@angular/core';
import {SharedService} from '../../../shared/shared.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Router, ActivatedRoute} from '@angular/router';

import {ManageClientsConstants} from '../clients.constants';
import {ClientsService} from '../clients.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list-clients-super-administrator',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss'],
})

/**
 * ListClientsComponent manage a client list.
 */
export class ListClientsComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  private segmentId: number;

  public userRole: number;
  public title: string;
  public allClientLabel: string;
  public langIANA: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private clientService: ClientsService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();

    this.title = ManageClientsConstants.LIST_CLIENTS[this.langIANA].title;
    this.allClientLabel =
      ManageClientsConstants.LIST_CLIENTS[this.langIANA].allClientLabel;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.title = ManageClientsConstants.LIST_CLIENTS[this.langIANA].title;
    });
  }

  ngOnInit() {
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    this.segmentId = +this.activatedRoute.snapshot.paramMap.get('segmentId');
    this.getSegment();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public goBack() {
    this.router.navigate(['view-client'], {
      relativeTo: this.activatedRoute.parent,
    });
  }

  getSegment() {
    if (this.segmentId === 0) {
      this.title = this.title + ' ' + this.allClientLabel;
    } else {
      this.clientService
        .getSegmentById(this.segmentId)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(data => {
          this.title = this.title + ' ' + data.name;
        });
    }
  }
}
