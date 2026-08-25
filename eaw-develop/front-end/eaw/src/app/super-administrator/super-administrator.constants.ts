import {Injectable} from '@angular/core';

/**
 * Class for manage super administrator constants
 */
@Injectable()
class SuperAdministratorConstants {
  /**
   * Routerlink to profile for super administrator
   */
  public static MENU_SUPER_ADMINISTRATOR_OPTIONS = {
    routerLink: '/super-administrator/profile'
  };

  /**
   * Labels and routerLinks on navbar for super administrator
   */
  public static NAVBAR_SUPER_ADMINISTRATOR_OPTIONS = {
    es: [
      {
        label: 'Inicio',
        routerLink: '/super-administrator',
        root: true
      },
      {
        label: 'Clientes',
        routerLink: 'clients'
      },
      {
        label: 'Evaluaciones',
        routerLink: 'evaluations'
      },
      {
        label: 'Estadísticas',
        routerLink: 'statistics'
      },
      {
        label: 'Gestión',
        routerLink: 'manage'
      },
      {
        label: 'Seguimiento',
        routerLink: 'tracking'
      }
    ],
    en: [
      {
        label: 'Home',
        routerLink: '/super-administrator',
        root: true
      },
      {
        label: 'Clients',
        routerLink: 'clients'
      },
      {
        label: 'Evaluations',
        routerLink: 'evaluations'
      },
      {
        label: 'Statistics',
        routerLink: 'statistics'
      },
      {
        label: 'Manage',
        routerLink: 'manage'
      },
      {
        label: 'Tracing',
        routerLink: 'tracking'
      }
    ]
  };

  /**
   * Labels and routerLinks on sidebar of manage for super administrator.
   */
  public static SIDEBAR_SUPER_ADMINISTRATOR_MANAGE_OPTIONS = {
    es: [
      {
        label: 'Promotores',
        routerLink: '/super-administrator/manage/promoters/list-promoter'
      },
      {
        label: 'Discapacidad',
        routerLink: 'disability',
        children: [
          {
            label: 'Tipos de Discapacidad',
            routerLink: '/super-administrator/manage/disability/type-disability'
          },
          {
            label: 'Herramientas de Apoyo',
            routerLink: '/super-administrator/manage/disability/support-tools'
          }
        ]
      },
      {
        label: 'Evaluadores',
        routerLink: '/super-administrator/manage/evaluators/'
      },
      {
        label: 'Segmentos de Organizaciones',
        routerLink: 'segments'
      },
      {
        label: 'Evaluaciones',
        routerLink: 'evaluations',
        children: [
          {
            label: 'Paquetes',
            routerLink: '/super-administrator/manage/evaluations/package'
          },
          {
            label: 'Dispositivos',
            routerLink: '/super-administrator/manage/evaluations/devices'
          },
          {
            label: 'Navegadores',
            routerLink: '/super-administrator/manage/evaluations/browsers'
          },
          {
            label: 'Normas WCAG',
            routerLink: '/super-administrator/manage/evaluations/wcag-rules'
          }
        ]
      }
    ],
    en: [
      {
        label: 'Promoters',
        routerLink: '/super-administrator/manage/promoters/list-promoter'
      },
      {
        label: 'Disability',
        routerLink: 'disability',
        children: [
          {
            label: 'Types of Disability',
            routerLink: '/super-administrator/manage/disability/type-disability'
          },
          {
            label: 'Support Tools',
            routerLink: '/super-administrator/manage/disability/support-tools'
          }
        ]
      },
      {
        label: 'Evaluators',
        routerLink: '/super-administrator/manage/evaluators/'
      },
      {
        label: 'Organizations Segments',
        routerLink: 'segments'
      },
      {
        label: 'Evaluations',
        routerLink: 'evaluations',
        children: [
          {
            label: 'Packages',
            routerLink: '/super-administrator/manage/evaluations/package'
          },
          {
            label: 'Devices',
            routerLink: '/super-administrator/manage/evaluations/devices'
          },
          {
            label: 'Browsers',
            routerLink: '/super-administrator/manage/evaluations/browsers'
          },
          {
            label: 'WCAG Standards',
            routerLink: '/super-administrator/manage/evaluations/wcag-rules'
          }
        ]
      }
    ]
  };

  /**
   * Labels and routerLinks on sidebar of list evaluations for super administrator.
   */
  public static SIDEBAR_SUPER_ADMINISTRATOR_LIST_EVALUATIONS_OPTIONS = {
    es: [
      {
        label: 'Evaluaciones',
        routerLink: '/super-administrator/evaluations'
      }
    ],
    en: [
      {
        label: 'Evaluations',
        routerLink: '/super-administrator/evaluations'
      }
    ]
  };

  public static SIDEBAR_SUPER_ADMINISTRATOR_EVALUATIONS_REPORTS_OPTIONS = {
    es: [
      {
        label: 'Informes',
        routerLink: '/super-administrator/evaluations'
      }
    ],
    en: [
      {
        label: 'Reports',
        routerLink: '/super-administrator/evaluations'
      }
    ]
  };

  /**
   * Labels and routerLinks on sidebar of clients for super administrator.
   */
  public static SIDEBAR_SUPER_ADMINISTRATOR_CLIENTS_OPTIONS = {
    es: [
      {
        label: 'Ver Clientes',
        routerLink: '/super-administrator/clients/list-clients'
      }
    ],
    en: [
      {
        label: 'List Clients',
        routerLink: '/super-administrator/clients/list-clients'
      }
    ]
  };

  /**
   * Labels and routerLinks on sidebar of clients for super administrator.
   */
  public static SIDEBAR_SUPER_ADMINISTRATOR_STATISTICS_OPTIONS = {
    es: [
      {
        label: 'Cantidad de Evaluaciones',
        routerLink: '/super-administrator/statistics/evaluations-quantity'
      }
    ],
    en: [
      {
        label: 'Evaluations Quantity',
        routerLink: '/super-administrator/statistics/evaluations-quantity'
      }
    ]
  };

  /**
   * Super admin options to principal menu
   */
  public static PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS = {
    es: {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Ícono de clientes',
          title: 'Clientes',
          firstButtonLabel: 'Ver Clientes',
          firstButtonRedirectTo: 'clients/list-clients',
          secondButtonLabel: null,
          secondButtonRedirectTo: null
        },
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Ícono de evaluaciones',
          title: 'Evaluaciones',
          firstButtonLabel: 'Ver Evaluaciones',
          firstButtonRedirectTo: 'evaluations',
          secondButtonLabel: null,
          secondButtonRedirectTo: null
        },
        {
          imageUrl: './assets/img/principal-page/tracing.png',
          imageAlt: 'Ícono de seguimiento',
          title: 'Seguimiento',
          firstButtonLabel: 'Ver Seguimiento',
          firstButtonRedirectTo: 'tracking',
          secondButtonLabel: null,
          secondButtonRedirectTo: null
        }
      ]
    },
    en: {
      title: 'Welcome!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Clients icon',
          title: 'Clients',
          firstButtonLabel: 'Go to Clients',
          firstButtonRedirectTo: 'clients/list-clients'
        },
        {
          imageUrl: './assets/img/principal-page/evaluaciones.png',
          imageAlt: 'Evaluations icon',
          title: 'Evaluations',
          firstButtonLabel: 'Go to Evaluations',
          firstButtonRedirectTo: 'evaluations'
        },
        {
          imageUrl: './assets/img/principal-page/tracing.png',
          imageAlt: 'Tracking icon',
          title: 'Tracing',
          firstButtonLabel: 'Go to Tracing',
          firstButtonRedirectTo: 'tracking'
        }
      ]
    }
  };
}
export {SuperAdministratorConstants};
