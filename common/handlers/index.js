module.exports = {
  event: {
    message: require('./events/message'),
    voiceStateUpdate: require('./events/voiceStateUpdate'),
    INTERACTION_CREATE: require('./events/INTERACTION_CREATE'),
  },
  extra: {
    message: require('./extras/message'),
    voiceStateUpdate: [],
    INTERACTION_CREATE: require('./extras/INTERACTION_CREATE'),
  },
};
