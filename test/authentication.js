'use strict';
const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);


describe('token authentication', () => {
  // Put your test TOKEN in a .env file.
  // The inject method will load them and make them available to use in your
  // tests.
  zapier.tools.env.inject();

  it('should authenticate', (done) => {
    const bundle = {
      authData: {
        token: process.env.TOKEN
      }
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        should.exist(response.id);
        done();
      })
      .catch(done);
  });

  // it('should error', (done) => {
  //   const bundle = {
  //     authData: {
  //       token: ""
  //     }
  //   };

  //   appTester(App.authentication.test, bundle)
  //     .then((response) => {
  //       should.exist(response.err)
  //       done();
  //     })
  //     .catch(done);
  // });

});