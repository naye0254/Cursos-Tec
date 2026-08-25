import {Injectable} from '@angular/core';
import {SharedService} from '../shared/shared.service';

/**
 * Class for manage administrator constants
 */
@Injectable()
class AdministratorConstants {
  /**
   * Routerlink to profile for administrator
   */
  public static MENU_ADMINISTRATOR_OPTIONS = {
    routerLink: '/administrator/profile',
  };

  /**
   * Labels and routerLinks on navbar for administrator
   */
  public static NAVBAR_ADMINISTRATOR_OPTIONS = {
    es: [
      {
        label: 'Inicio',
        routerLink: '/administrator',
        root: true,
      },
      {
        label: 'Clientes',
        routerLink: 'clients',
      },
      {
        label: 'Evaluaciones',
        routerLink: 'evaluations',
      },
      {
        label: 'Seguimiento',
        routerLink: 'tracking',
      },
    ],
    en: [
      {
        label: 'Home',
        routerLink: '/administrator',
        root: true,
      },
      {
        label: 'Clients',
        routerLink: 'clients',
      },
      {
        label: 'Evaluations',
        routerLink: 'evaluations',
      },
      {
        label: 'Tracing',
        routerLink: 'tracking',
      },
    ],
  };

  /**
   * Admin options to principal menu
   */
  public static PRINCIPAL_MENU_ADMINISTRATOR_OPTIONS = {
    es: {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Ícono de clientes',
          title: 'Clientes',
          firstButtonLabel: 'Ver Clientes',
          firstButtonRedirectTo: 'clients',
          secondButtonLabel: null,
          secondButtonRedirectTo: null,
        },
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Ícono de evaluaciones',
          title: 'Evaluaciones',
          firstButtonLabel: 'Ver Evaluaciones',
          firstButtonRedirectTo: 'evaluations',
          secondButtonLabel: null,
          secondButtonRedirectTo: null,
        },
        {
          imageUrl: './assets/img/principal-page/tracing.png',
          imageAlt: 'Ícono de seguimiento',
          title: 'Seguimiento',
          firstButtonLabel: 'Ver Seguimiento',
          firstButtonRedirectTo: 'tracking',
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
          imageAlt: 'Clients icon',
          title: 'Clients',
          firstButtonLabel: 'Go to Clients',
          firstButtonRedirectTo: 'clients',
        },
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Evaluations icon',
          title: 'Evaluations',
          firstButtonLabel: 'Go to Evaluations',
          firstButtonRedirectTo: 'evaluations',
        },
        {
          imageUrl: './assets/img/principal-page/tracing.png',
          imageAlt: 'Tracking icon',
          title: 'Tracing',
          firstButtonLabel: 'Go to Tracing',
          firstButtonRedirectTo: 'tracking',
        },
      ],
    },
  };

  /**
   * Labels and routerLinks on sidebar of clients for  administrator.
   */
  public static SIDEBAR_ADMINISTRATOR_CLIENTS_OPTIONS = {
    es: [
      {
        label: 'Crear Nuevo',
        routerLink: '/administrator/clients/new-client',
      },
      {
        label: 'Ver Clientes',
        routerLink: '/administrator/clients/view-client',
        action: () => {
          const sharedService = new SharedService();
          sharedService.deleteItemFromLocalStorage('persistentOptions');
        },
      },
    ],
    en: [
      {
        label: 'Create New',
        routerLink: '/administrator/clients/new-client',
      },
      {
        label: 'See Clients',
        routerLink: '/administrator/clients/view-client',
      },
    ],
  };
}
export {AdministratorConstants};
