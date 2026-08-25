import {Injectable} from '@angular/core';
import {SharedService} from '../shared/shared.service';

/**
 * Class for manage direct consultant constants
 */
@Injectable()
class DirectClientConstants {
  /**
   * Routerlink to profile for direct consultant
   */
  public static MENU_DIRECT_CLIENT_OPTIONS = {
    routerLink: '/direct-consultant/profile',
  };

  /**
   * Labels and routerLinks on navbar for direct client
   */
  public static NAVBAR_DIRECT_CLIENT_OPTIONS = {
    es: [
      {
        label: 'Inicio',
        routerLink: '/direct-consultant',
        root: true,
      },
      {
        label: 'Evaluaciones',
        routerLink: '/direct-consultant/evaluations',
        root: true,
      },
    ],
    en: [
      {
        label: 'Home',
        routerLink: '/direct-consultant',
        root: true,
      },
      {
        label: 'Evaluations',
        routerLink: '/direct-consultant/evaluations',
        root: true,
      },
    ],
  };

  /**
   * Admin options to principal menu
   */
  public static PRINCIPAL_MENU_DIRECT_CLIENT_OPTIONS = {
    es: {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Ícono de evaluaciones',
          title: 'Evaluaciones',
          firstButtonLabel: 'Ver Evaluaciones',
          firstButtonRedirectTo: 'evaluations',
          secondButtonLabel: null,
          secondButtonRedirectTo: null,
        },
      ],
    },
    en: {
      title: 'Welcome!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Evaluations icon',
          title: 'Evaluations',
          firstButtonLabel: 'Go to Evaluations',
          firstButtonRedirectTo: 'evaluations',
        },
      ],
    },
  };

  /**
   * Labels and routerLinks on sidebar of evaluations for  direct client.
   */
  public static SIDEBAR_EVALUATION_DIRECT_CLIENT_OPTIONS = {
    es: [
      {
        label: 'Evaluaciones',
        routerLink: '/direct-consultant/evaluations/list-evaluations',
        action: () => {
          const sharedService = new SharedService();
          sharedService.deleteItemFromLocalStorage(
            'persistentOptionsEvaluations',
          );
        },
      },
      {
        label: 'Solicitar Evaluación',
        routerLink: '/direct-consultant/evaluations/request-evaluation',
      },
    ],
    en: [
      {
        label: 'Evaluations',
        routerLink: '/direct-consultant/evaluations/list-evaluations',
        action: () => {
          const sharedService = new SharedService();
          sharedService.deleteItemFromLocalStorage(
            'persistentOptionsEvaluations',
          );
        },
      },
      {
        label: 'Request Evaluations',
        routerLink: '/direct-consultant/evaluations/request-evaluation',
      },
    ],
  };
}
export {DirectClientConstants};
