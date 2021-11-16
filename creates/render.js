const { v1 } = require("uuid");

const triggerRender = (z, bundle) => {
  // TODO: Handle async websockets
  // - generate callback url
  // - call motionbox render microservice API
  // - pass webhook function to lambda as an optional param

  const responsePromise = z.request({
    method: 'POST',
    // url: `https://microservice.motionbox.io/api/motionbox-render`,
    url: `http://localhost:3002/api/motionbox-render`,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      data: {
        ["7eb6b9a0-db6b-11eb-867a-6d651b8f4eae"]: {
          text: "Testing from Zapier",
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


  return responsePromise
    .then(response => {
      return response.json
    });
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
      }
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
