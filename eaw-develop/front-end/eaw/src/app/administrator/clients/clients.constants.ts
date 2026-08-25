import {Injectable} from '@angular/core';

@Injectable()
/**
 * Class to manage constants for clients
 */
class ManageClientsConstants {
  /**
   * Object options for the tile HTML
   */
  public static HTML_NEW_TITLE = {
    es: {
      title: 'Nuevo Cliente',
    },
    en: {
      title: 'New Client',
    },
  };

  public static VIEW_CLIENTS = {
    es: {
      titleHtml: 'Filtro de Clientes',
      subtitleCountry:
        'Seleccione el país al que pertenece el cliente que desea visualizar',
      subtitleSegment:
        'Seleccione el segmento al que pertenece el cliente que desea visualizar',
    },
    en: {
      titleHtml: 'Filter Clients',
      subtitleCountry: 'Choose the country of the client what you want to see',
      subtitleSegment: 'Choose the segment of the client what you want to see',
    },
  };

  public static LIST_CLIENTS = {
    es: {
      title: 'Ver Clientes: ',
      allClientLabel: 'Todos',
    },
    en: {
      title: 'See Clients: ',
      allClientLabel: 'All',
    },
  };

  public static SEE_ALL_LABEL = {
    es: {
      seeAll: 'Ver todos',
    },
    en: {
      seeAll: 'See All',
    },
  };

  /**
   * Options to the creation modal of clients
   */
  public static FORM_MANAGE_CLIENTS_OPTIONS = {
    lengthInputName: 255,
    lengthInputEmail: 255,
    lengthInputTelephone: 30,
    lengthInputPassword: 255,
    lengthInputCity: 255,
    lengthInputCountryRegion: 255,
    lengthInputPostalCode: 255,
    lengthInputAddress: 255,
  };
}
export {ManageClientsConstants};
