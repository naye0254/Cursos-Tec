import {Injectable} from '@angular/core';

/**
 * Class for new evaluations constants
 */
@Injectable()
class NewEvaluationsConstants {
  /**
   * Message to notify the error of duplicate data in step one
   */
  public static ERROR_DUPLICATE_DATA_STEP_ONE = {
    es: {
      title: 'Registros duplicados',
      body: 'Existen sitios a evaluar con el mismo nombre o link',
    },
    en: {
      title: 'Duplicate Data',
      body: 'There are duplicate sites with same name or link',
    },
  };

  /**
   * Message to notify the error of duplicate data in step two
   */
  public static ERROR_DUPLICATE_DATA_STEP_TWO = {
    es: {
      title: 'Registros duplicados',
      body: 'Existen especificaciones duplicadas',
    },
    en: {
      title: 'Duplicate Data',
      body: 'There are duplicate specifications',
    },
  };

  /**
   * Message to notify the error of duplicate data in step two
   */
  public static ERROR_INVALID_FORMS_STEP_TWO = {
    es: {
      title: 'Error',
      body: 'Existen formularios con campos invalidos',
    },
    en: {
      title: 'Error',
      body: 'There are forms with invalid fields',
    },
  };

  /**
   * Object with title for button continue step one
   */
  public static BTN_CONTINUE_STEP_ONE = isRegistering => {
    if (!isRegistering) {
      return {
        es: 'Continuar',
        en: 'Continue',
      };
    } else {
      return {
        es: 'Registrar',
        en: 'Register',
      };
    }
  };
}
export {NewEvaluationsConstants};
