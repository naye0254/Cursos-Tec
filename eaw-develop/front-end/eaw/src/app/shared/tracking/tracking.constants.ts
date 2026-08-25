import {Injectable} from '@angular/core';

@Injectable()
class TrackingPageConstants {
  public static TABLE_COLUMS = [
    'name',
    'segment',
    'specifications',
    'beginDate',
    'endDate',
    'stats',
  ];

  public static TABLE_GRAPH = [
    'url',
    'browser',
    'device',
    'operativeSystem',
    'supportTool',
    'disability',
    'finishedAt',
  ];

  public static TABLE_LABELS = {
    itemPerPage: 'Items por página',
    nextPageLabel: 'Siguiente',
    previousPageLabel: 'Anterior',
    lastPageLabel: 'Última página',
    firstPageLabel: 'Primera página',
  };

  /**
   * Object options for the tile HTML for list evaluations
   */
  public static HTML_TITLE_LIST_EVALUATIONS = {
    es: {
      title: 'Lista de evaluaciones por evaluador',
    },
    en: {
      title: 'List of evaluations by evaluator',
    },
  };

  /**
   * Object options for the tile HTML for list evaluations
   */
  public static HTML_TITLE_LIST_EVALUATORS = {
    es: {
      title: 'Lista de evaluadores',
    },
    en: {
      title: 'List of evaluators',
    },
  };

  /**
   * Object options for the tile HTML for graph page
   */
  public static HTML_TITLE_GRAPHS = {
    es: {
      title: 'Páginas evaluadas',
    },
    en: {
      title: 'Pages Evaluated',
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

  /** Object the content the message for not results componets */
  public static EMPTY_RESULTS_GRAPHS = {
    es: {
      notResults:
        'El evaluador no ha completado la evaluación de ninguna página',
    },
    en: {
      notResults: 'The evaluator has not completed the evaluation of any page',
    },
  };
}
export {TrackingPageConstants};
