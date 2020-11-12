module.exports = [
  {
    name: 'play',
    full_string: false,
    description: '`!play <url>` to play the audio of a youtube url, like every other music bot in existence',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      if (!(msg.member.voice.channelID == guilddata.voice.channel.id || common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg)))
        return msg.channel.send('You must be in the same voice channel as I\'m in to play a song.  Admins and mods can bypass this though.');
      let latestobj;
      try {
        latestobj = await common.clientVCManager.addSong(guilddata.voice, args[0]);
      } catch (e) {
        if (e.toString() != 'Error: invalid url') console.error(e);
        return msg.channel.send('Invalid url');
      }
      msg.channel.send(`${latestobj.desc} added to queue`);
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    }
  },
  {
    name: 'pause',
    full_string: false,
    description: '`!pause` pauses the currently playing song',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return msg.channel.send(`Paused`);
    }
  },
  {
    name: 'resume',
    full_string: false,
    description: '`!resume` resumes the currently paused song',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return msg.channel.send(`Resumed`);
    }
  },
  {
    name: 'volume',
    full_string: false,
    description: '`!volume <float>` sets the volume of thebotcat in a vc, with 1 being the normal volume',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (args.length == 0) {
        return msg.channel.send(`Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let vcmembers = channel.members.keyArray();
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
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
    full_string: false,
    description: '`!loop` toggles whether the currently playing song will loop',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can change toggle loop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.toggleLoop(guilddata.voice);
      return msg.channel.send(`Toggled loop to ${guilddata.voice.loop ? 'enabled' : 'disabled'}`);
    }
  },
  {
    name: 'forceskip',
    full_string: false,
    description: '`!forceskip` skips the currently playing song',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can forceskip, or someone who is alone with me in a voice channel.');
      common.clientVCManager.forceSkip(guilddata.voice);
      return msg.channel.send(`Skipped`);
    }
  },
  {
    name: 'stop',
    full_string: false,
    description: '`!stop` clears the song list and stops playing',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can pause / resume / stop, or someone who is alone with me in a voice channel.');
      common.clientVCManager.stopMainLoop(guilddata.voice);
      return msg.channel.send(`Stopped`);
    }
  },
  {
    name: 'songslist',
    full_string: false,
    description: '`!songslist` to list the currently playing song and the next songs',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0)
        return msg.channel.send('Currently playing no songs');
      else if (songslist.length == 1)
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`);
      else
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})\nQueue:\n${songslist.slice(1).map(x => x.desc).join('\n')}`);
    }
  },
  {
    name: 'currentsong',
    full_string: false,
    description: '`!currentsong` to list the currently playing song',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 2)) return msg.channel.send('Music features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0)
        return msg.channel.send('Currently playing no songs');
      else
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.streamTime) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`);
    }
  },
];
