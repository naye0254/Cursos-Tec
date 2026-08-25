'use strict';
var assert = require('assert');
const json = require('../../shared-test/request');

describe('REST API request', function() {
  before(require('../../shared-test/setup'));

  /**
   * Example get
   */
  it('should return a list of all clients', function(done) {
    json('get', '/api/Clients').expect(200, function(err, res) {
      assert(Array.isArray(res.body));
      assert.equal(res.body.length, 0);
      done();
    });
  });

  /**
   * Example Post
   */
  it('should post a country ', function(done) {
    const country = {
      id: 0,
      name: 'pais Prueba',
      prefix: 'PP',
    };
    json('post', '/api/Countries', country).expect(200, function(err, res) {
      assert.notEqual(res.body.id, 0);
      done();
    });
  });
});
