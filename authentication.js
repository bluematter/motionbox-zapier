'use strict';

const authentication = {
  type: 'custom',
  test: {
    url:
      'https://microservice.motionbox.io/api/me',
  },
  fields: [
    {
      key: 'token',
      label: "API Key",
      type: 'string',
      required: true,
      helpText: 'Found on your settings page.',
    },
  ],
};

const addApiKeyToHeader = (request, z, bundle) => {
  request.headers.Authorization = `Bearer ${bundle.authData.token}`;

  return request;
};

module.exports = {
  authentication, 
  addApiKeyToHeader
};
