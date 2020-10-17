module.exports = {
  event: {
    message: require('./events/message'),
    voiceStateUpdate: require('./events/voiceStateUpdate'),
  },
  extra: {
    message: require('./extras/message'),
    voiceStateUpdate: [],
  },
};
