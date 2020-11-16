module.exports = [
  {
    name: 'join',
    full_string: false,
    description: '`!join` for me to join the voice channel you are in\n`!join #channel` for me to join a voice channel',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Join/leave features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (args.length == 0) {
        if (!msg.member.voice.channelID) return msg.channel.send('You are not in a voice channel.');
        channel = msg.guild.channels.cache.get(msg.member.voice.channelID);
      } else {
        if (!/<#[0-9]+>/.test(args[0])) return msg.channel.send('Invalid channel mention.');
        channel = msg.guild.channels.cache.find(x => x.id == args[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot join channel outside of this guild.');
      }
      if (guilddata.voice.channel && guilddata.voice.channel.id == channel.id) return msg.channel.send(`Already joined channel <#${channel.id}>`);
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
        return msg.channel.send('You do not have permission to get me to join the voice channel.');
      if (msg.member.voice.channelID != channel.id && !remoteperms)
        return msg.channel.send('You do not have permission to get me to join channels remotely.');
      if (channel.full && !leaveperms)
        return msg.channel.send('You do not have permission to get me to join full channels.');
      if (guilddata.voice.channel && !(guilddata.voice.channel.members.size <= 1 && guilddata.voice.songslist.length == 0) && !leaveperms) {
        return msg.channel.send('You do not have permission to get me to leave other channels.');
      }
      try {
        await common.clientVCManager.join(guilddata.voice, channel);
        return msg.channel.send(`Joined channel <#${channel.id}>`);
      } catch (e) {
        console.error(e);
        return msg.channel.send(`Error in joining channel <#${channel.id}>`);
      }
    }
  },
  {
    name: 'leave',
    full_string: false,
    description: '`!leave` for me to leave the voice channel I am in',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Join/leave features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!(joinperms && channel.members.size <= 1 && guilddata.voice.songslist.length == 0)) {
        if (!leaveperms)
          return msg.channel.send('You do not have permission to get me to leave the voice channel.');
        if (msg.member.voice.channelID != channel.id && !remoteperms)
          return msg.channel.send('You do not have permission to get me to leave channels remotely.');
      }
      await common.clientVCManager.leave(guilddata.voice);
      return msg.channel.send(`Left channel <#${channel.id}>`);
    }
  },
];
