'use strict';

const app = require('../../../server/server');
const MONGO_ERROR_DUPPLICATE_KEY_CODE = 11000;

/**
 * db commands are runned directly in mongo,
 * that arent loopback commands, but Loopback
 * command are also used inside some functions.
 */
function MongoManager(globalEvaluationID) {
  /**
   * @param {Object} error
   * @param {number} idEvaluation
   */
  async function storeError(error, idEvaluation = globalEvaluationID) {
    await app.models.ScrapingErrorLogs.create({
      idEvaluation: idEvaluation,
      log: error,
    });
    return -1;
  }

  /*
   * Store statistic links
   * ***************************************************************
   */

  /**
   * Avoid dupplicates for absoluteLinksList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeAbsoluteLink = async function(
    link,
    idEvaluation = globalEvaluationID,
  ) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingAbsoluteLinks.create(
        stringObjId,
        function(error, data) {
          if (!error) {
            return appendAbsoluteLinkToMapSite(idEvaluation, link);
          } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
            storeError(error, idEvaluation);
            return -1;
          } else {
            return -1;
          }
        },
      );
      return await res;
    } catch (error) {
      storeError(error, idEvaluation);
      return -1;
    }
  };

  /**
   * Insert a link in the absoluteLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendAbsoluteLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {absoluteLinksList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /**
   * Avoid dupplicates for brokenLinksList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeBrokenLink = async function(
    link,
    idEvaluation = globalEvaluationID,
  ) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingBrokenLinks.create(
        stringObjId,
        function(error, data) {
          if (!error) {
            return appendBrokenLinkToMapSite(idEvaluation, link);
          } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
            storeError(error, idEvaluation);
            return -1;
          } else {
            return -1;
          }
        },
      );

      return await res;
    } catch (error) {
      storeError(error, idEvaluation);

      return -1;
    }
  };

  /**
   * Insert a link in the brokenLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendBrokenLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {brokenLinksList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /**
   * Avoid dupplicates for relativeLinksList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeRelativeLink = async function(
    link,
    idEvaluation = globalEvaluationID,
  ) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingRelativeLinks.create(
        stringObjId,
        function(error, data) {
          if (!error) {
            return appendRelativeLinkToMapSite(idEvaluation, link);
          } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
            storeError(error, idEvaluation);
            return -1;
          } else {
            return -1;
          }
        },
      );

      return await res;
    } catch (error) {
      storeError(error, idEvaluation);

      return -1;
    }
  };

  /**
   * Insert a link in the relativeLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendRelativeLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {relativeLinksList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /**
   * Avoid dupplicates for linkExceptionsList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeExceptionLink = async function(
    link,
    idEvaluation = globalEvaluationID,
  ) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingExceptionLinks.create(
        stringObjId,
        function(error, data) {
          if (!error) {
            return appendExceptionLinkToMapSite(idEvaluation, link);
          } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
            storeError(error, idEvaluation);
            return -1;
          } else {
            return -1;
          }
        },
      );

      return await res;
    } catch (error) {
      storeError(error, idEvaluation);

      return -1;
    }
  };

  /**
   * Insert a link in the exceptionLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendExceptionLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {linkExceptionsList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /**
   * Avoid dupplicates for desertedLinksList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeDesertedLink = async function(
    link,
    idEvaluation = globalEvaluationID,
  ) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingDesertedLinks.create(
        stringObjId,
        function(error, data) {
          if (!error) {
            return appendDesertedLinkToMapSite(idEvaluation, link);
          } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
            storeError(error, idEvaluation);
            return -1;
          } else {
            return -1;
          }
        },
      );

      return await res;
    } catch (error) {
      storeError(error, idEvaluation);

      return -1;
    }
  };

  /**
   * Insert a link in the desertedLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendDesertedLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {desertedLinksList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /**
   * Avoid dupplicates for fileList and insert link
   * in respective ScrapingMapSite collection.
   * @param {string} link
   * @param {number} idEvaluation
   */
  this.storeFileLink = async function(link, idEvaluation = globalEvaluationID) {
    let stringObjId = {
      _id: `{idEvaluation:${idEvaluation}, link:${link}}`,
      idEvaluation: idEvaluation,
    };
    try {
      let res = await app.models.ScrapingFileLinks.create(stringObjId, function(
        error,
        data,
      ) {
        if (!error) {
          return appendFileLinkToMapSite(idEvaluation, link);
        } else if (error.code != MONGO_ERROR_DUPPLICATE_KEY_CODE) {
          storeError(error, idEvaluation);
          return -1;
        } else {
          return -1;
        }
      });

      return await res;
    } catch (error) {
      storeError(error, idEvaluation);

      return -1;
    }
  };

  /**
   * Insert a link in the fileLinks list inside an object of
   * ScrapingSiteMap collection by evaluation.
   * @param {number} idEvaluation
   * @param {string} link
   */
  async function appendFileLinkToMapSite(idEvaluation, link) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let ScrapingSiteMap = db.collection('ScrapingSiteMap');
        ScrapingSiteMap.updateOne(
          {idEvaluation: idEvaluation},
          {$push: {fileList: link}},
          {upsert: true},
        )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  }

  /*
   * Delete collections by idEvaluation
   * *************************************************************
   */

  /**
   * Delete all documents from AbsoluteLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteAbsoluteLinks = async function(idEvaluation = globalEvaluationID) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingAbsoluteLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingErrorLogs collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingErrorLogs = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingErrorLogs.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingSiteMap collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingSiteMap = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingSiteMap.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingSiteMapUrls collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingSiteMapUrls = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingSiteMapUrls.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingAbsoluteLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingAbsoluteLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingAbsoluteLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingBrokenLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingBrokenLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingBrokenLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingRelativeLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingRelativeLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingRelativeLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingExceptionLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingExceptionLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingExceptionLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingDesertedLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingDesertedLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingDesertedLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /**
   * Delete all documents from ScrapingFileLinks collection
   * by evaluation id;
   * @param {int} idEvaluation
   */
  this.deleteScrapingFileLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {idEvaluation: idEvaluation};

    try {
      await app.models.ScrapingFileLinks.destroyAll(filter);
    } catch (error) {
      storeError(error, idEvaluation);
    }
  };

  /*
   * Count collections documents by evaluation id
   * *************************************************************
   */

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingErrorLogs = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingErrorLogs.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingAbsoluteLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingAbsoluteLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingBrokenLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingBrokenLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingRelativeLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingRelativeLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingExceptionLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingExceptionLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingDesertedLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingDesertedLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Count documents from the
   * respective collection by idEvaluation.
   * @param {int} idEvaluation
   */
  this.countScrapingFileLinks = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const filter = {where: {idEvaluation: idEvaluation}};
    try {
      let found = await app.models.ScrapingFileLinks.find(filter);
      return found.length;
    } catch (error) {
      return 0;
    }
  };

  /*
   *  Scraping SiteMapUrls functions
   * *************************************************************
   */

  /**
   * Append a page object in an array field inside
   * ScrapingSiteMapUrls collection.
   * @param {Object} pageObject
   * @param {number} idEvaluation
   */
  this.appendScrapingSiteMapUrls = async function(
    pageObject,
    idEvaluation = globalEvaluationID,
  ) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let currentCollection = db.collection('ScrapingSiteMapUrls');
        currentCollection
          .updateOne(
            {idEvaluation: idEvaluation},
            {$push: {urlList: pageObject}},
            {upsert: true},
          )
          .then(resolve(1))
          .catch(error => {
            app.models.ScrapingErrorLogs.create({
              idEvaluation: idEvaluation,
              log: 'In appendScrapingSiteMapUrls: ' + error.message,
            });
            resolve(-1);
          });
      });
    });
  };

  /**
   * Get the page list  object in an array field inside
   * ScrapingSiteMapUrls collection.
   * @param {number} idEvaluation
   * @returns {array}
   */
  this.getMapSiteUrlPages = async function(idEvaluation = globalEvaluationID) {
    const filter = {
      where: {idEvaluation: idEvaluation},
      fields: {urlList: true},
    };
    try {
      let pageObjList = await app.models.ScrapingSiteMapUrls.findOne(filter);
      if (pageObjList != null) {
        return pageObjList.urlList;
      }
    } catch (error) {
      storeError(error, idEvaluation);
      return [-1];
    }
    return [-1];
  };

  /*
   *  Scraping SiteMap functions
   * *************************************************************
   */

  /**
   * Function to set the obtained tree in SiteMap collection.
   * @param {Object} dataJsonTree
   * @param {number} idEvaluation
   */
  this.setTreeMapToSiteMapData = async function(
    dataJsonTree,
    idEvaluation = globalEvaluationID,
  ) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let currentCollection = db.collection('ScrapingSiteMap');
        currentCollection
          .updateOne(
            {idEvaluation: idEvaluation},
            {$set: {data: dataJsonTree}},
            {upsert: true},
          )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  };

  /**
   * Store actual scraping checkpoint into SiteMap collection
   * @param {number} actualCheckpoint
   * @param {number} idEvaluation
   */
  this.setActualCheckpointToSiteMap = async function(
    actualCheckpoint,
    idEvaluation = globalEvaluationID,
  ) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let currentCollection = db.collection('ScrapingSiteMap');
        currentCollection
          .updateOne(
            {idEvaluation: idEvaluation},
            {$set: {actualCheckpoint: actualCheckpoint}},
            {upsert: true},
          )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  };

  /**
   * Store actual scraping state into SiteMap collection
   * @param {number} isFinished
   * @param {number} idEvaluation
   */
  this.setIsFinishedToSiteMap = async function(
    isFinished,
    idEvaluation = globalEvaluationID,
  ) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let currentCollection = db.collection('ScrapingSiteMap');
        currentCollection
          .updateOne(
            {idEvaluation: idEvaluation},
            {$set: {isFinished: isFinished}},
            {upsert: true},
          )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  };

  /**
   * Store the last date of the scraping in progress
   * inside SiteMap collection filtered by id.
   * @param {date} actualCheckpointDate
   * @param {number} idEvaluation
   */
  this.setActualCheckpointDateToSiteMap = async function(
    actualCheckpointDate,
    idEvaluation = globalEvaluationID,
  ) {
    const mdb = app.dataSources.MONGO_EAW;
    return new Promise(function(resolve, reject) {
      mdb.connector.connect(function(err, db) {
        let currentCollection = db.collection('ScrapingSiteMap');
        currentCollection
          .updateOne(
            {idEvaluation: idEvaluation},
            {$set: {actualCheckpointDate: actualCheckpointDate}},
            {upsert: true},
          )
          .then(resolve(1))
          .catch(error => {
            storeError(error, idEvaluation);
            resolve(-1);
          });
      });
    });
  };

  /**
   * Update each counter field in MapSite collection
   * by evaluation id, if respective argument is grader than 0.
   * @param {number} scrapedPagesCounter
   * @param {number} treeDepthCounter
   * @param {number} absoluteLinksCounter
   * @param {number} brokenLinksCounter
   * @param {number} relativeLinksCounter
   * @param {number} linkExceptionsCounter
   * @param {number} desertedLinksCounter
   * @param {number} fileCounter
   * @param {number} idEvaluation
   */
  this.updateMapSiteCounterTypeFields = async function(
    scrapedPagesCounter,
    treeDepthCounter,
    absoluteLinksCounter,
    brokenLinksCounter,
    relativeLinksCounter,
    linkExceptionsCounter,
    desertedLinksCounter,
    fileCounter,
    idEvaluation = globalEvaluationID,
  ) {
    try {
      let setObject = {
        $set: {
          brokenLinksCounter: brokenLinksCounter,
          scrapedPagesCounter: scrapedPagesCounter,
          treeDepthCounter: treeDepthCounter,
          absoluteLinksCounter: absoluteLinksCounter,
          relativeLinksCounter: relativeLinksCounter,
          linkExceptionsCounter: linkExceptionsCounter,
          desertedLinksCounter: desertedLinksCounter,
          fileCounter: fileCounter,
        },
      };

      return new Promise(function(resolve, reject) {
        const mdb = app.dataSources.MONGO_EAW;
        mdb.connector.connect(function(err, db) {
          let currentCollection = db.collection('ScrapingSiteMap');
          currentCollection
            .updateOne({idEvaluation: idEvaluation}, setObject, {upsert: true})
            .then(resolve(1))
            .catch(error => {
              storeError(error, idEvaluation);
              resolve(-1);
            });
        });
      });
    } catch (error) {
      storeError(error, idEvaluation);
      return -1;
    }
  };

  /**
   * function to set the obtained tree in SiteMap collection.
   * @param {number} idClient
   * @param {number} idPackage
   * @param {string} domain
   * @param {number} actualCheckPoint
   * @param {number} idEvaluation
   * @returns {array}
   */
  this.initSiteMap = async function(
    idClient,
    idPackage,
    domain,
    actualCheckPoint,
    startCheckpointDate,
    idEvaluation = globalEvaluationID,
  ) {
    let initialValues = {
      idEvaluation: idEvaluation,
      idClient: idClient,
      idPackage: idPackage,
      domain: domain,
      format: 'nodeTree',
      scrapedPagesCounter: 0,
      treeDepthCounter: 0,
      absoluteLinksCounter: 0,
      brokenLinksCounter: 0,
      relativeLinksCounter: 0,
      linkExceptionsCounter: 0,
      desertedLinksCounter: 0,
      fileCounter: 0,
      brokenLinksList: [],
      absoluteLinksList: [],
      relativeLinksList: [],
      linkExceptionsList: [],
      desertedLinksList: [],
      fileList: [],
      actualCheckpoint: actualCheckPoint,
      actualCheckpointDate: startCheckpointDate,
      isFinished: false,
      data: {},
    };
    const filter = {idEvaluation: idEvaluation};
    try {
      let found = await app.models.ScrapingSiteMap.findOne({where: filter});
      if (!found) {
        return await app.models.ScrapingSiteMap.create(initialValues);
      } else {
        return await app.models.ScrapingSiteMap.update(filter, initialValues);
      }
    } catch (error) {
      storeError(error, idEvaluation);
      return -1;
    }
  };

  /**
   * Function to set the obtained tree in SiteMap collection.
   * @param {number} idEvaluation
   */
  this.migrateMapSiteToMysql = async function(
    idEvaluation = globalEvaluationID,
  ) {
    const mongoFilter = {where: {idEvaluation: idEvaluation}};
    const mySQLDFilter = {id: idEvaluation};
    try {
      let siteMap = await app.models.ScrapingSiteMap.findOne(mongoFilter);
      let mySqlSiteMap = await JSON.stringify(siteMap);

      return await app.models.Evaluations.update(mySQLDFilter, {
        siteMap: mySqlSiteMap,
      });
    } catch (error) {
      storeError(error, idEvaluation);
      throw error;
    }
  };
}

module.exports = MongoManager;
