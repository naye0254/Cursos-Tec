import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component TypeDisabilities
 */
@Injectable()
class SupportToolsConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = [
    'supportTool',
    'version',
    'disabilityType',
    'state',
    'edit',
  ];

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_SUPPORT_TOOLS_OPTIONS = {
    lengthName: 255,
    lengthVersion: 15,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults:
        'Actualmente no hay herramientas de apoyo con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults:
        'There are currently no support tools with the selected state',
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
          ? 'Editar Herramienta de apoyo'
          : 'Crear Herramienta de apoyo',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Support Tool' : 'Create Support Tool',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {SupportToolsConstants};
