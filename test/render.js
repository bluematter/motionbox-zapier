'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

const templateId = 'ckqmq9sjx00110vjlbveims79' // CHANGE THIS

//These are automated tests for the render job.
//They will run every time the `zapier test` command is executed.
describe('render create', () => {
  zapier.tools.env.inject();

  // Make sure render job gets created
  it('should create a render', (done) => {
    const bundle = {
      authData: {
        token: process.env.TOKEN
      },
      inputData: {
        templateId,
        "key_0": "Testing Zapier Works"
      }
    };
    appTester(App.creates.render.operation.perform, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Object);
        done();
      })
      .catch(done);
  });

  it('should pull fields from a video', (done) => {
    const bundle = {
      authData: {
        token: process.env.TOKEN
      },
      inputData: {
        templateId
      }
    };
    appTester(App.creates.render.operation.inputFields, bundle)
      .then((response) => {
        response.should.be.an.instanceOf(Array);
        done();
      })
      .catch(done);
  });
});
