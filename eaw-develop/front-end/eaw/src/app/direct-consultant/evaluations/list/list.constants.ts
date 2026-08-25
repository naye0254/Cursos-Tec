import {Injectable} from '@angular/core';
import {CommonConstants} from '../../../common/common.constants';

/**
 * Class to manage the constants of the component evaluations
 */
@Injectable()
class ListConstants {
  /**
   * Columns displayed by the table for admin user
   */
  public static TABLE_COLUMS = [
    'name',
    'url',
    'packages',
    'specifications',
    'inCharge',
    'state',
  ];

  /**
   * Object options for the tile HTML
   */
  public static HTML_TITLE = {
    es: {
      title: 'Lista de evaluaciones',
    },
    en: {
      title: 'List of evaluations',
    },
  };

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS = {
    es: {
      notFilterResults: '¡No se encontraron resultados para su búsqueda!',
      notResults: 'Actualmente no hay evaluaciones con el estado seleccionado',
    },
    en: {
      notFilterResults: 'No results for your search!',
      notResults: 'There are currently no evaluations with the selected state',
    },
  };

  /**
   * String states for plural values
   */
  public static STR_STATES_PLURAL = {
    es: () => {
      const objectStates = {};
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PENDING}`] =
        'Pendientes';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PROGRESS}`] =
        'En Progreso';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.FINISHED}`] =
        'Finalizadas';
      return objectStates;
    },
    en: () => {
      const objectStates = {};
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PENDING}`] =
        'Pendings';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PROGRESS}`] =
        'In Progress';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.FINISHED}`] =
        'Finished';
      return objectStates;
    },
  };

  /**
   * String states for singular values
   */
  public static STR_STATES_SINGULAR = {
    es: () => {
      const objectStates = {};
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PENDING}`] =
        'Pendiente';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PROGRESS}`] =
        'En Progreso';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.FINISHED}`] =
        'Finalizada';
      return objectStates;
    },
    en: () => {
      const objectStates = {};
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PENDING}`] = 'Pending';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.PROGRESS}`] =
        'In Progress';
      objectStates[`${CommonConstants.EVALUATIONS_STATES.FINISHED}`] =
        'Finished';
      return objectStates;
    },
  };
}
export {ListConstants};
