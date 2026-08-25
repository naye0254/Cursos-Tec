import {Injectable} from '@angular/core';
import {CommonConstants} from '../../../common/common.constants';

/**
 * Class to manage the constants of request Component
 */
@Injectable()
class RequestConstants {
  /**
   * Forms options
   */
  public static FORM_OPTIONS = {
    lengthInputDescription: 500,
  };
}
export {RequestConstants};
