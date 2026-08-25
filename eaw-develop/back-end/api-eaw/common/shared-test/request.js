var app = require('../../server/server.js');
var request = require('supertest');

function json(verb, url, parametersObject = null) {
  if (!parametersObject) {
    return request(app)
      [verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
  } else {
    return request(app)
      [verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(parametersObject)
      .expect('Content-Type', /json/);
  }
}

module.exports = json;
