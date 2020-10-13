module.exports = function getBotcatStatusMessage() {
  return {
    embed: {
      title: 'Thebotcat Status',
      fields: [
        { name: 'Uptime', value: common.msecToHMSs(client.uptime), inline: false }
      ],
    }
  };
};
