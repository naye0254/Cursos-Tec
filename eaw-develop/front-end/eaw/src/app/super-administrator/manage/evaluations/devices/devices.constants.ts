import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component devices
 */
@Injectable()
class DevicesConstants {
  /**
   * Columns displayed by the table
   */
  public static TABLE_COLUMS = [
    'device',
    'brand',
    'version',
    'operativeSystem',
    'edit',
  ];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de dispositivos',
    },
    en: {
      title: 'List of devices',
    },
  };

  /**
   * Options length for the form
   */
  public static FORM_MANAGE_DEVICE_OPTIONS = {
    lengthInputName: 255,
    lengthInputBrand: 50,
    lengthInputVersion: 15,
    lengthInputOperativeSystem: 50,
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay dispositivos con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no devices with the selected state',
    },
  };

  /**
   * Options for the form
   */
  public static MANAGE_MODAL_OPTIONS = (isToEdit: boolean, lang: string) => {
    let returnObj = {};
    if (lang === 'es') {
      returnObj = {
        titleText: isToEdit ? 'Editar Dispositivo' : 'Crear Dispositivo',
        btnOkTextModal: isToEdit ? 'Actualizar' : 'Crear',
        btnCancelTextModal: 'Cancelar',
        withModal: '30%',
      };
    } else if (lang === 'en') {
      returnObj = {
        titleText: isToEdit ? 'Edit Device' : 'Create Device',
        btnOkTextModal: isToEdit ? 'Update' : 'Create',
        btnCancelTextModal: 'Cancel',
        withModal: '30%',
      };
    }
    return returnObj;
  };
}
export {DevicesConstants};
