import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component TypeDisabilities
 */
@Injectable()
class TypeDisablitiesConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = ['name', 'isActiveLabel', 'edit'];

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_DISABILITY_OPTIONS = {
    lengthInputName: 255,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults:
        'Actualmente no hay tipos de discapacidad con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults:
        'There are currently no disability types with the selected state',
    },
  };

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de tipos de discapacidad',
    },
    en: {
      title: 'List of types of disability',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit
          ? 'Editar Tipo de Discapacidad'
          : 'Crear Tipo de Discapacidad',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit
          ? 'Edit Type of Disability'
          : 'Create Disability Type',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {TypeDisablitiesConstants};
