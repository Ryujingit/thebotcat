module.exports = [
  {
    name: 'play',
    description: '`!play <url>` to play the audio of a youtube url, like every other music bot in existence',
    flags: 0b010110,
    async execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && playperms))
        return msg.channel.send('You must be in the same voice channel as I\'m in to play a song.  Admins and mods can bypass this though.');
      let latestObj = await common.clientVCManager.addSong(guilddata.voice, rawArgs[0], msg.author.id);
      let text = `${latestObj.desc} (${common.msecToHMS(Number(latestObj.expectedLength))}) added to queue`;
      msg.channel.send(text, { allowedMentions: { parse: [] } });
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    },
  },
  {
    name: 'pause',
    description: '`!pause` pauses the currently playing song',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return msg.channel.send(`Paused`);
    },
  },
  {
    name: 'resume',
    description: '`!resume` resumes the currently paused song',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return msg.channel.send(`Resumed`);
    },
  },
  {
    name: 'volume',
    description: '`!volume <float>` sets my volume in a vc, with 1 being the normal volume',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
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
  },
  {
    name: 'loop',
    description: '`!loop` toggles whether the currently playing song will loop',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return msg.channel.send(`Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'loopqueue',
    description: '`!loopqueue` toggles whether the entire queue will loop, meaning that when a song finishes playing it is added to the end of the queue',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can toggle queue loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleQueueLoop(guilddata.voice);
      return msg.channel.send(`Toggled queue loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    },
  },
  {
    name: 'forceskip',
    description: '`!forceskip` skips the currently playing song',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || playperms && channel.members.array().filter(x => !x.user.bot && x.user.id != msg.author.id).length == 0 && msg.member.voice.channelID == channel.id)))
        return msg.channel.send('Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return msg.channel.send(`Skipped`);
    },
  },
  {
    name: 'stop',
    description: '`!stop` clears the song list and stops playing',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
      let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
      let vcmembers = channel.members.keyArray();
      if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return msg.channel.send(`Stopped`);
    },
  },
  {
    name: 'songslist',
    description: '`!songslist` to list the currently playing song and the next songs',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? songslist[0].desc + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` : '') +
        `Queue${songslist.length > 1 ? ':\n' + songslist.slice(1).map((x, i) => (i + 1) + '. ' + x.desc + ' (' + common.msecToHMS(x.expectedLength) + (x.userid ? ', requested by ' + (msg.guild.members.cache.get(x.userid) ? msg.guild.members.cache.get(x.userid).user.tag : 'null') + ', id ' + x.userid : '') + ')').join('\n') : ' empty'}\n` +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return msg.channel.send(text, { allowedMentions: { parse: [] } });
    },
  },
  {
    name: 'currentsong',
    description: '`!currentsong` to list the currently playing song',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      let text = `Currently playing ${songslist.length ? songslist[0].desc + (songslist[0].userid ? ' (requested by ' + (msg.guild.members.cache.get(songslist[0].userid) ? msg.guild.members.cache.get(songslist[0].userid).user.tag : 'null') + ', id ' + songslist[0].userid + ')' : '') : 'No Song'}\n` +
        (guilddata.voice.dispatcher ? `Time: ${guilddata.voice.dispatcher && songslist.length ? common.formatPlaybackBar(guilddata.voice.dispatcher.streamTime / songslist[0].expectedLength) : '---'} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${songslist.length ? common.msecToHMS(songslist[0].expectedLength) : '-:--.---'})\n` : '') +
        `Status: ${guilddata.voice.dispatcher ? (guilddata.voice.dispatcher.paused ? 'Paused' : 'Playing') : ['Stopped', 'Running', 'Pending Skip', 'Pending Stop'][guilddata.voice.mainloop]}, Volume: ${guilddata.voice.volume}, Loop: ${guilddata.voice.loop ? '✅' : '❌'}, Queue Loop: ${guilddata.voice.queueloop ? '✅' : '❌'}, Self Muted: ${guilddata.voice.connection.voice.selfMute ? '✅' : '❌'}, Self Deafened: ${guilddata.voice.connection.voice.selfDeaf ? '✅' : '❌'}`;
      return msg.channel.send(text, { allowedMentions: { parse: [] } });
    },
  },
];
