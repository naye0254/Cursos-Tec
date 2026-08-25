import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component evaluations
 */
@Injectable()
class FindingsConstants {
  /**
   * Evaluations states
   */
  public static EVALUATION_STATES = {
    AUTOMATIC: 0,
    MANUAL: 1
  };

  /**
   * Principle titles
   */
  public static PRINCIPLE_TITLE = {
    perceivable: 'Principio Perceptible',
    operable: 'Principio Operable',
    understandable: 'Principio Distinguible',
    robust: 'Principio Robusto'
  };

  // Paginator initial values
  public static pagConfig = {
    itemsPerPage: 100,
    currentPage: 1,
    totalItems: 0
  };
}
export {FindingsConstants};
