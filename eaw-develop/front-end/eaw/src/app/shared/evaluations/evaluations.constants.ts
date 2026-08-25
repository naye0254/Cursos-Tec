import {Injectable} from '@angular/core';

/**
 * Class for manage administrator evaluations constants
 */
@Injectable()
class AdministratorEvaluationsConstants {
  /**
   * Object options for the new evaluation
   */
  public static HTML_NEW_EVALUATION = {
    es: {
      title: 'Nueva Evaluación'
    },
    en: {
      title: 'New Evaluation'
    }
  };

  public static HTM_EDIT_EVALUATION = {
    es: {
      title: 'Editar Evaluación'
    },
    en: {
      title: 'Edit Evaluation'
    }
  };

  /**
   * Object options for the list evaluations
   */
  public static HTML_LIST_EVALUATIONS = {
    es: {
      title: 'Lista de evaluaciones'
    },
    en: {
      title: 'List of Evaluations'
    }
  };

  public static HTML_EVALUATION_REPORTS = {
    es: {
      title: 'Lista de informes'
    },
    en: {
      title: 'List of reports'
    }
  };

  /**
   * Labels and routerLinks on side bar for evaluation options when user is
   * a super-administrator
   */
  public static SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_OPTIONS = {
    es: [
      {
        label: 'Crear Nueva',
        routerLink: '/super-administrator/evaluations/new-evaluation'
      },
      {
        label: 'Ver Evaluaciones',
        routerLink: '/super-administrator/evaluations/list-evaluations'
      },
      {
        label: 'Informes',
        routerLink: '/super-administrator/evaluations/evaluations-reports'
      }
    ],
    en: [
      {
        label: 'Create New',
        routerLink: '/super-administrator/evaluations/new-evaluation'
      },
      {
        label: 'See Evaluations',
        routerLink: '/super-administrator/evaluations/list-evaluations'
      },
      {
        label: 'Reports',
        routerLink: '/super-administrator/evaluations/evaluations-reports'
      }
    ]
  };

  /**
   * Labels and routerLinks on side bar for evaluation options
   */
  public static SIDEBAR_ADMINISTRATOR_EVALUATIONS_OPTIONS = {
    es: [
      {
        label: 'Crear Nueva',
        routerLink: '/administrator/evaluations/new-evaluation'
      },
      {
        label: 'Ver Evaluaciones',
        routerLink: '/administrator/evaluations/list-evaluations'
      },
      {
        label: 'Informes',
        routerLink: '/administrator/evaluations/evaluations-reports'
      }
    ],
    en: [
      {
        label: 'Create New',
        routerLink: '/administrator/evaluations/new-evaluation'
      },
      {
        label: 'See Evaluations',
        routerLink: '/administrator/evaluations/list-evaluations'
      },
      {
        label: 'Reports',
        routerLink: '/administrator/evaluations/evaluations-reports'
      }
    ]
  };
}
export {AdministratorEvaluationsConstants};
