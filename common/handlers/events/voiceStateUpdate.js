// used to clean up voice handler object if thebotcat is disconnected manually
module.exports = (oldState, newState) => {
  let guilddata = props.saved.guilds[newState.guild.id];
  if (!guilddata) return;
  if (oldState.id == client.user.id) {
    if (!newState.channelID)
      common.clientVCManager.leave(guilddata.voice);
    else
      guilddata.voice.channel = newState.channel;
  }
};
