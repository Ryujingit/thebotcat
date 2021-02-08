module.exports = [
  {
    name: 'join',
    description: '`!join` for me to join the voice channel you are in\n`!join #channel` for me to join a voice channel',
    flags: 6,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel;
      if (rawArgs.length == 0) {
        if (!msg.member.voice.channelID) return msg.channel.send('You are not in a voice channel.');
        channel = msg.guild.channels.cache.get(msg.member.voice.channelID);
      } else {
        if (!/<#[0-9]+>/.test(rawArgs[0])) return msg.channel.send('Invalid channel mention.');
        channel = msg.guild.channels.cache.find(x => x.id == rawArgs[0].slice(2, -1));
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
    description: '`!leave` for me to leave the voice channel I am in',
    flags: 6,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms || leaveperms) {
        if (!(joinperms && channel.members.array().filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && (guilddata.voice.songslist.length == 0 || msg.member.voice.channelID != channel.id))) {
          if (!leaveperms)
            return msg.channel.send('You do not have permission to get me to leave the voice channel.');
          if (msg.member.voice.channelID != channel.id && !remoteperms)
            return msg.channel.send('You do not have permission to get me to leave channels remotely.');
        }
        await common.clientVCManager.leave(guilddata.voice);
        return msg.channel.send(`Left channel <#${channel.id}>`);
      } else {
        return msg.channel.send('You do not have permission to get me to leave the voice channel.');
      }
    }
  },
  {
    name: 'toggleselfmute',
    description: '`!toggleselfmute` for me to toggle my selfmute status',
    flags: 6,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (msg.member.voice.channelID != channel.id && !remoteperms)
          return msg.channel.send('You do not have permission to get me to toggle my selfmute status remotely.');
        common.clientVCManager.toggleSelfMute(guilddata.voice);
        return msg.channel.send(`Set self mute to ${guilddata.voice.connection.voice.selfMute ? 'enabled' : 'disabled'}`);
      } else {
        return msg.channel.send('You do not have permission to get me to toggle my selfmute status.');
      }
    }
  },
  {
    name: 'toggleselfdeaf',
    description: '`!toggleselfdeaf` for me to toggle my selfdeafen status',
    flags: 6,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (msg.member.voice.channelID != channel.id && !remoteperms)
          return msg.channel.send('You do not have permission to get me to toggle my selfdeaf status remotely.');
        common.clientVCManager.toggleSelfDeaf(guilddata.voice);
        return msg.channel.send(`Set self deaf to ${guilddata.voice.connection.voice.selfDeaf ? 'enabled' : 'disabled'}`);
      } else {
        return msg.channel.send('You do not have permission to get me to toggle my selfdeaf status.');
      }
    }
  },
];
