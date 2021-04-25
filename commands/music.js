module.exports = [
  {
    name: 'play',
    description: '`!play <url>` plays the audio of a YouTube URL, like every other music bot in existence',
    description_slash: 'plays the audio of a YouTube URL, like every other music bot in existence',
    flags: 0b110110,
    options: [ { type: 3, name: 'url', description: 'the URL of the YouTube video to play the audio of', required: true } ],
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && playperms))
        return msg.channel.send('You must be in the same voice channel as I\'m in to play a song.  Admins and mods can bypass this though.');
      let latestObj = await common.clientVCManager.addSong(guilddata.voice, rawArgs[0], msg.author.id);
      let text = `[${latestObj.desc}](<${latestObj.url}>) (${common.msecToHMS(Number(latestObj.expectedLength))}) added to queue`;
      await msg.channel.send(text, { allowedMentions: { parse: [] } });
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    },
    async execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && playperms))
        return common.slashCmdResp(interaction, false, 'You must be in the same voice channel as I\'m in to play a song.  Admins and mods can bypass this though.');
      let latestObj = await common.clientVCManager.addSong(guilddata.voice, args[0].value, o.author.id);
      let text = `[${latestObj.desc}](<${latestObj.url}>) (${common.msecToHMS(Number(latestObj.expectedLength))}) added to queue`;
      common.slashCmdResp(interaction, false, text);
      return common.clientVCManager.startMainLoop(guilddata.voice, o.channel);
    },
  },
  {
    name: 'pause',
    description: '`!pause` pauses the currently playing song',
    description_slash: 'pauses the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return msg.channel.send(`Paused`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return common.slashCmdResp(interaction, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Paused`);
    },
  },
  {
    name: 'resume',
    description: '`!resume` resumes the currently paused song',
    description_slash: 'resumes the currently paused song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return msg.channel.send(`Resumed`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return common.slashCmdResp(interaction, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Resumed`);
    },
  },
  {
    name: 'volume',
    description: '`!volume <float>` sets my volume in a vc, with 1 being the normal volume',
    description_slash: 'sets my volume in a vc, with 1 being the normal volume',
    flags: 0b110110,
    options: [ { type: 3, name: 'volume', description: 'the volume' } ],
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (rawArgs.length == 0) {
        return msg.channel.send(`Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
        let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        let vcmembers = channel.members.keyArray();
        if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
          return msg.channel.send('Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(rawArgs[0]);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 10)
          return msg.channel.send('Volume out of bounds or not specified.');
        common.clientVCManager.setVolume(guilddata.voice, wantedvolume);
        return msg.channel.send(`Set playback volume to ${wantedvolume}`);
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!args[0]) {
        return common.slashCmdResp(interaction, false, `Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
        let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        let vcmembers = channel.members.keyArray();
        if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
          return common.slashCmdResp(interaction, false, 'Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(args[0].value);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 10)
          return common.slashCmdResp(interaction, false, 'Volume out of bounds or not specified.');
        common.clientVCManager.setVolume(guilddata.voice, wantedvolume);
        return common.slashCmdResp(interaction, false, `Set playback volume to ${wantedvolume}`);
      }
    },
  },
  {
    name: 'loop',
    description: '`!loop` toggles whether the currently playing song will loop',
    description_slash: 'toggles whether the currently playing song will loop',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return msg.channel.send(`Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'loopqueue',
    description: '`!loopqueue` toggles whether the queue will loop (when a song finishes playing its added to the end of the queue)',
    description_slash: 'toggles whether the queue will loop (when a song finishes playing its added to the end of the queue)',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can toggle queue loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleQueueLoop(guilddata.voice);
      return msg.channel.send(`Toggled queue loop to ${guilddata.voice.loopqueue ? 'enabled' : 'disabled'}`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can toggle queue loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleQueueLoop(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Toggled queue loop to ${guilddata.voice.loopqueue ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'voteskip',
    description: '`!voteskip` toggles the vote to skip the currently playing song (if 50% or over votes, it will be skipped)',
    description_slash: 'toggles the vote to skip the currently playing song (if 50% or over votes, it will be skipped)',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.VOTESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, vsperms = common.constants.botRolePermBits.VOTESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (vsperms || playperms && channel.members.array().filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && msg.member.voice.channelID == channel.id)))
        return msg.channel.send('You lack permission to voteskip.');
      switch (common.clientVCManager.voteSkip(guilddata.voice, msg.author.id)) {
        case 1: return msg.channel.send(`Skipped`);
        case 2: return msg.channel.send(`Voted`);
        case 3: return msg.channel.send(`Unvoted`);
      }
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return common.slashCmdResp(interaction, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.VOTESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, vsperms = common.constants.botRolePermBits.VOTESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (vsperms || playperms && channel.members.array().filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && o.member.voice.channelID == channel.id)))
        return common.slashCmdResp(interaction, false, 'You lack permission to voteskip.');
      switch (common.clientVCManager.voteSkip(guilddata.voice, o.author.id)) {
        case 1: return common.slashCmdResp(interaction, false, `Skipped`);
        case 2: return common.slashCmdResp(interaction, false, `Voted`);
        case 3: return common.slashCmdResp(interaction, false, `Unvoted`);
      }
    },
  },
  {
    name: 'forceskip',
    description: '`!forceskip` skips the currently playing song',
    description_slash: 'skips the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || playperms && channel.members.array().filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && msg.member.voice.channelID == channel.id)))
        return msg.channel.send('Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return msg.channel.send(`Skipped`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return common.slashCmdResp(interaction, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || playperms && channel.members.array().filter(x => !x.user.bot && x.user.id != o.author.id).length == 0 && o.member.voice.channelID == channel.id)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Skipped`);
    },
  },
  {
    name: 'stop',
    description: '`!stop` clears the song list and stops playing',
    description_slash: 'clears the song list and stops playing',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return msg.channel.send(`Stopped`);
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return common.slashCmdResp(interaction, false, 'Error: no song is playing');
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((o.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(o.author.id) && playperms)))
        return common.slashCmdResp(interaction, false, 'Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return common.slashCmdResp(interaction, false, `Stopped`);
    },
  },
  {
    name: 'songslist',
    description: '`!songslist` lists the currently playing song and the next songs',
    description_slash: 'lists the currently playing song and the next songs',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Queue${songslist.length > 1 ? ':\n' + songslist.slice(1).map((x, i) => (i + 1) + '. ' + x.desc + ' (' + common.msecToHMS(x.expectedLength) + (x.userid ? ', requested by ' + (msg.guild.members.cache.get(x.userid) ? msg.guild.members.cache.get(x.userid).user.tag : 'null') + ', id ' + x.userid : '') + ')').join('\n') : ' empty'}\n` +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return msg.channel.send(text, { allowedMentions: { parse: [] } });
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (o.guild.members.cache.get(songslist[0].userid) ? o.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Queue${songslist.length > 1 ? ':\n' + songslist.slice(1).map((x, i) => (i + 1) + '. ' + x.desc + ' (' + common.msecToHMS(x.expectedLength) + (x.userid ? ', requested by ' + (o.guild.members.cache.get(x.userid) ? o.guild.members.cache.get(x.userid).user.tag : 'null') + ', id ' + x.userid : '') + ')').join('\n') : ' empty'}\n` +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return common.slashCmdResp(interaction, false, text);
    },
  },
  {
    name: 'currentsong',
    description: '`!currentsong` prints the currently playing song',
    description_slash: 'prints the currently playing song',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return msg.channel.send(text, { allowedMentions: { parse: [] } });
    },
    execute_slash(o, interaction, command, args) {
      if (!(props.saved.feat.audio & 2)) return common.slashCmdResp(interaction, false, 'Music features are disabled');
      let guilddata = props.saved.guilds[o.guild.id];
      if (!guilddata) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel || !guilddata.voice.channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, false, 'I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? `[${songslist[0].desc}](<${songslist[0].url}>)` + (songslist[0].userid ? ' (requested by ' + (o.guild.members.cache.get(songslist[0].userid) ? o.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` +
          (guilddata.voice.voteskip.length ? `Voteskippers: ${guilddata.voice.voteskip.map(x => `${client.users.cache.get(x)?.tag} (id ${x})`).join(', ')}\n` : '') : '') +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return common.slashCmdResp(interaction, false, text);
    },
  },
];
