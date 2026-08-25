'use strict';

const app = require('../../../server/server');

const _=require('lodash');
const EAWConstants = require('../../eaw-constants');

/**
 * Manage error debugs model services logic.
 */
function ErrorDebugsManager() {
    const eawConstants = new EAWConstants();

    /**
     * Function to get all error debugs by evaluation id
     * @param evaluationsId
     */
    this.getErrorDebugsByEvaluationsId = async function(evaluationsId){        
        const errorDebugsModel = app.models.ErrorDebugs;
        let _this = this;
        _this.returnObj = {
            messages: [],
            hasError: false,
            count: 0,
            results: []
        };
        try {
            let errorDebugs = await errorDebugsModel.find({where: {evaluationsId: evaluationsId}});
            for (let errorDebug of errorDebugs) {
                _this.returnObj.results.push({
                    id: errorDebug.id,
                    locationName: errorDebug.locationName,
                    errorDescription: errorDebug.errorDescription,
                    errorDateAt: errorDebug.errorDateAt,
                    fixed: errorDebug.fixed,
                    evaluationsId: errorDebug.evaluationsId,
                });
            }
        } catch (error) {
            throw handleError(_this.returnObj, error);
        }
        return _this.returnObj.results;
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

module.exports = ErrorDebugsManager;