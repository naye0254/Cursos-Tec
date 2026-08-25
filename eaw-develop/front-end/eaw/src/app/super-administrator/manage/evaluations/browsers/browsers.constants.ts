import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component browsers
 */
@Injectable()
class BrowsersConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = [
    'name',
    'browserVersion',
    'isActiveLabel',
    'edit',
  ];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de navegadores',
    },
    en: {
      title: 'List of browsers',
    },
  };

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_BROWSER_OPTIONS = {
    lengthInputName: 128,
    lengthInputBrowserVersion: 50,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay navegadores con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no browsers with the selected state',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Navegador' : 'Crear Navegador',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Browser' : 'Create Browser',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancel',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {BrowsersConstants};
