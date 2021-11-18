const { v1 } = require("uuid");

const RENDERURI = `https://microservice.motionbox.io/api/motionbox-render`
const FIELDSURI = 'https://microservice.motionbox.io/api/fields'

const triggerRender = async (z, bundle) => {
  try {
    const videoId = v1();
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
        videoId,
        templateId: bundle.inputData.templateId,
        callbackUrl: z.generateCallbackUrl(),
      }
    });

    return {
      rendering: true,
      finalVideo: "",
    }
  } catch (e) {
    z.console.log(e)
    throw new z.errors.Error(e)
  }
};

const videoObjects = async (z, bundle) => {
  try {
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
  } catch (e) {
    z.console.log(e)
    throw new z.errors.Error(e)
  }
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
      return {
        rendering: false,
        finalVideo: bundle.cleanedRequest.finalVideo
      }
    },
    sample: {
      rendering: true,
      finalVideo: "https://motionbox-rendered.b-cdn.net/155ba350-480b-11ec-9088-a326b295485e"
    },
  }
};
