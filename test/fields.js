'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

//These are automated tests for the render job.
//They will run every time the `zapier test` command is executed.
describe('fields dropdown', () => {
  zapier.tools.env.inject();

  // Make sure render job gets created
  it('should pull dynamic inputFields', (done) => {
    const bundle = {
      authData: {
        token: process.env.TOKEN
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
