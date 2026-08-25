/**
 * Marcello Calvo Zamora - 2019
 * José Andrés Lizano Gallegos */

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const WebScrapingFileFilter = require('./WebScrapingFileFilter');

const _ = require('lodash');
const app = require('../../../server/server');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const URL = require('url');
const {reject} = require('lodash');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const https = require('https');

/**
 * Is a class to start the webscraping, that is a background process.
 * @param {Number} idEvaluation
 * @param {Boolean} webURLHasHashRedirection
 * @param {Boolean} scrapDynamicPage
 * @param {String} webPageDomain
 * @param {String} webPageProtocole
 * @param {String} firstLink
 * @param {Array<Object>} crawled
 * @param {Array<Object>} inboundLinks
 * @param {Number} incrementalId
 * @param {Number} scrapedPagesCounter
 * @param {Date} actualCheckpoint
 * @param {Number} checkpoint
 * @param {Boolean} scrapingExit
 * @param {MongoManager} mongoManager
 * @param {Number} scrapedPagesLimit
 */
function WebScrapping(
  idEvaluation,
  webURLHasHashRedirection,
  scrapDynamicPage,
  webPageDomain,
  webPageProtocole,
  firstLink,
  crawled,
  inboundLinks,
  incrementalId,
  scrapedPagesCounter,
  actualCheckpoint,
  checkpoint,
  scrapingExit,
  mongoManager,
  scrapedPagesLimit,
) {
  let webScrapingFileFilter;
  const _EAWConstants = new EAWConstants();

  /**
   * Download the header of a valid url and
   * get the content type from the header.
   * @param {String} url
   * @returns number
   * 1, indicate that is not a file
   * or an error if the link is broken.
   * 0, indicate that is a 'text/html'.
   */
  let getContentType = url => {
    return new Promise(async function(resolve, reject) {
      let content_type;
      const agent = new https.Agent({
        rejectUnauthorized: false,
      });
      await axios
        .get(url, {httpsAgent: agent})
        .then(result => {
          content_type = result.headers['content-type'];
          if (content_type == null) {
            resolve(1);
          } else if (content_type.match('text/html') == 'text/html') {
            resolve(0);
          } else {
            resolve(1);
          }
        })
        .catch(error => {
          reject('Response error ' + error);
        });
    });
  };

  /**
   * Verify the response to check internet connection,
   * form one or two url links.
   * @param {String} url
   * @param {Boolean} secondTry
   * @returns boolean
   * */
  let internetAvailable = async (
    url = _EAWConstants.EnvVars.ENDPOINT,
    secondTry = false,
  ) => {
    return new Promise(function(resolve, reject) {
      let xhttp = new XMLHttpRequest();
      xhttp.open('HEAD', url);
      xhttp.onreadystatechange = function() {
        if (this.readyState == this.HEADERS_RECEIVED) {
          headersRecived = true;
        }
        if (this.readyState == this.DONE) {
          if (xhttp.status !== 200) {
            if (secondTry) {
              resolve(false);
            } else {
              resolve(internetAvailable('https://www.google.com/', true));
            }
          } else {
            resolve(true);
          }
        }
      };
      xhttp.send();
    });
  };

  /**
   * Time out for the content type function.
   * @param {String} crawlUrl
   */
  let timePromise = crawlUrl => {
    return Promise.race([
      getContentType(crawlUrl),
      new Promise(function(resolve, reject) {
        setTimeout(() => resolve(1), 180000);
      }),
    ]);
  };

  /**
   * Check fast an string and search if has a file extension.
   * @param {String} urlLink
   */
  let isFileLink = async urlLink => {
    let isAFileExtension = await webScrapingFileFilter.linkIsAnExtensionFile(
      urlLink,
    );
    if (isAFileExtension) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Make an scrap method in a page and returns an
   * object with page properties and page children.
   *
   * @param {String} crawlUrl
   * @param {Int} parentId
   * @returns {Object} pageObject
   */
  this.makeRequest = async (crawlUrl, parentId) => {
    let pageObject = {};
    try {
      let isAFile = await isFileLink(crawlUrl);
      if (isAFile) {
        await mongoManager.storeFileLink(crawlUrl);
      } else {
        await timePromise(crawlUrl)
          .then(async function(respos) {
            if (respos == 0) {
              let body = {};
              if (scrapDynamicPage) {
                const browser = await puppeteer.launch({
                  args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                  ],
                });

                const page = await browser.newPage();
                await page.setUserAgent(
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36',
                );
                await page.setExtraHTTPHeaders({
                  'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                });

                try {
                  body = await page
                    .goto(crawlUrl, {
                      waitUntil: [
                        'load',
                        'domcontentloaded',
                        'networkidle0',
                        'networkidle2',
                      ],
                      timeout: 180000,
                    })
                    .then(function() {
                      return page.content();
                    })
                    .then(html => html)
                    .catch(error => {
                      new CustomErrorLog(
                        'BE > Webscraping.js > puppeteer > parentId:' +
                          parentId,
                        error,
                        idEvaluation,
                      ).saveError();
                      throw error;
                    });
                } catch (error) {
                  /* If error is 
                      "Error: Failed to launch chrome! Inconsistency detected
                      by ld.so: ../elf/dl-tls.c: 481: _dl_allocate_tls_init: 
                      Assertion `listp->slotinfo[cnt].gen <= 
                      GL(dl_tls_generation)'' failed!"
                    Add more shared memory to /dev/shm.
                    Example for docker:
                    docker run --shm-size=1gb
                    Ref: https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#tips
                  */
                  const agent = new https.Agent({
                    rejectUnauthorized: false,
                  });
                  await page.close();
                  await browser.close();
                  body = await axios
                    .get(crawlUrl, {httpsAgent: agent})
                    .catch(error => {
                      throw error;
                    });
                  body = body.data;
                }

                await page.close();
                await browser.close();
              } else {
                body = await axios.get(crawlUrl);
                body = body.data;
              }

              let $ = cheerio.load(body);
              pageObject.id = incrementalId;
              incrementalId++;
              scrapedPagesCounter++;
              if ($('title').text() == '') {
                pageObject.topic = 'NT - ' + crawlUrl;
              } else {
                pageObject.topic = $('title').text();
              }
              pageObject.children = [];
              $('a').each(function(i, elem) {
                if (
                  elem.attribs.href != null ||
                  elem.attribs.href != undefined
                ) {
                  pathSelection(
                    elem.attribs.href,
                    pageObject,
                    $(elem).text(),
                    pageObject.id,
                  );
                }
              });
            } else if (respos == 1) {
              await mongoManager.storeFileLink(crawlUrl);
            }
          })
          .catch(responseError => {
            mongoManager.storeBrokenLink(crawlUrl);
          });
      }
    } catch (unExpectedError) {
      await mongoManager.storeBrokenLink(crawlUrl);
    }
    pageObject['parentid'] = parentId;
    pageObject['Url'] = crawlUrl;

    return await pageObject;
  };

  /**
   * Check if an url comes from the domain
   * purposed in the new instance of WebScraping class,
   * at the begining.
   * @param {String} url
   */
  async function belongsToDomainValidation(url) {
    try {
      let parsedUrl = await URL.parse(url);
      let host = parsedUrl.hostname;

      if (webURLHasHashRedirection) {
        const hasHashRedirection = parsedUrl.hash != null;
        const pathname = parsedUrl.pathname;
        if (hasHashRedirection) {
          host = host + pathname;
        }
      }

      return host === webPageDomain;
    } catch (error) {
      new CustomErrorLog(
        'BE > Webscraping.js > myLoop() > ' + parentId,
        error,
      ).saveError();
      return false;
    }
  }

  /**
   * Principal function to call recurcivelly requests
   * and build the site map.
   *
   * @param {String} link
   * @param {Int} parentId
   */
  this.myLoop = async (link, parentId) => {
    let pageObject = await this.makeRequest(link, parentId);
    crawled.push({parentid: pageObject.parentid, url: pageObject.Url});
    if (typeof pageObject.children != 'undefined') {
      await mongoManager.appendScrapingSiteMapUrls(pageObject);
      for (let item of pageObject.children) {
        try {
          let belongsToDomain = await belongsToDomainValidation(item.linkUrl);
          if (belongsToDomain) {
            inboundLinks.push({parentid: item.parentid, url: item.linkUrl});
          } else {
            await mongoManager.storeDesertedLink(item.linkUrl);
          }
        } catch (error) {
          new CustomErrorLog(
            'BE > Webscraping.js > myLoop() > ' +
              'parentId: ' +
              parentId +
              'link: ' +
              link,
            error,
          ).saveError();
        }
      }
    }
    await checkFinishState();
    let inboundLinksUniq = _.uniqBy(inboundLinks, function(x) {
      return x.parentid && x.url;
    });
    let nextLink = _.filter(inboundLinksUniq, function(obj) {
      return !_.find(crawled, obj);
    });
    if (
      nextLink.length > 0 &&
      scrapingExit == false &&
      actualCheckpoint < scrapedPagesLimit
    ) {
      await saveCheckpoint();
      await this.myLoop(nextLink[0].url, nextLink[0].parentid);
    } else {
      crawled = null;
      inboundLinks = null;
    }
  };

  /**
   * Check from database if the scraping stop
   * or may continue. The function myloop may
   * create a queue of process in background, so
   * this function will stop the inscrement of the queue.
   */
  async function checkFinishState() {
    try {
      let scrapingState = await app.models.Evaluations.findOne({
        where: {
          id: idEvaluation,
        },
        fields: {
          scrapingState: true,
        },
      });
      if (scrapingState.scrapingState == 2) {
        scrapingExit = true;
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > Webscraping.js > scrap() > checkFinishState() idEvaluation: ' +
          idEvaluation,
        error,
      ).saveError();
    }
  }

  /**
   * Get a big object from mongo database,
   * applying an string format, then build a tree
   * from the sitemap stored in mongo and save
   * the map in the big object. At the end
   * migrate the big object to mysql.
   */
  async function saveCheckpoint() {
    try {
      if (actualCheckpoint === scrapedPagesCounter) {
        actualCheckpoint = actualCheckpoint + checkpoint;
        let mapsiteUrls = await mongoManager.getMapSiteUrlPages();
        let mapSiteTreeStructure = await unflatten(mapsiteUrls, false);
        let treeDepth = await getDepth(mapSiteTreeStructure);
        await addCountersToMapSite(treeDepth - 1);
        let siteMap = await JSON.stringify(
          mapSiteTreeStructure,
          (k, v) =>
            Array.isArray(v) && !(v = v.filter(e => e)).length ? void 0 : v,
          2,
        );
        siteMap = await JSON.parse(siteMap);
        await mongoManager.setTreeMapToSiteMapData(siteMap);
        await migrateMapsiteMongoToMysql();
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > Webscraping.js > scrap() > saveCheckpoint() > idEvaluation: ' +
          idEvaluation,
        error,
      ).saveError();
      throw error;
    }
  }

  /**
   * Calculate depth of a tree json object.
   *
   * @param {Object} obj
   * @returns {Int} depth
   */
  function getDepth(obj) {
    let depth = 0;
    if (obj.children) {
      obj.children.forEach(function(d) {
        var tmpDepth = getDepth(d);
        if (tmpDepth >= depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
  }

  /**
   * Reformat a plain format json to tree format json.
   *
   * @param {Object} arrayOfPageObjects An arrays of page objects
   * @returns {Object} data A json of jsons of page objects
   */
  async function unflatten(arrayOfPageObjects, isFinished) {
    await mongoManager.setIsFinishedToSiteMap(isFinished);
    let realCurrentCheckpoint = actualCheckpoint - checkpoint;

    await mongoManager.setActualCheckpointToSiteMap(realCurrentCheckpoint);
    let endingDate = new Date();
    let localDate = endingDate.toLocaleString();
    await mongoManager.setActualCheckpointDateToSiteMap(localDate);

    let mappedArr = {};
    let arrElem = {};
    let mappedElem = {};
    let data = {};

    try {
      data.id = 'root';
      data.topic = firstLink;
      data.backgroundColor = '#919191';
      data.children = [];

      for (let i = 0, len = arrayOfPageObjects.length; i < len; i++) {
        arrElem = arrayOfPageObjects[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
      }
      for (let id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          if (mappedElem.parentid) {
            mappedArr[mappedElem['parentid']]['children'].push(mappedElem);
          } else {
            data.children.push(mappedElem);
          }
        }
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > Webscraping.js > unflatten() > idEvaluation: ' + idEvaluation,
        error,
      ).saveError();
      throw error;
    }

    return await data;
  }

  /**
   * Function to select paths, format links from relatives to absolutes,
   * and validate http format, if it's http or https.
   *
   * @param {String} linkchild
   * @param {Object} pageObject
   * @param {String} linkTittle
   * @param {Number} parentId
   */
  async function pathSelection(linkchild, pageObject, linkTittle, parentId) {
    if (
      linkchild.indexOf('http://') === 0 ||
      linkchild.indexOf('https://') === 0
    ) {
      let belongsToDomain = await belongsToDomainValidation(linkchild);
      if (!belongsToDomain || linkchild.indexOf(webPageProtocole) !== 0) {
        await mongoManager.storeDesertedLink(linkchild);
      } else {
        let isAFile = await isFileLink(linkchild);
        if (isAFile) {
          await mongoManager.storeFileLink(linkchild);
        } else {
          pageObject.children.push({
            linkText: linkTittle,
            linkUrl: linkchild,
            parentid: parentId,
          });
          await mongoManager.storeAbsoluteLink(linkchild);
        }
      }
    } else if (await validateRelativeLink(linkchild)) {
      if (linkchild.indexOf('./') === 0) {
        let temp = linkchild.slice(1);
        linkchild = temp;
      }
      if (linkchild.indexOf('/') !== 0 && !webURLHasHashRedirection) {
        linkchild = '/' + linkchild;
      }
      let resolvedLinkchild = webPageProtocole + webPageDomain + linkchild;
      let isAFile = await isFileLink(resolvedLinkchild);
      if (isAFile) {
        await mongoManager.storeFileLink(resolvedLinkchild);
      } else {
        pageObject.children.push({
          linkText: linkTittle,
          linkUrl: resolvedLinkchild,
          parentid: parentId,
        });
        await mongoManager.storeRelativeLink(linkchild);
      }
    } else {
      await mongoManager.storeExceptionLink(linkchild);
    }
  }

  /**
   * Validate if a link is an exception
   * @param {string} relativeLink
   * According to  Uniform Resource Identifiers (URI): Generic Syntax.
   * https://tools.ietf.org/html/rfc2396
   * Copyright (C) The Internet Society (1998).  All Rights Reserved.
   * The following symbols are the allowed in urls:
   *   A-Z  a-z  0-9  -  .  _  ~  :  /  ?  #  [  ]  @  !  $  &  '  (  )  *  +  ,  ;  %  =
   *   : symbol must be followed by ./ if is not, is an invalid relative ref.
   *
   * According to own local tests:
   *   - The following symbols might be in bad relative links:
   *     :  @  ;
   *   - The following has position is mostly an exception:
   *     # /#
   *   To exclude link parameters, add ? symbol in regex.
   *   To include alone anchors #links, remove all after | in regex.
   *  @return Boolean
   * */
  async function validateRelativeLink(relativeLink) {
    let isNotException = relativeLink.match(`[:@;]|(^\/?#)(?!\/)`) == null;
    isNotException = isNotException && relativeLink.trim() !== '';
    return isNotException;
  }

  /**
   * Restart globaVariables for each run.
   */
  async function restartGlobalVariables() {
    webScrapingFileFilter = await new WebScrapingFileFilter();
    crawled = [];
    inboundLinks = [];
    scrapedPagesCounter = 0;
    scrapingExit = false;
  }

  /**
   * Update counters in mapsite on mongo database.
   * @param {number} treeDepthCounter
   */
  async function addCountersToMapSite(treeDepthCounter) {
    let absoluteLinksCounter = await mongoManager.countScrapingAbsoluteLinks();
    let brokenLinksCounter = await mongoManager.countScrapingBrokenLinks();
    let relativeLinksCounter = await mongoManager.countScrapingRelativeLinks();
    let linkExceptionsCounter = await mongoManager.countScrapingExceptionLinks();
    let desertedLinksCounter = await mongoManager.countScrapingDesertedLinks();
    let fileCounter = await mongoManager.countScrapingFileLinks();

    await mongoManager.updateMapSiteCounterTypeFields(
      scrapedPagesCounter,
      treeDepthCounter,
      absoluteLinksCounter,
      brokenLinksCounter,
      relativeLinksCounter,
      linkExceptionsCounter,
      desertedLinksCounter,
      fileCounter,
    );

    return 1;
  }

  /**
   * Delete all collections in mongo db for the
   * current evaluation.
   */
  async function deleteScrapingCollectionsByEvaluation() {
    await mongoManager.deleteScrapingAbsoluteLinks();
    await mongoManager.deleteScrapingBrokenLinks();
    await mongoManager.deleteScrapingDesertedLinks();
    await mongoManager.deleteScrapingExceptionLinks();
    await mongoManager.deleteScrapingFileLinks();
    await mongoManager.deleteScrapingRelativeLinks();
    await mongoManager.deleteScrapingSiteMapUrls();
    await mongoManager.deleteScrapingSiteMap();

    return 1;
  }

  /**
   * Function to get the complete sitemap from mongo
   * and store it in mysql.
   */
  async function migrateMapsiteMongoToMysql() {
    try {
      await mongoManager.migrateMapSiteToMysql();
    } catch (error) {
      const MYSQL_ER_JSON_DOCUMENT_TOO_DEEP = 3157;
      if (error.errno === MYSQL_ER_JSON_DOCUMENT_TOO_DEEP) {
        scrapingExit = true;
        crawled = [];
        inboundLinks = [];
        new CustomErrorLog(
          'BE > Webscraping.js > migrateMapsiteMongoToMysql() > idEvaluation: ' +
            idEvaluation,
          error,
        ).saveError();
      } else {
        throw error;
      }
    }

    return 1;
  }

  /**
   * Function to insert a notification for all promoter active users.
   */
  async function notifyPromoterUsers(notificationPath, clientName) {
    try {
      const currentDate = await new Date();
      const promoterUsers = await app.models.Users.find({
        where: {
          and: [{roleTypesId: 2}, {isActive: true}],
        },
      });
      for (const promoterUser of promoterUsers) {
        const notificationData = {
          date: currentDate,
          descriptionPath: notificationPath,
          usersId: promoterUser.id,
          viewed: 0,
          parameters: `{name: '${clientName}'}`,
        };
        await app.models.Notifications.create(notificationData);
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > WebScraping.js > notifyPromoterUsers',
        error,
        idEvaluation,
      ).saveError();
    }
  }

  /**
   * Function to start the scraparentIdng proccess
   * and return the response.
   *
   * @param {String} pIdClient
   * @param {String} pIdPackage
   * @param {String} clientName
   */
  this.scrap = async (pIdClient, pIdPackage, clientName) => {
    await restartGlobalVariables();
    try {
      await deleteScrapingCollectionsByEvaluation();
    } catch (error) {}

    let haveInternet = await internetAvailable();
    let evaluationUpdateData = {};
    try {
      if (haveInternet) {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        await axios
          .get(firstLink, {httpsAgent: agent})
          .then(result => result)
          .catch(error => {
            mongoManager.storeBrokenLink(firstLink);
            if (error.code == 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
              throw 'SSL Error, https may be http.';
            } else {
              throw error;
            }
          });
      } else {
        evaluationUpdateData = {scrapingState: -2};
        throw 'NO INTERNET';
      }
      let firstDate = new Date();
      let firstDateStr = firstDate.toLocaleString();
      await mongoManager.initSiteMap(
        pIdClient,
        pIdPackage,
        webPageDomain,
        actualCheckpoint,
        firstDateStr,
      );
      await mongoManager.migrateMapSiteToMysql();
      await this.myLoop(firstLink, 0);
      crawled = null;
      inboundLinks = null;
      scrapingExit = false;

      let mapsiteUrls = await mongoManager.getMapSiteUrlPages();
      let mapSiteTreeStructure = await unflatten(mapsiteUrls, true);
      let treeDepth = await getDepth(mapSiteTreeStructure);
      await addCountersToMapSite(treeDepth - 1);
      let siteMap = await JSON.stringify(
        mapSiteTreeStructure,
        (k, v) =>
          Array.isArray(v) && !(v = v.filter(e => e)).length ? void 0 : v,
        2,
      );
      siteMap = await JSON.parse(siteMap);
      await mongoManager.setTreeMapToSiteMapData(siteMap);

      await migrateMapsiteMongoToMysql();
      await deleteScrapingCollectionsByEvaluation();
      await mongoManager.deleteScrapingErrorLogs();

      delete mongoManager;

      haveInternet = await internetAvailable();
      if (haveInternet) {
        evaluationUpdateData = {
          scrapingState: _EAWConstants.ScrapingStates.FINISHED,
        };
      } else {
        evaluationUpdateData = {scrapingState: -2};
        throw 'NO INTERNET';
      }

      if (mapsiteUrls[0] == -1) {
        throw 'Empty urls, -1 recived';
      }

      app.models.Evaluations.update({id: idEvaluation}, evaluationUpdateData);
      let endingDate = await new Date();
      await app.models.DatesByEvaluations.update(
        {evaluationsId: idEvaluation},
        {scrapingFinishedDateAt: endingDate},
      );
      await notifyPromoterUsers(
        _EAWConstants.ScrapingNotificationPaths.SUCCESSFULL,
        clientName,
      );

      return 1;
    } catch (error) {
      haveInternet = await internetAvailable();
      if (haveInternet) {
        evaluationUpdateData = {
          scrapingState: _EAWConstants.ScrapingStates.FAILED,
        };
      } else {
        evaluationUpdateData = {scrapingState: -2};
      }
      crawled = null;
      inboundLinks = null;

      await deleteScrapingCollectionsByEvaluation();
      delete mongoManager;

      await app.models.Evaluations.update(
        {id: idEvaluation},
        evaluationUpdateData,
      );

      let endingDate = await new Date();
      await app.models.DatesByEvaluations.update(
        {evaluationsId: idEvaluation},
        {scrapingFinishedDateAt: endingDate},
      );
      await notifyPromoterUsers(
        _EAWConstants.ScrapingNotificationPaths.FAIL,
        clientName,
      );

      new CustomErrorLog(
        'BE > Webscraping.js > scrap() > pIdClient: ' +
          pIdClient +
          ' idEvaluation: ' +
          idEvaluation,
        error,
        idEvaluation,
      ).saveError();

      return -1;
    }
  };
}

module.exports = WebScrapping;
