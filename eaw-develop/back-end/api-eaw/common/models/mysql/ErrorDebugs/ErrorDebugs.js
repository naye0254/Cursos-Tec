'use strict';

const ErrorDebugsManager = require('../../../administrator/errordebugs-manage/errordebugs-manage');

/**
 * Custom errordebugs model services 
 */
module.exports = function(ErrorDebugs) {
    /**
     * Service for advanced search of ErrorDebugs by EvaluationId
     * @param evaluationsId
     */
    ErrorDebugs.getErrorDebugsByEvaluationsId = async function(evaluationsId){
        const errorDebugsManager = new ErrorDebugsManager();
        return await errorDebugsManager.getErrorDebugsByEvaluationsId(evaluationsId);
    };
    ErrorDebugs.remoteMethod('getErrorDebugsByEvaluationsId', {
        description: 'Return an with all ErrorDebugs belonging to an specific evaluation by Evaluation Id.',
        accepts: [{arg: 'evaluationsId', type: 'number', required: true}],
        http: {path: '/errorDebugsByEvaluationsId', verb: 'get'},
        returns: {root: true, type: 'Object'}
    });
};
