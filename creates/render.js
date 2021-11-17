const { v1 } = require("uuid");

const RENDERURI = `https://microservice.motionbox.io/api/motionbox-render`
const FIELDSURI = 'https://microservice.motionbox.io/api/fields'

const triggerRender = async (z, bundle) => {
  // TODO: Read bundle for field data
  // - see if its possible to select/create types

  const { json } = await z.request({
    method: 'POST',
    url: RENDERURI,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      data: {
        ["7eb6b9a0-db6b-11eb-867a-6d651b8f4eae"]: {
          text: bundle.inputData["key_0"],
        },
        ["32614b00-db6c-11eb-867a-6d651b8f4eae"]: {
          text: `@michaelaubry`,
        }
      },
      token: bundle.authData.token,
      videoId: v1(),
      templateId: bundle.inputData.templateId,
      callbackUrl: z.generateCallbackUrl(),
    }
  });


  return json
};

const videoObjects = async (z, bundle) => {
  const { json } = await z.request({
    method: 'POST',
    url: FIELDSURI,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${bundle.authData.token}`
    },
    body: {
      templateId: bundle.inputData.templateId
    }
  });

  return json
};

module.exports = {
  key: 'render',
  noun: 'Render',

  display: {
    label: 'Render Video',
    description: 'Creates a new video.'
  },

  operation: {
    inputFields: [
      {
        key: 'templateId',
        required: true,
        label:'Template ID'
      },
      videoObjects
    ],
    perform: triggerRender,
    performResume: async (z, bundle) => {
      return  { 
        ...bundle.outputData,
        ...bundle.cleanedRequest 
      };
    }
  }
};
