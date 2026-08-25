import {Injectable} from '@angular/core';
import {elementEventFullName} from '@angular/compiler/src/view_compiler/view_compiler';

@Injectable()
class ClientsPageConstants {
  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de clientes',
    },
    en: {
      title: 'List of clients',
    },
  };

  public static HTML_EDIT_CLIENT = {
    es: {
      title: 'Editar cliente'
    },
    en: {
      title: 'Edit client'
    }
  };
  
  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay clientes con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no clients with the selected state',
    },
  };

  public static FORMAT_DATE = 'YYYY-MM-DD';

  public static TABLE_COLUMS = [
    'name',
    'email',
    'countryRegion',
    'evaluations',
    'createdBy',
    'createdAt',
    'isActiveLabel',
  ];

  public static TABLE_LABELS = {
    itemPerPage: 'Items por página',
    nextPageLabel: 'Siguiente',
    previousPageLabel: 'Anterior',
    lastPageLabel: 'Última página',
    firstPageLabel: 'Primera página',
  };

  public static FORM_MANAGE_CLIENTS_OPTIONS = {
    lengthInputName: 255,
    lengthInputEmail: 255,
  };

  public static FORM_EDIT_CLIENTS_OPTIONS = {
    lengthInputName: 255,
    lengthInputEmail: 255,
    lengthInputTelephone: 30,
    lengthInputPassword: 255,
    lengthInputCity: 255,
    lengthInputCountryRegion: 255,
    lengthInputPostalCode: 255,
    lengthInputAddress: 255,
  };

  public static MANAGE_MODAL_OPTIONS = (isSpanishSelected: boolean) => {
    return {
      title: isSpanishSelected ? 'Búsqueda Avanzada' : 'Advanced search',
      btnOkTextModal: isSpanishSelected ? 'Buscar' : 'Search',
      btnCancelTextModal: isSpanishSelected ? 'Cancelar' : 'Cancel',
      withModal: '40%',
    };
  };
}
export {ClientsPageConstants};
