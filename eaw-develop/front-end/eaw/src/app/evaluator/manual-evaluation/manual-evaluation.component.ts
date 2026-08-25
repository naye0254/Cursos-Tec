import {Component, OnInit, OnDestroy} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {ManualEvaluationService} from './manual-evaluation.service';
import {ManualEvaluationConstants} from './manual-evaluation.constants';
import {CriteriaInfoService} from './modals/criteria-info/criteria-info.service';
import {AddRecommendationService} from './modals/add-recommendation/add-recommendation.service';
import {EvaluationUnfinishService} from './modals/evaluation-unfinish/evaluation-unfinish.service';
import {SharedService} from '../../shared/shared.service';
import {AlertService} from '../../utils/alerts/alerts.service';

@Component({
  selector: 'app-manual-evaluation',
  templateUrl: './manual-evaluation.component.html',
  styleUrls: ['./manual-evaluation.component.scss'],
  providers: [
    ManualEvaluationService,
    ManualEvaluationConstants,
    CriteriaInfoService,
    AddRecommendationService,
    EvaluationUnfinishService,
  ],
})
export class ManualEvaluationComponent implements OnInit, OnDestroy {
  public RADIO_VALUES = ManualEvaluationConstants.RADIO_VALUES;

  public formEvaluation: FormGroup;
  public answersPerceivable: FormArray = new FormArray([]);
  public answersOperable: FormArray = new FormArray([]);
  public answersUnderstandable: FormArray = new FormArray([]);
  public answersRobust: FormArray = new FormArray([]);
  public currentPrinciple: any;
  public lengthA: number;
  public lengthAA: number;
  public lengthAAA: number;

  public criterionExceptionList: any;
  public isFormFinished: boolean;
  public isSaved: boolean;
  public goToPages: boolean;
  public unfinishedCriteria: any;
  public seeAll: boolean;
  public userDetail: any;
  public principlePage: number;
  public principleInfo: any;
  public idEvaluation: number;
  public idSpecification: number;
  public idPage: number;
  public idManualPage: number;
  public pageInfo: any;
  public specificationInfo: any;
  public criterionForm: any;
  private canSave: boolean;

  public dropdownSettings = {};

  public translatePath = 'evaluator.manualEvaluation';
  public translatePathTable = 'evaluator.manualEvaluation.table';

  /**
   * Constructor manual-evaluation
   * @param router
   * @param formBuilder
   * @param route
   * @param criteriaInfoService
   * @param translate
   * @param alertService
   * @param manualEvaluationService
   * @param addRecommendationService
   * @param evaluationUnfinishService
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private criteriaInfoService: CriteriaInfoService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private alertService: AlertService,
    private manualEvaluationService: ManualEvaluationService,
    private addRecommendationService: AddRecommendationService,
    private evaluationUnfinishService: EvaluationUnfinishService,
  ) {
    this.unfinishedCriteria = [];
    this.criterionExceptionList = [];
    this.isFormFinished = false;
    this.goToPages = false;
    this.isSaved = false;
    this.seeAll = true;
    this.userDetail = {};
    this.principlePage = 4;
    this.lengthA = 0;
    this.lengthAA = 0;
    this.lengthAAA = 0;
    this.canSave = true;
    this.currentPrinciple = 'answersPerceivable';
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idEvaluation = params.evaluationId;
      this.idSpecification = params.specificationId;
      this.idPage = params.pageId;
      this.idManualPage = params.manualPageId;
    });
    this.userDetail = this.manualEvaluationService.getUserInfoFromLocalStorage();
    this.getInitialInfo();
    this.initForm();
    this.getPrinciple();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'recommendation',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      searchPlaceholderText: 'Buscar',
      noDataAvailablePlaceholderText: 'No hay hallazgos disponibles.',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  ngOnDestroy() {
    if (!this.goToPages) {
      this.sharedService.deleteItemFromLocalStorage('evaluationInfo');
      this.sharedService.deleteItemFromLocalStorage('spectInfo');
    }
  }

  /**
   * Initialize the form with the four principles.
   */
  initForm() {
    this.formEvaluation = this.formBuilder.group({
      answersPerceivable: this.answersPerceivable,
      answersOperable: this.answersOperable,
      answersUnderstandable: this.answersUnderstandable,
      answersRobust: this.answersRobust,
    });
  }

  /**
   * Every time that the form have a change, it will save it.
   */
  onChanges(): void {
    this.formEvaluation.valueChanges.subscribe(val => {
      this.saveManualAnswers();
    });
  }

  /**
   * Change the principle page in the pagination.
   * @param pageNumber
   */
  changePrinciplePage(pageNumber: number) {
    this.principlePage = pageNumber;
    this.getPrinciple();
  }

  /**
   * Change the principle page in the pagination when its for go to behind.
   */
  changePrinciplePageBehind() {
    if (this.principlePage !== 1) {
      this.principlePage = this.principlePage - 1;
      this.getPrinciple();
    }
  }

  /**
   * Change the principle page in the pagination when its for go to ahead.
   */
  changePrinciplePageAhead() {
    if (this.principlePage !== 4) {
      this.principlePage = this.principlePage + 1;
      this.getPrinciple();
    }
  }

  /**
   * Get the formArray name depending on the current principle.
   */
  getAnswerType() {
    switch (this.principlePage) {
      case 1:
        return 'answersPerceivable';
        break;

      case 2:
        return 'answersOperable';
        break;

      case 3:
        return 'answersUnderstandable';
        break;

      case 4:
        return 'answersRobust';
        break;
    }
  }

  /**
   * Get the initial info like name, url, spects, etc.
   */
  getInitialInfo() {
    this.manualEvaluationService
      .getSpectsAndPageInfo(
        this.userDetail.userToken,
        this.idSpecification,
        this.idPage,
      )
      .subscribe(data => {
        this.pageInfo = data.results.pageInfo;
        this.specificationInfo = data.results.specificationInfo;
      });
  }

  /**
   * Get the principle information.
   */
  getPrinciple() {
    this.manualEvaluationService
      .getPrinciple(this.userDetail.userToken, this.principlePage)
      .subscribe(data => {
        this.principleInfo = data;
        this.currentPrinciple = this.getAnswerType();
        this.getCriterionForm();
      });
  }

  /**
   * Get the criterion form and starts filling the answers for generate the structure dymical.
   */
  getCriterionForm() {
    this.manualEvaluationService
      .getCriterionsForm(
        this.userDetail.userToken,
        this.idEvaluation,
        this.idSpecification,
        this.principlePage,
      )
      .subscribe(data => {
        this.criterionForm = data;
        this.getIndexStart();
        this.fillAnswers();
      });
  }

  /**
   * Gets the lenght's of the levels A,AA,AAA.
   */
  getIndexStart() {
    this.lengthA = 0;
    this.lengthAA = 0;
    this.lengthAAA = 0;

    for (const key in this.criterionForm.A) {
      if (this.criterionForm.A.hasOwnProperty(key)) {
        this.lengthA++;
      }
    }
    for (const key in this.criterionForm.AA) {
      if (this.criterionForm.AA.hasOwnProperty(key)) {
        this.lengthAA++;
      }
    }
    for (const key in this.criterionForm.AAA) {
      if (this.criterionForm.AAA.hasOwnProperty(key)) {
        this.lengthAAA++;
      }
    }
  }

  /**
   * Generate the structure of every principle arrayForm, if isn't already filled.
   */
  fillAnswers() {
    if (
      (this.formEvaluation.controls[this.currentPrinciple] as FormArray)
        .length === 0
    ) {
      if (this.criterionForm.A !== undefined) {
        this.criterionForm.A.forEach(criteria => {
          this.addAnwsers(criteria);
        });
      }
      if (this.criterionForm.AA !== undefined) {
        this.criterionForm.AA.forEach(criteria => {
          this.addAnwsers(criteria);
        });
      }
      if (this.criterionForm.AAA !== undefined) {
        this.criterionForm.AAA.forEach(criteria => {
          this.addAnwsers(criteria);
        });
      }
      if (this.principlePage > 1) {
        this.principlePage--;
        this.getPrinciple();
      } else {
        this.getSavedManualAnswers();
      }
    }
  }

  /**
   * Add for every principle all the answers structure dynamical.
   * @param criteria
   */
  addAnwsers(criteria) {
    const disabilityRoles: FormArray = new FormArray([]);
    (this.formEvaluation.controls[this.currentPrinciple] as FormArray).push(
      this.formBuilder.group({
        nameCriterion: [criteria.numberCriterion + ' ' + criteria.name],
        criterion: [criteria.id],
        roles: disabilityRoles,
      }),
    );
    const arrayControl = this.formEvaluation.get(
      this.currentPrinciple,
    ) as FormArray;
    const id = arrayControl.length - 1;
    const item = arrayControl.at(id);
    const arrayRoles = item.get('roles') as FormArray;
    criteria.disabilitiesId.forEach(disability => {
      arrayRoles.push(
        this.formBuilder.group({
          disability: [disability.disabilitiesId],
          specification: [disability.specificationsId],
          cumply: [''],
          recommendations: [''],
        }),
      );
    });
  }

  /**
   * Logic to know asynchronously in a table which of the radios is selected and mark it as such.
   * @param value
   * @param id
   * @param idRole
   */
  checkedRadio(value: number, id: number, idRole: number) {
    const arrayControl = this.formEvaluation.get(
      this.currentPrinciple,
    ) as FormArray;
    const item = arrayControl.at(id);
    if (!item) {
      return false;
    }
    const arrayRoles = item.get('roles') as FormArray;
    const itemRole = arrayRoles.at(idRole);
    return itemRole.value.cumply === value;
  }

  /**
   * Function to hide all criterion already answered before the switch.
   * @param id
   * @param criteriaId
   */
  checkSwitch(id: number, criteriaId: number) {
    if (this.seeAll === false) {
      let cumplyAlready = 0;
      const arrayControl = this.formEvaluation.get(
        this.currentPrinciple,
      ) as FormArray;
      const item = arrayControl.at(id);
      if (!item) {
        return true;
      }
      const arrayRoles = item.get('roles') as FormArray;
      arrayRoles.value.forEach(role => {
        if (role.cumply !== '') {
          cumplyAlready++;
        }
      });
      if (
        cumplyAlready !== arrayRoles.length ||
        this.criterionExceptionList.includes(criteriaId) === true
      ) {
        if (this.criterionExceptionList.includes(criteriaId) === false) {
          this.criterionExceptionList.push(criteriaId);
        }
        return true;
      } else {
        return false;
      }
    } else {
      this.criterionExceptionList = [];
      return true;
    }
  }

  /**
   * Checks the if the multiselect has to be disabled when the radio button is marked as no cumply.
   * @param id
   * @param idRole
   */
  checkDisabled(id: number, idRole: number) {
    const arrayControl = this.formEvaluation.get(
      this.currentPrinciple,
    ) as FormArray;
    const item = arrayControl.at(id);
    if (!item) {
      return true;
    }
    const arrayRoles = item.get('roles') as FormArray;
    const itemRole = arrayRoles.at(idRole);
    const itemRecommendations = itemRole.get('recommendations') as FormArray;
    if (itemRole.value.cumply === this.RADIO_VALUES.NO_COMPLY) {
      itemRecommendations.setValidators([Validators.required]);
      itemRecommendations.updateValueAndValidity();
      return false;
    } else {
      itemRecommendations.clearValidators();
      itemRecommendations.updateValueAndValidity();
      if (itemRecommendations.value.length > 0) {
        itemRecommendations.setValue([]);
      }
      return true;
    }
  }

  /**
   * Used in mat-error to check if a multiselect option
   * is required.
   * @param id
   * @param idRole
   */
  checkRequired(id: number, idRole: number) {
    const arrayControl = this.formEvaluation.get(
      this.currentPrinciple,
    ) as FormArray;
    const item = arrayControl.at(id);
    if (!item) {
      return true;
    }
    const arrayRoles = item.get('roles') as FormArray;
    const itemRole = arrayRoles.at(idRole);
    if (itemRole.value.cumply === this.RADIO_VALUES.NO_COMPLY) {
      const itemRecommendations = itemRole
        .get('recommendations')
        .hasError('required');
      const itemTouched = itemRole.get('recommendations').touched;
      return itemRecommendations; //&& itemTouched; TODO: Implement a better way to display this.
    } else {
      return false;
    }
  }

  /**
   * Function that returns recommendations array.
   * @param id
   * @param idRole
   */
  getSelected(id: number, idRole: number) {
    const arrayControl = this.formEvaluation.get(
      this.currentPrinciple,
    ) as FormArray;
    const item = arrayControl.at(id);
    if (!item) {
      return [];
    }
    const arrayRoles = item.get('roles') as FormArray;
    const itemRole = arrayRoles.at(idRole);
    const itemRecommendations = itemRole.get('recommendations').value;
    return itemRecommendations;
  }

  /**
   * Switch the state of see all the criterion or only the unanswered.
   * @param event
   */
  applyStateFilter(event) {
    if (event.index === 0) {
      this.seeAll = true;
    } else if (event.index === 1) {
      this.seeAll = false;
    }
  }

  /**
   * Function to get all the unfinished criteria and listed in an array,
   * and also knows if the evaluation is already finished or not.
   */
  getUnfinishedCriteria() {
    this.unfinishedCriteria = [];
    for (
      let index = 0;
      index < ManualEvaluationConstants.PRINCIPLES.length;
      index++
    ) {
      const principleControl = ManualEvaluationConstants.PRINCIPLES[index];
      const principleName = ManualEvaluationConstants.PRINCIPLES_NAME[index];
      if (
        (this.formEvaluation.controls[principleControl] as FormArray).length ===
        0
      ) {
        this.translate
          .get('utils.principles.' + principleName + '.title')
          .subscribe((principleNameTranslated: any) => {
            this.unfinishedCriteria.push(principleNameTranslated);
          });
      } else {
        const arrayControl = this.formEvaluation.get(
          principleControl,
        ) as FormArray;
        for (let idx = 0; idx < arrayControl.length; idx++) {
          let cumplyAlready = 0;
          const item = arrayControl.at(idx);
          const arrayRoles = item.get('roles') as FormArray;
          arrayRoles.value.forEach(role => {
            if (role.cumply !== '') {
              cumplyAlready++;
            }
          });
          if (cumplyAlready !== arrayRoles.length) {
            this.unfinishedCriteria.push(item.get('nameCriterion').value);
          }
        }
      }
    }
    if (this.unfinishedCriteria.length === 0 && this.formEvaluation.valid) {
      this.isFormFinished = true;
    } else {
      this.isFormFinished = false;
    }
  }

  /**
   * Get the already saved answers from the database and patchValue the answers.
   */
  getSavedManualAnswers() {
    this.manualEvaluationService
      .getSavedManualAnswers(this.userDetail.userToken, +this.idManualPage)
      .subscribe(data => {
        const formPatch = JSON.parse(data.formPage);
        if (formPatch !== null) {
          this.formEvaluation.patchValue({
            answersPerceivable: formPatch.answersPerceivable,
            answersOperable: formPatch.answersOperable,
            answersUnderstandable: formPatch.answersUnderstandable,
            answersRobust: formPatch.answersRobust,
          });
        }
      });
    this.onChanges();
  }

  /**
   * Save all the new answers in database.
   * @param fromButton
   */
  saveManualAnswers() {
    if (this.canSave) {
      this.canSave = false;
      this.getUnfinishedCriteria();
      this.manualEvaluationService
        .saveManualAnswers(
          this.formEvaluation.value,
          this.isFormFinished,
          +this.idManualPage,
          this.userDetail.userToken,
        )
        .subscribe(
          data => {
            this.canSave = true;
          },
          error => {
            this.canSave = true;
          },
        );
    }
  }

  /**
   * Save all the new answers in database from the button.
   * @param fromButton
   */
  saveManualAnswersFromButton() {
    this.getUnfinishedCriteria();
    this.manualEvaluationService
      .saveManualAnswers(
        this.formEvaluation.value,
        this.isFormFinished,
        +this.idManualPage,
        this.userDetail.userToken,
      )
      .subscribe(
        data => {
          this.setTemporalSave();
        },
        error => {
          this.alertService.openAlert(
            'Error al guardar',
            'Se ha producido un error al intentar guardar el formulario, por favor vuelva a intentarlo.',
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * Allows the button of save knows that works for 30s.
   */
  setTemporalSave() {
    this.isSaved = true;
    setTimeout(() => (this.isSaved = false), 30000);
  }

  /**
   * Open the information criteria modal.
   * @param numberCriteria
   * @param title
   * @param text
   * @param link
   */
  openInfoModal(numberCriteria, title, text, link) {
    this.criteriaInfoService.openDialog(
      '50%',
      numberCriteria,
      title,
      text,
      link,
      () => {},
    );
  }

  /**
   * Open the add new recommendation modal.
   */
  openRecommendationModal() {
    this.translate
      .get(this.principleInfo.descriptionPath + '.title')
      .subscribe((principleName: any) => {
        this.addRecommendationService.openDialog(
          '50%',
          principleName,
          this.principleInfo.id,
          this.idManualPage,
          () => {},
          () => {},
        );
      });
  }

  /**
   * Open the modal that list the criterion and principles unfinished and send
   * the user back to list evaluations.
   */
  openEvaluationUnfinishModal(seePages: boolean) {
    this.getUnfinishedCriteria();
    if (this.isFormFinished === false) {
      this.evaluationUnfinishService.openDialog(
        '50%',
        this.unfinishedCriteria,
        () => {
          if (seePages) {
            this.goToPages = true;
          }
          this.router.navigate(['evaluator/evaluations/evaluations-list/1']);
        },
        () => {},
      );
    } else {
      if (seePages) {
        this.goToPages = true;
      }
      this.router.navigate(['evaluator/evaluations/evaluations-list/1']);
    }
  }
}
