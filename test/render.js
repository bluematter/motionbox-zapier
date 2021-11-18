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
        "a65d2d40-db6b-11eb-867a-6d651b8f4eae": "https://pbs.twimg.com/profile_images/1269345496461504512/5WnhZ0Bm_normal.jpg",
        "7eb6b9a0-db6b-11eb-867a-6d651b8f4eae": "Testing Zapier Works"
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
