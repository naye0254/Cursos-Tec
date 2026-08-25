'use strict';

class EAWConstants {
  constructor() {
    this.MySQL_ER_DUP_ENTRY_ERRNO = 1062;
    this.SUPER_ADMINISTRATOR_ROLE_ID = 1;
    this.PROMOTER_ROLE_ID = 2;
    this.EVALUATOR_ROLE_ID = 3;
    this.DIRECT_CLIENT_ROLE_ID = 4;
    this.EvaluationStates = {
      FAILED: -1,
      PENDING: 0,
      PROGRESS: 1,
      FINISHED: 2,
      STR_FAILED: 'Fallido',
      STR_PENDING: 'Pendiente',
      STR_PROGRESS: 'Progreso',
      STR_FINISHED: 'Finalizado'
    };

    this.packagesTypes = {
      AUTOMATIC_RANDOM: 1,
      AUTOMATIC_SPECIFIC: 2,
      MANUAL_SPECIFIC: 3,
      COMPLETE_RANDOM: 4
    };

    this.NOTIFICATION_STATES = {
      UNSEEN: 0,
      SEEN: 1
    };

    this.NOTIFICATION_LIMIT = 3;

    // TODO: change endpoints to PROD endpoints.
    this.EnvVars = {
      API_ENDPOINT: `http://192.1.2.6:5280`,
      ENDPOINT: `http://192.1.2.6/#/`
    };

    this.REPORTS_ENDPOINT = 'http://13.58.240.19:4100/jasperserver/rest_v2/reports/reports/EAW/';
    this.JASPERSERVER_USERNAME = 'sicid';
    this.JASPERSERVER_PASSWORD = 'sicidjasperadmin';

    this.emailOTAI = 'inclutec.notifications@gmail.com';

    this.OTAI_DEFAULT_LANGUAGE = 'es';

    this.ScrapingStates = {
      FAILED: -1,
      PENDING: 0,
      PROGRESS: 1,
      FINISHED: 2,
      STR_FAILED: 'Fallido',
      STR_PENDING: 'Pendiente',
      STR_PROGRESS: 'Progreso',
      STR_FINISHED: 'Finalizado'
    };

    this.ScrapingInitVariables = {
      CRAWLED_LIST: [],
      INBOUND_LINK_LIST: [],
      INCREMENTAL_ID: 1,
      SCRAPED_PAGES_COUNTER: 0,
      ACTUAL_CHECKPOINT: 10,
      CHECKPOINT_RATE: 50,
      SXRAPING_EXIT: false
    };

    this.PagesChoosedStates = {
      NON_SELECTED: 0,
      SELECTED: 1,
      STR_NON_SELECTED: 'Falta seleccionar',
      STR_SELECTED: 'Ya seleccionadas',
      FAILED: -1
    };

    this.EvaluationGeneralStates = {
      FAILED: -1,
      PENDING: 0,
      PROGRESS: 1,
      FINISHED: 2,
      STR_FAILED: 'Fallido',
      STR_PENDING: 'Pendiente',
      STR_PROGRESS: 'Progreso',
      STR_FINISHED: 'Finalizado'
    };

    this.RulesConstants = {
      RULE_MANUAL_EVAL: 'Ejecutar manual',
      RULE_AUTMATIC_EVAL: 'Ejecutar automático',
      PAGE_SELECTION_LIMIT: 32
    };

    this.StatisticsConstants = {
      AUTO_FINDING_TYPES: ['error', 'warning', 'notice'],
      MANUAL_FINDING_TYPES: ['No cumple', 'No aplica', 'Cumple'],
      TREAT_NOTICES_AS_WARNINGS: true
    };

    this.ConformityLevels = {
      LEVELS: {A: 'A', AA: 'AA', AAA: 'AAA'}
    };

    // All automatic findings uses NO_COMPLY except warnings and notices
    this.ComplyState = {
      COMPLY: 1,
      NO_COMPLY: -1,
      NO_APPLY: 0,
      RadioB_COMPLY: "'1'",
      RadioB_NO_COMPLY: "'-1'",
      RadioB_NO_APPLY: "'0'"
    };

    this.WCAG_2_0_CriterionIdLimits = {
      FIRST_ID: 1,
      LAST_ID: 61,
      MANUAL_EVAL_2_0_ONLY: false
    };

    this.ReportType = {
      MANAGERIAL: 1,
      TECHNICAL: 2
    };

    this.ReportStates = {
      PENDING: 0,
      PROGRESS: 1,
      FINISHED: 2,
      FAILED: -1
    };

    this.PATH_TREE = './server/local-storage/Trees/';

    this.CONTAINER_URL = 'containers/Trees/download/';

    this.ScrapingNotificationPaths = {
      SUCCESSFULL: 'shared.profile.notifications.scrapingFinished',
      FAIL: 'shared.profile.notifications.scrapingFailed'
    };

    this.pallyNotificationPaths = {
      SUCCESSFULL: 'shared.profile.notifications.pallyEvaluationFinished',
      FAIL: 'shared.profile.notifications.pallyEvaluationFailed'
    };

    this.reportNotificationsPaths = {
      SUCCESSFULL: 'shared.profile.notifications.reportFinished',
      FAIL: 'shared.profile.notifications.reportFailed'
    };

    this.EvaluatorFormConstants = {
      OBSERVATION_FIELDS: [
        'percetibleObservation',
        'operableObservation',
        'distinguishableObservation',
        'robustObservation'
      ]
    };

    this.GraphicTypesEnum = {
      bar: 'bar',
      column: 'column',
      pie: 'pie',
      donut: 'donut',
      spline: 'spline',
      stacked: 'stacked',
      stackedColumn: 'stackedColumn'
    };

    this.GeneralGraphicDataTypes = {
      AUTOMATIC: 'automatic',
      MANUAL: 'manual',
      BOTH: 'both'
    };

    // Notices appeard if pally can't evaluate automatically
    // some web part (need "pally actions") and warnings, if an error
    // would not be an error.
    this.PallyConstants = {
      CONFORMITY_LEVELS: {A: 'WCAG2A', AA: 'WCAG2AA', AAA: 'WCAG2AAA'},
      PALLY_SUCCESS_TEXT: 'Evaluación automática finalizada correctamente @itcr.ac.cr',
      PALLY_FAILED_TEXT: 'Ha fallado la evaluación automática @itcr.ac.cr',
      INCLUDE_NOTICES: false,
      INCLUDE_WARNINGS: true,
      FINDING_ERROR: 'error',
      FINDING_WARNING: 'warning',
      FINDING_NOTICE: 'notice',
      SPANISH_FINDING_TYPES: {
        error: 'error',
        warning: 'Advertencia',
        notice: 'Aviso'
      },

      /**
       * WCAG_2.1 criterion last updated: may 20, 2020
       * http://squizlabs.github.io/HTML_CodeSniffer/Standards/WCAG2/
       * Notices excluded
       */
      EVALUATED_CRITERION_LIST: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        23,
        24,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        43,
        44,
        48,
        50,
        51,
        53,
        54,
        56,
        60,
        61,
        62,
        63,
        65,
        74,
        75
      ]
    };
  }
}

module.exports = EAWConstants;
