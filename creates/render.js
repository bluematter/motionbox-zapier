const { v1 } = require("uuid");

const RENDERURI = `https://microservice.motionbox.io/api/motionbox-render`
const FIELDSURI = 'https://microservice.motionbox.io/api/fields'

const triggerRender = async (z, bundle) => {
  const objects = await videoObjects(z, bundle)
  const data = Object.keys(bundle.inputData)
    .filter((key) => key !== "templateId" && key !== "editor")
    .reduce((acc, curr) => {
      const object = objects.find(item => item.key === curr);

      if (object.type === "text") {
        return {
          ...acc,
          [curr]: {
            text: bundle.inputData[curr]
          }
        }
      }

      if (object.type === "image") {
        return {
          ...acc,
          [curr]: {
            link: bundle.inputData[curr]
          }
        }
      }

      return {
        ...acc,
        [curr]: {
          text: bundle.inputData[curr]
        }
      }
    }, {})

  await z.request({
    method: 'POST',
    url: RENDERURI,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      data,
      token: bundle.authData.token,
      videoId: v1(),
      templateId: bundle.inputData.templateId,
      callbackUrl: z.generateCallbackUrl(),
    }
  });

  return {
    rendering: true
  }
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

  return json;
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
      z.console.log("performResume", {
        bundle
      })

      return  { 
        ...bundle.outputData,
        ...bundle.cleanedRequest 
      };
    }
  }
};
