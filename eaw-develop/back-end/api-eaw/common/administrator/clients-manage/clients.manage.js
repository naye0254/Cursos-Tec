'use strict';

const UsersSharedService = require('../../../common/shared/shared-services/users-shared-services');

const app = require('../../../server/server');
const _ = require('lodash');

/**
 * Manage client model services logic.
 */
function ClientAdministratorManager() {
  /**
   * Method to post a new client
   * @param newClient
   */
  this.postNewClient = async function(newClient) {
    const clientModel = app.models.Clients;
    const usersModel = app.models.Users;
    const ClientsByCountry = app.models.ClientsByCountries;
    const ClientsBySegment = app.models.ClientsBySegments;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      let userCreated = await usersModel.create(newClient).then(newUser => {
        const usersSharedService = new UsersSharedService();
        usersSharedService.notifyUserCreated(newUser);
        return newUser;
      });
      let clientCreated = await clientModel.create({
        id: userCreated.id,
        address: newClient.address,
        countryRegion: newClient.countryRegion,
        city: newClient.city,
        postalCode: newClient.postalCode,
      });
      for (let segmentId of newClient.segments) {
        ClientsBySegment.create({
          clientsId: clientCreated.id,
          segmentsId: segmentId,
        });
      }
      await ClientsByCountry.create({
        clientsId: clientCreated.id,
        countriesId: newClient.countriesId,
      });
      _this.returnObj.results = clientCreated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Method to update a client
   * @param clientToUpdate
   */
  this.editClient = async function(clientToUpdate) {
    const clientModel = app.models.Clients;
    const usersModel = app.models.Users;
    const ClientsByCountry = app.models.ClientsByCountries;
    const ClientsBySegment = app.models.ClientsBySegments;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      await usersModel.update(
        {
          id: clientToUpdate.id,
        },
        clientToUpdate,
      );
      await clientModel.update(
        {id: clientToUpdate.id},
        {
          address: clientToUpdate.address,
          countryRegion: clientToUpdate.countryRegion,
          city: clientToUpdate.city,
          postalCode: clientToUpdate.postalCode,
        },
      );

      await ClientsBySegment.destroyAll({
        clientsId: clientToUpdate.id,
      });

      for (let segmentId of clientToUpdate.segments) {
        ClientsBySegment.create({
          clientsId: clientToUpdate.id,
          segmentsId: segmentId,
        });
      }
      await ClientsByCountry.destroyAll({
        clientsId: clientToUpdate.id,
      });

      await ClientsByCountry.create({
        clientsId: clientToUpdate.id,
        countriesId: clientToUpdate.countriesId,
      });
      _this.returnObj.results = clientToUpdate;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

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

module.exports = ClientAdministratorManager;
