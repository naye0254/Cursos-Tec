import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component segments
 */
@Injectable()
class SegmentsConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = ['segment', 'country', 'isActiveLabel', 'edit'];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de segmentos',
    },
    en: {
      title: 'List of segments',
    },
  };

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_SEGMENT_OPTIONS = {
    lengthInputName: 255,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay segmentos con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no segments with the selected state',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Segmento' : 'Crear Segmento',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Segment' : 'Create Segment',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancel',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {SegmentsConstants};
