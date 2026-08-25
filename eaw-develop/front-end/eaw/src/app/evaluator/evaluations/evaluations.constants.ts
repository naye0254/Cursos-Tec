import {Injectable} from '@angular/core';
import {CommonConstants} from '../../common/common.constants';
/**
 * Class for manage evaluator evaluations constants
 */
@Injectable()
class EvaluatorEvaluationsConstants {
  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notResults: 'Actualmente no hay páginas en la specificación seleccionada',
    },
    en: {
      notResults:
        'There are currently no pages with the selected specification',
    },
  };

  /**
   * Labels and routerLinks on side bar for evaluation options
   */
  public static SIDEBAR_EVALUATOR_EVALUATIONS_OPTIONS = {
    es: [
      {
        label: 'Pendientes',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.PENDING}`,
      },
      {
        label: 'En progreso',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.PROGRESS}`,
      },
      {
        label: 'Finalizadas',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.FINISHED}`,
      },
    ],
    en: [
      {
        label: 'Pendings',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.PENDING}`,
      },
      {
        label: 'In Progress',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.PROGRESS}`,
      },
      {
        label: 'Finished',
        routerLink: `/evaluator/evaluations/evaluations-list/${CommonConstants.EVALUATIONS_STATES.FINISHED}`,
      },
    ],
  };

  public static TABLE_COLUMS_EVALUATOR = [
    'selection',
    'title',
    'url',
    'percentage',
    'state',
  ];
}
export {EvaluatorEvaluationsConstants};
