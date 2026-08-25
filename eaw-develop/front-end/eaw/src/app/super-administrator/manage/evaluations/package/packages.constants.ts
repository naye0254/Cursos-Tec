import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component packages
 */
@Injectable()
class PackagesConstants {
  /**
   * Columns displayed by the table
   * Column 'edit' is currently not supported
   */
  public static TABLE_COLUMS = ['name', 'isActiveLabel'];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de paquetes',
    },
    en: {
      title: 'List of packages',
    },
  };

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_PROMOTER_OPTIONS = {
    lengthInputName: 255,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay paquetes con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no packages with the selected state',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Paquete' : 'Crear Paquete',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Package' : 'Create Package',
        btnOkTextModal: isToEdit ? 'Update' : 'Edit',
        btnCancelTextModal: 'Cancel',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {PackagesConstants};
