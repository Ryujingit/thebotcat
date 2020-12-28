module.exports = [
  {
    name: 'play',
    description: '`!play <url>` to play the audio of a youtube url, like every other music bot in existence',
    flags: 6,
    async execute(msg, cmdstring, command, argstring, args) {
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
      let latestObj;
      try {
        latestObj = await common.clientVCManager.addSong(guilddata.voice, args[0]);
      } catch (e) {
        if (e.toString() != 'Error: invalid url') console.error(e);
        return msg.channel.send('Invalid url');
      }
      let text = `${latestObj.desc} added to queue`;
      if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Song Added', description: text } };
      msg.channel.send(text);
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    }
  },
  {
    name: 'pause',
    description: '`!pause` pauses the currently playing song',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
    }
  },
  {
    name: 'resume',
    description: '`!resume` resumes the currently paused song',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
    }
  },
  {
    name: 'volume',
    description: '`!volume <float>` sets my volume in a vc, with 1 being the normal volume',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      let channel = guilddata.voice.channel;
      if (!channel) return msg.channel.send('I\'m not in a voice channel');
      if (args.length == 0) {
        return msg.channel.send(`Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.PLAY_SONG | common.constants.botRolePermBits.FORCESKIP | common.constants.botRolePermBits.REMOTE_CMDS);
        let playperms = perms & common.constants.botRolePermBits.PLAY_SONG, fsperms = common.constants.botRolePermBits.FORCESKIP, remoteperms = perms & common.constants.botRolePermBits.REMOTE_CMDS;
        let vcmembers = channel.members.keyArray();
        if (!((msg.member.voice.channelID == guilddata.voice.channel.id || remoteperms) && (fsperms || vcmembers.length == 2 && vcmembers.includes(msg.author.id) && playperms)))
          return msg.channel.send('Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(args[0]);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 10)
          return msg.channel.send('Volume out of bounds or not specified.');
        common.clientVCManager.setVolume(guilddata.voice, wantedvolume);
        return msg.channel.send(`Set playback volume to ${wantedvolume}`);
      }
    }
  },
  {
    name: 'loop',
    description: '`!loop` toggles whether the currently playing song will loop',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
        return msg.channel.send('Only admins and mods can change toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return msg.channel.send(`Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    }
  },
  {
    name: 'forceskip',
    description: '`!forceskip` skips the currently playing song',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
        return msg.channel.send('Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return msg.channel.send(`Skipped`);
    }
  },
  {
    name: 'stop',
    description: '`!stop` clears the song list and stops playing',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
    }
  },
  {
    name: 'songslist',
    description: '`!songslist` to list the currently playing song and the next songs',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0) {
        return msg.channel.send('Currently playing no songs');
      } else if (songslist.length == 1) {
        let text = `Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`;
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Song List', description: text } };
        return msg.channel.send(text);
      } else {
        let text = `Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})\nQueue:\n${songslist.slice(1).map(x => x.desc).join('\n')}`;
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Song List', description: text } };
        return msg.channel.send(text);
      }
    }
  },
  {
    name: 'currentsong',
    description: '`!currentsong` to list the currently playing song',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata = props.saved.guilds[msg.guild.id];
      if (!guilddata) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0) {
        return msg.channel.send('Currently playing no songs');
      } else {
        let text = `Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`;
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Current Song', description: text } };
        return msg.channel.send(text);
      }
    }
  },
];
