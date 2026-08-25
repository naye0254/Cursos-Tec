import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component Evaluator
 */
@Injectable()
class EvaluatorConstants {
  public static TABLE_COLUMS = [
    'firstName',
    'typesOfDiscapacity',
    'evaluationsCompleted',
    'isActiveLabel',
    'edit',
  ];

  public static TABLE_LABELS = {
    itemPerPage: 'Items por página',
    nextPageLabel: 'Siguiente',
    previousPageLabel: 'Anterior',
    lastPageLabel: 'Última página',
    firstPageLabel: 'Primera página',
  };

  public static FORM_MANAGE_PROMOTER_OPTIONS = {
    lengthInputFirstName: 255,
    lengthInputLastName: 255,
    lengthInputEmail: 255,
    lengthInputTelephone: 30,
    lengthInputPassword: 255,
    lengthInputUserName: 255,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay evaluadores con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no evaluators with the selected state',
    },
  };

  /**
   * Function to build the modal options
   * @param isToEdit Indicate the mode of the modal
   * @param lang Indicate the lang to build the modal
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Evaluador(a)' : 'Crear Evaluador(a)',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '40%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Evaluator' : 'Create Evaluator',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancelar',
        withModal: '40%',
      };
    }
    return returnObj;
  };
}
export {EvaluatorConstants};
