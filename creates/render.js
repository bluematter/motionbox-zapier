const { triggerRender, getTemplates, getVideoObjects } = require("../helpers")

module.exports = {
  key: 'render',
  noun: 'Render',

  display: {
    label: 'Render Video',
    description: 'Creates a new video.'
  },

  operation: {
    inputFields: [
      getTemplates,
      getVideoObjects
    ],
    perform: triggerRender,
    performResume: async (z, bundle) => {
      return {
        rendering: false,
        finalVideo: bundle.cleanedRequest.finalVideo
      }
    },
    sample: {
      rendering: false,
      finalVideo: "https://motionbox-rendered.b-cdn.net/155ba350-480b-11ec-9088-a326b295485e"
    },
  }
};
