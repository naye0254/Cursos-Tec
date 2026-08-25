import {Injectable} from '@angular/core';

/**
 * Common constants of the project
 */
@Injectable()
export class CommonConstants {
  /**
   * Values of status model
   */
  public static MODEL_STATUS = {
    ACTIVE: 1,
    INACTIVE: 0,
    ALL: null,
  };

  /**
   * Values of the modal status
   */
  public static MODAL_STATUS = {
    NEW: 0,
    UPDATE: 1,
  };

  /**
   * Key to store the user details in localStorage
   */
  public static KEY_USER_DETAILS = 'userDetail';

  /**
   * Key to store the loggued info for indirect client in localStorage
   */
  public static KEY_INDIRECT_CLIENT = 'isIndirectClient';

  /**
   * Key to store the evaluation id for indirect client in localStorage
   */
  public static KEY_EVALUATIONID_INDIRECT_CLIENT = 'evaluationIdIndirectClient';

  /**
   * Id values of roles
   */
  public static roles = {
    SuperAdministrator: 1,
    Promoter: 2,
    Evaluator: 3,
    DirectClient: 4,
  };

  /**
   * Sex orientations specifications
   */
  public static SEX_ORIENTATIONS = {
    male: 0,
    female: 1,
    undefined: 2,
  };

  /**
   * Notifications quantity for display in navbar
   */
  public static QUANTITY_NOTIFICATIONS = 3;

  /**
   * They keycodes of the keyboard inputs.
   */
  public static KEY_CODES = {
    enter: 13,
  };

  /**
   * Evaluations states constants
   */
  public static EVALUATIONS_STATES = {
    FAILED: -1,
    PENDING: 0,
    PROGRESS: 1,
    FINISHED: 2,
  };

  /**
   * Scraping states constants
   */
  public static SCRAPING_STATES = {
    FAILED: -1,
    PENDING: 0,
    PROGRESS: 1,
    FINISHED: 2,
  };

  /**
   * Packages constants
   */
  public static PACKAGES = {
    RAMDOM_AUTOMATIC: 1,
    SPECIFIC_AUTOMATIC: 2,
    SPECIFIC_MANUAL: 3,
    RAMDOM_COMPLETE: 4,
    RANDOM_MANUAL: 5,
  };

  /**
   * Reports states constants
   */
  public static REPORT_STATES = {
    FAILED: -1,
    PENDING: 0,
    PROGRESS: 1,
    FINISHED: 2,
  };
}
