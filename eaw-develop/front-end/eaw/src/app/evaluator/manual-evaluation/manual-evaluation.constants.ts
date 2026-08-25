import {Injectable} from '@angular/core';

/**
 * Class to manage the constants of the component packages
 */
@Injectable()
export class ManualEvaluationConstants {
  /**
   * Radio buttons values.
   */
  public static RADIO_VALUES = {
    COMPLY: 1,
    NO_COMPLY: -1,
    NOT_APPLY: 0,
  };

  /**
   * ArrayForm Principles names
   */
  public static PRINCIPLES = [
    'answersPerceivable',
    'answersOperable',
    'answersUnderstandable',
    'answersRobust',
  ];

  /**
   * Principle names
   */
  public static PRINCIPLES_NAME = [
    'perceivable',
    'operable',
    'understandable',
    'robust',
  ];
}
