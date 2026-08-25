'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');

/**
 * Manage Pages model services logic.
 */
module.exports = function PagesServices() {
  const eawConstants = new EAWConstants();
  const evaluationsModel = app.models.Evaluations;

  /**
   * Save random generated pages and save that list of pages
   * in Pages model and update the json selectedMapSite in
   * evaluation model.
   * @param {number} idEvaluation
   */
  this.saveRandomSelectedPages = async function(idEvaluation) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const randomPageList = await this.generateRandomPagesList(idEvaluation);
      const pagesUrlHash = {};
      let selectedPageNodeOptions = {
        url: '',
        color: '#0F828A',
        textcolor: '#FFFFFF',
        isSelected: true,
      };
      for (const selectedPage of randomPageList.results.selectedPages) {
        await this.createPage(idEvaluation, selectedPage.url, selectedPage.topic);
        pagesUrlHash[selectedPage.url] = null;
      }
      let parsedSiteMap = await evaluationsModel.getParsedSiteMap(idEvaluation);
      for (let index = 0; index < parsedSiteMap.nodes.length; index++) {
        const pageNode = parsedSiteMap.nodes[index];
        const url = pageNode.options.url;
        if (url in pagesUrlHash) {
          selectedPageNodeOptions.url = url;
          parsedSiteMap.nodes[index].options = selectedPageNodeOptions;
        }
      }
      parsedSiteMap.selectedCount = randomPageList.count;
      returnObj.results = await evaluationsModel.update(
        {
          id: idEvaluation,
        },
        {
          pagesChoosed: eawConstants.PagesChoosedStates.SELECTED,
          selectedSiteMap: JSON.stringify(parsedSiteMap),
        },
      );

      return returnObj;
    } catch (error) {
      await evaluationsModel.update(
        {id: idEvaluation},
        {
          pagesChoosed: eawConstants.PagesChoosedStates.FAILED,
        },
      );
      throw handleError(error, 'saveRandomSelectedPages', idEvaluation);
    }
  };

  /**
   * Get an array of pages and save those pages
   * list in Pages model
   * @param {number} idEvaluation
   * @param {Array<Object>} selectedPagesList
   */
  this.saveSelectedPages = async function(
    idEvaluation,
    selectedPagesList,
    selectedSiteMap,
  ) {
    try {
      if (selectedPagesList.length == 0) {
        throw new Error('Error: No pages selected');
      }
      for (let selectedPage of selectedPagesList) {
        await this.createPage(idEvaluation, selectedPage.url, selectedPage.topic);
      }
      await evaluationsModel.update(
        {
          id: idEvaluation,
        },
        {
          pagesChoosed: eawConstants.PagesChoosedStates.SELECTED,
          selectedSiteMap: selectedSiteMap,
        },
      );
      return selectedPagesList;
    } catch (error) {
      await evaluationsModel.update(
        {id: idEvaluation},
        {
          pagesChoosed: eawConstants.PagesChoosedStates.FAILED,
        },
      );
      throw handleError(error, 'saveSelectedPages', idEvaluation);
    }
  };

  /**
   * Create insert a page in Pages db model
   * @param {number} idEvaluation
   * @param {string} currentURL
   * @param {string} domain
   * @param {string} title
   */
  this.createPage = async function (idEvaluation, currentURL, title) {
    let response = {};
    try {
      let slicedTitle = '';
      try {
        slicedTitle = title.slice(0, 224);
      } catch (error) {
        handleError(error, 'createPage > slice title error');
      }

      let pageData = {
        evaluationsId: idEvaluation,
        url: currentURL,
        title: slicedTitle,
      };
      response = await app.models.Pages.create(pageData);
      return response;
    } catch (error) {
      return handleError(error, 'createPage', idEvaluation);
    }
  }

  /**
   * Obtain a list of pages. For automatic results, dont
   * let repeated pages.
   * @param {number} idEvaluation
   */
  this.generateRandomPagesList = async function(idEvaluation) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const evaluation = await evaluationsModel.findOne({
        where: {
          id: idEvaluation,
        },
        fields: {
          siteMap: true,
          packagesId: true,
        },
      });
      const siteMap = await JSON.parse(evaluation.siteMap);
      const LIMIT_PAGES = 31;
      const flatSiteMap = await flatObject(siteMap.data);
      const numbers = {};
      const selectedPages = [];
      const rootLink = flatSiteMap[0].Url;
      selectedPages.push({
        topic: flatSiteMap[0].topic,
        url: rootLink,
      });

      if (flatSiteMap.length <= LIMIT_PAGES + 1) {
        for (let i = 0; i < flatSiteMap.length; i++) {
          if (flatSiteMap[i].Url !== rootLink) {
            selectedPages.push({
              topic: flatSiteMap[i].topic,
              url: flatSiteMap[i].Url,
            });
          }
        }
      } else {
        let randomNumber = 1;
        for (let i = 0; i < LIMIT_PAGES; i++) {
          randomNumber = await randomIntInc(1, flatSiteMap.length - 1);
          if (
            randomNumber in numbers ||
            flatSiteMap[randomNumber].Url === rootLink
          ) {
            i--;
          } else {
            numbers[randomNumber] = 1;
            selectedPages.push({
              topic: flatSiteMap[randomNumber].topic,
              url: flatSiteMap[randomNumber].Url,
            });
          }
        }
      }

      returnObj.results = {
        idEvaluation: idEvaluation,
        idPackage: evaluation.packagesId,
        selectedPages: selectedPages,
      };
      returnObj.count = selectedPages.length;
    } catch (error) {
      throw handleError(error, 'getRandomSelectPages', idEvaluation);
    }

    return await returnObj;
  };

  /**
   * Get a json object with any valid format
   * and returns an array with all nodes
   * found in the json
   * @param {Object} obj
   * @returns {Array}
   */
  function flatObject(obj) {
    try {
      const flatten = (children, extractChildren, level, parentid) =>
        Array.prototype.concat.apply(
          children.map(x => ({
            ...x,
            level: level || 1,
            parentid: parentid || null,
          })),
          children.map(x =>
            flatten(
              extractChildren(x) || [],
              extractChildren,
              (level || 1) + 1,
              x.id,
            ),
          ),
        );
      const extractChildren = x => x.children;
      const flat = flatten(extractChildren(obj), extractChildren).map(
        x => delete x.children && x,
      );
      return flat;
    } catch (error) {
      return handleError(error, 'flatObject');
    }
  }

  /**
   * Returns a random number in the range of
   * the numbers provided.
   * @param {number} low
   * @param {number} high
   */
  async function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, idEvaluation = null) {
    new CustomErrorLog(
      'BE > AdministratorPagesServices > ' + functionName,
      error,
      idEvaluation,
    ).saveError();
    return error;
  }
};
