import {Injectable} from '@angular/core';

/**
 * Class for manage evaluator constants
 */
@Injectable()
class EvaluatorConstants {
  /**
   * Routerlink to profile for evaluator
   */
  public static MENU_EVALUATOR_OPTIONS = {
    routerLink: '/evaluator/profile',
  };

  /**
   * Labels and routerLinks on navbar for evaluator
   */
  public static NAVBAR_EVALUATOR_OPTIONS = {
    es: [
      {
        label: 'Inicio',
        routerLink: '/evaluator',
        root: true,
      },
      {
        label: 'Evaluaciones',
        routerLink: '/evaluator/evaluations',
      },
    ],
    en: [
      {
        label: 'Home',
        routerLink: '/evaluator',
        root: true,
      },
      {
        label: 'Evaluations',
        routerLink: '/evaluator/evaluations',
      },
    ],
  };

  /**
   * Evaluator options to principal menu
   */
  public static PRINCIPAL_MENU_EVALUATOR_OPTIONS = {
    es: {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Ícono de evaluaciones',
          title: 'Evaluaciones',
          firstButtonLabel: 'Pendientes',
          firstButtonRedirectTo: 'evaluations/evaluations-list/0',
          secondButtonLabel: 'En Progreso',
          secondButtonRedirectTo: 'evaluations/evaluations-list/1',
          thirdButtonLabel: 'Finalizadas',
          thirdButtonRedirectTo: 'evaluations/evaluations-list/2',
        },
      ],
    },
    en: {
      title: 'Welcome!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Evaluations icon',
          title: 'Evaluations',
          firstButtonLabel: 'Pendings ',
          firstButtonRedirectTo: 'evaluations/evaluations-list/0',
          secondButtonLabel: 'In Progress',
          secondButtonRedirectTo: 'evaluations/evaluations-list/1',
          thirdButtonLabel: 'Finished',
          thirdButtonRedirectTo: 'evaluations/evaluations-list/2',
        },
      ],
    },
  };
}
export {EvaluatorConstants};
