module.exports = [
  {
    name: 'join',
    description: '`!join` for me to join the voice channel you are in\n`!join #channel` for me to join a voice channel',
    description_slash: 'for me to join a voice channel, defaults to the one you\'re in',
    flags: 0b110110,
    options: [ { type: 7, name: 'channel', description: 'the voice channel' } ],
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
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(interaction, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel;
      if (!args[0]) {
        if (!o.member.voice.channelID) return common.slashCmdResp(interaction, false, 'You are not in a voice channel.');
        channel = o.guild.channels.cache.get(o.member.voice.channelID);
      } else {
        channel = o.guild.channels.cache.find(x => x.id == args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'Cannot join channel outside of this guild.');
      }
      if (guilddata.voice.channel && guilddata.voice.channel.id == channel.id) return common.slashCmdResp(interaction, false, `Already joined channel <#${channel.id}>`);
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!joinperms || guilddata.voice.channel && !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to join the voice channel.');
      if (o.member.voice.channelID != channel.id && !remoteperms)
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to join channels remotely.');
      if (channel.full && !leaveperms)
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to join full channels.');
      if (guilddata.voice.channel && !(guilddata.voice.channel.members.size <= 1 && guilddata.voice.songslist.length == 0) && !leaveperms) {
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to leave other channels.');
      }
      try {
        await common.clientVCManager.join(guilddata.voice, channel);
        return common.slashCmdResp(interaction, false, `Joined channel <#${channel.id}>`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(interaction, false, `Error in joining channel <#${channel.id}>`);
      }
    },
  },
  {
    name: 'leave',
    description: '`!leave` for me to leave the voice channel I am in',
    description_slash: 'for me to leave the voice channel I am in',
    flags: 0b110110,
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
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(interaction, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.LEAVE_VC | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, leaveperms = perms & common.constants.botRolePermBits.LEAVE_VC, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms || leaveperms) {
        if (!(joinperms && channel.members.array().filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && (guilddata.voice.songslist.length == 0 || o.member.voice.channelID != channel.id))) {
          if (!leaveperms)
            return common.slashCmdResp(interaction, false, 'You do not have permission to get me to leave the voice channel.');
          if (o.member.voice.channelID != channel.id && !remoteperms)
            return common.slashCmdResp(interaction, false, 'You do not have permission to get me to leave channels remotely.');
        }
        await common.clientVCManager.leave(guilddata.voice);
        return common.slashCmdResp(interaction, false, `Left channel <#${channel.id}>`);
      } else {
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to leave the voice channel.');
      }
    },
  },
  {
    name: 'toggleselfmute',
    description: '`!toggleselfmute` for me to toggle my selfmute status',
    description_slash: 'for me to toggle my selfmute status',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
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
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(interaction, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (o.member.voice.channelID != channel.id && !remoteperms)
          return common.slashCmdResp(interaction, false, 'You do not have permission to get me to toggle my selfmute status remotely.');
        common.clientVCManager.toggleSelfMute(guilddata.voice);
        return common.slashCmdResp(interaction, false, `Set self mute to ${guilddata.voice.connection.voice.selfMute ? 'enabled' : 'disabled'}`);
      } else {
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to toggle my selfmute status.');
      }
    },
  },
  {
    name: 'toggleselfdeaf',
    description: '`!toggleselfdeaf` for me to toggle my selfdeafen status',
    description_slash: 'for me to toggle my selfdeafen status',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
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
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 1)) return common.slashCmdResp(interaction, false, 'Voice Channel features are disabled.');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.JOIN_VC | common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.REMOTE_CMDS);
      let joinperms = perms & common.constants.botRolePermBits.JOIN_VC, manageperms = perms & common.constants.botRolePermBits.MANAGE_BOT, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (joinperms && manageperms) {
        if (o.member.voice.channelID != channel.id && !remoteperms)
          return common.slashCmdResp(interaction, false, 'You do not have permission to get me to toggle my selfdeaf status remotely.');
        common.clientVCManager.toggleSelfDeaf(guilddata.voice);
        return common.slashCmdResp(interaction, false, `Set self deaf to ${guilddata.voice.connection.voice.selfDeaf ? 'enabled' : 'disabled'}`);
      } else {
        return common.slashCmdResp(interaction, false, 'You do not have permission to get me to toggle my selfdeaf status.');
      }
    },
  },
];
