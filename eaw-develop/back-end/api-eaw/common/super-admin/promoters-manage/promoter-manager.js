'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');

/**
 * Manage promoter model services logic.
 */
function PromoterManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all users Promoters .
   */
  this.getAllPromoters = async function(isActive) {
    const clientsModel = app.models.Clients;
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterPromoters = {};
    if (isActive === `'null'`) {
      filterPromoters = {
        where: {
          roleTypesId: eawConstants.PROMOTER_ROLE_ID,
        },
      };
    } else {
      filterPromoters = {
        where: {
          and: [
            {
              roleTypesId: eawConstants.PROMOTER_ROLE_ID,
            },
            {
              isActive: isActive,
            },
          ],
        },
      };
    }
    try {
      _this.returnObj.results = await app.models.Users.find(filterPromoters);
      let clientsByUser = [];
      for (let promoter of _this.returnObj.results) {
        clientsByUser = await clientsModel.find({
          where: {
            createdBy: promoter.id,
          },
        });
        promoter.clientsCreated = clientsByUser.length;
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = PromoterManager;
