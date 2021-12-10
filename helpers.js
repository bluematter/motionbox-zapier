const { v1 } = require("uuid");

const MEURI     = 'https://microservice.motionbox.io/api/me'
const RENDERURI = `https://microservice.motionbox.io/api/motionbox-render`
const FIELDSURI = 'https://microservice.motionbox.io/api/fields'

const triggerRender = async (z, bundle) => {
  try {
    const templateId = bundle.inputDataRaw.templateId

    if (!templateId) {
      const errMsg = `Missing templateId`;
      z.console.log(errMsg)
      return;
    }

    const videoId = v1();
    const objects = await getVideoObjects(z, bundle);
    const data = Object.keys(bundle.inputData)
      .filter((key) => key !== "templateId" && key !== "editor")
      .reduce((acc, curr) => {
        const object = objects?.find(item => item.key === curr);

        if (object && object.type === "text") {
          return {
            ...acc,
            [curr]: {
              text: bundle.inputData[curr]
            }
          }
        }

        if (object && object.type === "image") {
          return {
            ...acc,
            [curr]: {
              link: bundle.inputData[curr]
            }
          }
        }

        if (object && object.type === "animated_text") {
          return {
            ...acc,
            [curr]: {
              animationData: {
                ...object.animationData,
                animationText: {
                  [Object.keys(object.animationData.animationText)[0]]: bundle.inputData[curr]
                }
              }
            }
          }
        }

        return {
          ...acc,
          [curr]: {
            text: bundle.inputData[curr]
          }
        }
      }, {});

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
        templateId,
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

const getTemplates = async (z, bundle) => {
  try {
    const { json } = await z.request({
      method: 'POST',
      url: MEURI,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bundle.authData.token}`
      },
      body: {
        includeVideos: true
      }
    });

    return {
      key: 'templateId',
      required: true,
      choices: json.stories.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: curr.title
      }), {}),
      altersDynamicFields: true,
    }
  } catch (e) {
    z.console.log(e)
    throw new z.errors.Error(e)
  }
}

const getVideoObjects = async (z, bundle) => {
  try {
    const templateId = bundle.inputData.templateId;

    if (!templateId) {
      return;
    }

    const { json } = await z.request({
      method: 'POST',
      url: FIELDSURI,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${bundle.authData.token}`
      },
      body: {
        templateId
      }
    });

    return json;
  } catch (e) {
    z.console.log(e)
    throw new z.errors.Error(e)
  }
};

module.exports = {
  getTemplates,
  triggerRender,
  getVideoObjects
};