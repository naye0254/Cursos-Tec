import {Injectable} from '@angular/core';
import * as crypto from 'crypto-js';
import {AppConfig} from '../../app.config';
import {CommonConstants} from '../common/common.constants';

/**
 * Class for manage direct consultant constants
 */
@Injectable()
class IndirectClientConstants {
  /**
   * Routerlink to profile for direct consultant
   */
  public static MENU_DIRECT_CLIENT_OPTIONS = {
    routerLink: '/direct-consultant/profile',
  };

  /**
   * Labels and routerLinks on navbar for direct client
   */
  public static NAVBAR_INDIRECT_CLIENT_OPTIONS = evaluationId => {
    return {
      es: [
        {
          label: 'Inicio',
          routerLink: '/indirect-consultant',
          root: true,
        },
        {
          label: 'Evaluaciones',
          routerLink: `/indirect-consultant/detail/results/${evaluationId}/statistics/stats`,
          root: true,
        },
      ],
      en: [
        {
          label: 'Home',
          routerLink: '/indirect-consultant',
          root: true,
        },
        {
          label: 'Evaluations',
          routerLink: `/indirect-consultant/detail/results/${evaluationId}/statistics/stats`,
          root: true,
        },
      ],
    };
  };

  /**
   * Admin options to principal menu
   */
  public static PRINCIPAL_MENU_INDIRECT_CLIENT_OPTIONS = evaluationId => {
    return {
      es: {
        title: '¡Bienvenido (a)!',
        menu: [
          {
            imageUrl: './assets/img/principal-page/evaluaciones.png',
            imageAlt: 'Ícono de evaluaciones',
            title: 'Evaluaciones',
            firstButtonLabel: 'Ver Evaluaciones',
            firstButtonRedirectTo: `/indirect-consultant/detail/results/${evaluationId}/statistics/stats`,
            secondButtonLabel: null,
            secondButtonRedirectTo: null,
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
            firstButtonLabel: 'Go to Evaluations',
            firstButtonRedirectTo: `/indirect-consultant/detail/results/${evaluationId}/statistics/stats`,
            secondButtonLabel: null,
            secondButtonRedirectTo: null,
          },
        ],
      },
    };
  };
}
export {IndirectClientConstants};
