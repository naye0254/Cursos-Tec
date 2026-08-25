import {Injectable} from '@angular/core';

@Injectable()
class PromotersPageConstants {
  public static TABLE_COLUMS = [
    'firstName',
    'email',
    'telephone',
    'clientsCreated',
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

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de promotores',
    },
    en: {
      title: 'List of promoters',
    },
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay promotores con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no promoters with the selected state',
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
        titleText: isToEdit ? 'Editar Promotor(a)' : 'Crear Promotor(a)',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '40%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Promoter' : 'Create Promoter',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancelar',
        withModal: '40%',
      };
    }
    return returnObj;
  };
}
export {PromotersPageConstants};
