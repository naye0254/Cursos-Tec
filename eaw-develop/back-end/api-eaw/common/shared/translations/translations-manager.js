'use strict';

const CustomErrorLog = require('../shared-services/errorLog-shared-services');
const fs = require('fs');

/**
 * Open a respective folder inside
 * translations folder and manage the
 * json files that must be inside.
 */
module.exports = class TranslationsManager {
  /**
   * Name of a folder inside translations folder.
   * @param {string} translationsFolderName
   */
  constructor(translationsFolderName) {
    this.translationsFolderPath = `./common/shared/translations/${translationsFolderName}`;
  }

  /**
   * Returns a json for the respective language file,
   * spanish by default.
   * @param {string} iana
   * @returns {json}
   */
  async getTranslation(iana) {
    try {
      let fileName = 'es.json';
      if (await this.languageIsAvailable(iana)) {
        fileName = `${iana}.json`;
      } else {
        throw new Error(
          'The following language is not supported. Folder: ' +
            translationsFolderName +
            ' lang: ' +
            iana,
        );
      }
      const jsonString = await fs.readFileSync(
        this.translationsFolderPath + '/' + fileName,
      );
      const traduction = JSON.parse(jsonString);
      return traduction;
    } catch (error) {
      return this.handleError(error, 'getTradution');
    }
  }

  /**
   * Check if a file of a specific language exist in a directory.
   * @param {string} iana
   * @returns {boolean}
   */
  async languageIsAvailable(iana) {
    try {
      const fileName = `${iana}.json`;
      const availableLanguages = await fs.readdirSync(
        this.translationsFolderPath,
      );
      return availableLanguages.includes(fileName);
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  handleError(error, functionName) {
    new CustomErrorLog(
      'BE > Traductions-manager >' + functionName,
      error,
    ).saveError();
    return error;
  }
};
