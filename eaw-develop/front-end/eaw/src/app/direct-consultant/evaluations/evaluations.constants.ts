import {Injectable} from '@angular/core';

@Injectable()
/**
 * Class to manage constants for evaluations
 */
class EvaluationConstants {
  /**
   * Object options for the tile HTML
   */
  public static HTML_EVALUATIONS_TITLE = {
    es: {
      title: 'Ver Evaluaciones',
    },
    en: {
      title: 'See Evaluations',
    },
  };

  /**
   * Objecto to manage the view evaluations filter
   */
  public static VIEW_EVALUATIONS = {
    es: {
      titleHtml: 'Filtro de evaluaciones',
      subtitleYear:
        'Seleccione el año de las evaluaciones que desea visualizar',
      subtitleSegment:
        'Seleccione el segmento al que pertenece el cliente que desea visualizar',
      subtitleClient: 'Seleccione el cliente que desea visualizar',
    },
    en: {
      titleHtml: 'Filter Evaluations',
      subtitleYear: 'Choose the year of the evaluations what you want to see',
      subtitleSegment: 'Choose the segment of the client what you want to see',
      subtitleClient: 'Choose the client what you want to see',
    },
  };
}
export {EvaluationConstants};
