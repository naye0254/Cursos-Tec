'use strict';

const app = require('../../../server/server');
const _ = require('lodash');
const EAWConstants = require('../../eaw-constants');

/**
 * Manage client model services logic.
 */
function ClientManager() {
  /**
   * Function to manage clientsWithEvaluations algorithms.
   * @param name
   * @param email
   * @param createdBy
   * @param createdAt
   * @param isActive
   * @param isDeleted
   */
  this.getClientsWithEvaluations = async function(
    name = null,
    email = null,
    createdBy = null,
    createdAt = null,
    segmentId = null,
    isActive,
    isDeleted,
  ) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      let clientFilter = await advanceSearchFilterGenerator(
        name,
        email,
        createdBy,
        createdAt,
        isActive,
        isDeleted
      );
      clientFilter.include = [
        {
          relation: 'userUserCreated',
          scope: {
            fields: ['firstName', 'lastName'],
          },
        },
        {
          relation: 'userClients',
          scope: {
            include: [
              {relation: 'clientsSegments'},
              {relation: 'clientsCountry'},
            ],
          },
        },
      ];
      let clients = await app.models.Users.find(clientFilter);
      if (segmentId) {
        clients = clients.filter(x => {
          let client = x.toJSON();
          if(client.userClients){
            const segments = client.userClients.clientsSegments.filter(y => {
              return y.segmentsId === segmentId;
            });
            return segments.length !== 0;
          }
        });
      }
      let evaluations = [];
      for (let client of clients) {
        evaluations = await app.models.Evaluations.find({
          where: {
            clientsId: client.id,
          },
        });
        if(client.toJSON().userClients){
          const segments = client.toJSON().userClients.clientsSegments.map(y => {
            return y.segmentsId;
          });

          _this.returnObj.results.push({
            address: client.toJSON().userClients.address,
            city: client.toJSON().userClients.city,
            countryRegion: client.toJSON().userClients.countryRegion,
            countriesId: client.toJSON().userClients.clientsCountry[0]
              .countriesId,
            segments: segments,
            createdAt: client.createdAt,
            createdBy: client.createdBy,
            email: client.email,
            id: client.id,
            firstName: client.firstName,
            password: client.password,
            postalCode: client.toJSON().userClients.postalCode,
            telephone: client.telephone,
            updatedAt: client.updatedAt,
            isActive: client.isActive,
            clientsUsersCreated: client.toJSON().userUserCreated,
            evaluations: evaluations.length,
          });
        }
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Auxiliar function to generate an optional loopback filter.
   * @param {string} name
   * @param {string} email
   * @param {number} createdBy
   * @param {id} createdAt
   */
  async function advanceSearchFilterGenerator(
    name,
    email,
    createdBy,
    createdAt,
    isActive,
    isDeleted
  ) {
    const eawConstants = new EAWConstants();
    let filter = {};
    let conditions = [
      {
        roleTypesId: await eawConstants.DIRECT_CLIENT_ROLE_ID,
      },
    ];
    if (
      (name !== null) |
      (email !== null) |
      (createdAt !== null) |
      (createdBy !== null) |
      (isActive !== `'null'`) |
      (isDeleted !== `'null'`)
    ) {
      if (name != null) {
        conditions.push({name: {like: '%' + name + '%'}});
      }
      if (email != null) {
        conditions.push({email: {like: '%' + email + '%'}});
      }
      if (createdBy != null) {
        conditions.push({createdBy: createdBy});
      }
      if (createdAt != null) {
        let date = await new Date(createdAt);
        conditions.push({createdAt: {gt: date}});
      }
      if (isActive !== `'null'`) {
        conditions.push({isActive: isActive});
      }
      if (isDeleted !== `'null`){
        conditions.push({isDeleted: 0});
      }
    }
    filter = {
      where: {
        and: conditions,
      },
    };
    return await filter;
  }

  /**
   * Manage the exeption
   * @param {*} reportErrorObj object to report the error
   * @param {*} error error
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = ClientManager;
