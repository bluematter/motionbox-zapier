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
      helpText: 'Go to the [API Details](https://motionbox.io/dashboard/settings) to find your API Key.',
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
