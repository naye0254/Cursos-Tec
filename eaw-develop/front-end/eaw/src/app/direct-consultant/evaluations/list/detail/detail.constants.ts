import {Injectable} from '@angular/core';
import {CommonConstants} from '../../../../common/common.constants';

/**
 * Class to manage the constants of detail component
 */
@Injectable()
class DetailConstants {
  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Estadísticas',
    },
    en: {
      title: 'Statistics',
    },
  };

  /**
   * Object options for buttons state
   */
  public static BUTTON_STATE = {
    es: {
      active: 'activo',
      inactive: 'desactivo',
    },
    en: {
      active: 'active',
      inactive: 'inactive',
    },
  };
}
export {DetailConstants};
