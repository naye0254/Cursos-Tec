import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component wcag rules
 */
@Injectable()
class WcagRulesConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = [
    'criterio',
    'principle',
    'pattern',
    'description',
    'isActiveLabel',
    'edit',
  ];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de criterios',
    },
    en: {
      title: 'List of wcag rules',
    },
  };

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_WCAGRULE_OPTIONS = {
    lengthInputNumberCriterion: 45,
    lengthInputName: 255,
    lengthInputReferenceLink: 200,
    lengthInputLevel: 4,
    lengthInputCriterionDescription: 1500,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay criterios con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no wcag rules with the selected state',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Criterio' : 'Crear Criterio',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Criterion' : 'Create Criterion',
        btnOkTextModal: isToEdit ? 'Update' : 'Edit',
        btnCancelTextModal: 'Cancel',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {WcagRulesConstants};
