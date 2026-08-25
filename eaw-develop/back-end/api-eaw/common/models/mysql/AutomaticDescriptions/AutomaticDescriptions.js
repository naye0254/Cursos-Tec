'use strict';

module.exports = function(AutomaticDescriptions) {
  /**
   * Returns a map which each code is a key and an id is a value.
   */
  AutomaticDescriptions.generateMapCodeXId = async function(cb) {
    let CodeXIdMap = {};
    await AutomaticDescriptions.find().map(function(automaticDescription) {
      CodeXIdMap[automaticDescription.codeSnifferCode] =
        automaticDescription.id;
    });

    return CodeXIdMap;
  };

  AutomaticDescriptions.remoteMethod('generateMapCodeXId', {
    description: 'Return map which each code is a key and an id is a value.',
    accepts: [],
    http: {path: '/generateMapCodeXId', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to generate a hash with id as a key and a model as value.
   */
  AutomaticDescriptions.generateMapIdXModel = async function() {
    const CodeXIdMap = {};
    const automaticDescriptions = await AutomaticDescriptions.find();

    await automaticDescriptions.map(function(automaticDescription) {
      CodeXIdMap[automaticDescription.id] = automaticDescription;
    });

    return CodeXIdMap;
  };

  AutomaticDescriptions.remoteMethod('generateMapIdXModel', {
    description:
      'Return map which each code is an id and an object is a value.',
    accepts: [],
    http: {path: '/generateMapIdXModel', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
