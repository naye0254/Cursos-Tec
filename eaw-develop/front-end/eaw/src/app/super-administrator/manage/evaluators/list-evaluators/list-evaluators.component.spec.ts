import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../../material.module';
import {LayoutModule} from '../../../../layout/layout.module';
import {SharedTestingTranslateModule} from '../../../../shared/test/modules/testing-traslate.module';
import {
  testSharedElements,
  testMatTab,
  validateExistKey,
} from '../../../../shared/test/functions/test-manage-list.test';

import {ListEvaluatorsComponent} from './list-evaluators.component';

const EN_JSON = require('../../../../../assets/languages/en.json');
const ES_JSON = require('../../../../../assets/languages/es.json');

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import {TranslateService} from '@ngx-translate/core';
import {EvaluatorConstants} from '../evaluator.constants';

describe('ListEvaluatorsComponent', () => {
  let component: ListEvaluatorsComponent;
  let fixture: ComponentFixture<ListEvaluatorsComponent>;
  let translate: TranslateService;
  let http: HttpTestingController;
  const tableHeaders = [
    'name',
    'typesOfDiscapacity',
    'evaluationsCounter',
    'state',
    'edit',
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListEvaluatorsComponent],
      imports: [
        HttpClientTestingModule,
        SharedTestingTranslateModule,
        MaterialModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [TranslateService],
    }).compileComponents();
    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvaluatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render the template', () => {
    it('Should render the json languaje in english', () => {
      translate.use('en');
      fixture.detectChanges();
      const jsonLanguage = JSON.parse(JSON.stringify(EN_JSON));
      http.expectOne('/assets/i18n/en.json').flush(jsonLanguage);

      testSharedElements(translate, fixture, EN_JSON);

      fixture.whenStable().then(() => {
        testMatTab(translate, fixture, EN_JSON);

        for (const [index, header] of tableHeaders.entries()) {
          const headerTable = fixture.nativeElement
            .querySelectorAll('.mat-header-cell')
            [index].textContent.trim();
          validateExistKey(
            headerTable,
            EN_JSON.superAdministrator.manage.evaluators.list.table[header],
            translate,
          );
        }
      });
    });

    it('Should render the json languaje in spanish', () => {
      translate.use('es');
      fixture.detectChanges();
      const jsonLanguage = JSON.parse(JSON.stringify(ES_JSON));
      http.expectOne('/assets/i18n/es.json').flush(jsonLanguage);

      testSharedElements(translate, fixture, ES_JSON);

      fixture.whenStable().then(() => {
        testMatTab(translate, fixture, ES_JSON);

        for (const [index, header] of tableHeaders.entries()) {
          const headerTable = fixture.nativeElement
            .querySelectorAll('.mat-header-cell')
            [index].textContent.trim();
          validateExistKey(
            headerTable,
            ES_JSON.superAdministrator.manage.evaluators.list.table[header],
            translate,
          );
        }
      });
    });

    it('Should render no results', () => {
      const pathImage = '/assets/img/layout/caja_moscas.png';
      component.emptyMessages = EvaluatorConstants.EMPTY_RESULTS.es;
      component.isEmpty = true;
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('h2').textContent.trim(),
      ).toEqual(EvaluatorConstants.EMPTY_RESULTS.es.notResults);
      expect(fixture.nativeElement.querySelector('img').src).toContain(
        pathImage,
      );
    });
  });
});
