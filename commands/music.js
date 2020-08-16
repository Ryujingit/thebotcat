module.exports = [
  {
    name: 'join',
    full_string: false,
    description: '`!join` for me to join the voice channel you are in\n`!join <channel>` for me to join a voice channel',
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot join voice channel, guild not in database');
      let channel;
      if (args.length == 0) {
        if (!msg.member.voiceChannelID) return msg.channel.send('You are not in a voice channel.');
        channel = client.channels.get(msg.member.voiceChannelID);
      } else if (args.length == 1) {
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg)))
          return msg.channel.send('Only admins and mods can get me to remotely join a voice channel.');
        let channelid;
        if (/^<#[0-9]+>$/.test(args[0])) channelid = args[0].slice(2, args[0].length - 1);
        channel = msg.guild.channels.get(channelid);
        if (!channel) return msg.channel.send('Invalid channel mention.');
      }
      let channelPerms = channel.permissionsFor(msg.member), channelFull = channel.full;
      if (channelFull && !(
          common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.hasPermission('MOVE_MEMBERS')
        ) || !channelFull && !(
          common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.hasPermission('MOVE_MEMBERS') || channelPerms.hasPermission('CONNECT')
        )) return msg.channel.send('You do not have permission to get me to join the voice channel you are in.');
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
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot join voice channel, guild not in database');
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.hasPermission('MOVE_MEMBERS') || channelPerms.hasPermission('DISCONNECT') || vcmembers.length == 2 && vcmembers.includes(msg.author.id) || vcmembers.length == 1 && guilddata.voice.songslist.length == 0))
        return msg.channel.send('You do not have permission to get me to leave the voice channel.');
      common.clientVCManager.leave(guilddata.voice);
      return msg.channel.send(`Left channel <#${channel.id}>`);
    }
  },
  {
    name: 'volume',
    full_string: false,
    description: '`!volume <float>` sets the volume of thebotcat in a vc, with 1 being the normal volume',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot adjust volume in voice channel, guild not in database');
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (args.length == 0) {
        return msg.channel.send(`Playback volume is currently set to ${common.clientVCManager.getVolume(guilddata.voice)}`);
      } else {
        let vcmembers = channel.members.keyArray();
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
          return msg.channel.send('Only admins and mods can change my volume, or someone who is alone with me in a voice channel.');
        let wantedvolume = Number(args[0]);
        if (isNaN(wantedvolume) || wantedvolume == Infinity || wantedvolume == -Infinity || wantedvolume < 0 || wantedvolume > 2)
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
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot toggle loop in voice channel, guild not in database');
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
    name: 'pause',
    full_string: false,
    description: '`!pause` pauses the currently playing song',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot pause song in voice channel, guild not in database');
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can pause / resume, or someone who is alone with me in a voice channel.');
      common.clientVCManager.pause(guilddata.voice);
      return msg.channel.send(`Paused`);
    }
  },
  {
    name: 'resume',
    full_string: false,
    description: '`!resume` resumes the currently paused song',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot resume song in voice channel, guild not in database');
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      if (!guilddata.voice.dispatcher) return msg.channel.send('Error: no song is playing');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || vcmembers.length == 2 && vcmembers.includes(msg.author.id)))
        return msg.channel.send('Only admins and mods can pause / resume, or someone who is alone with me in a voice channel.');
      common.clientVCManager.resume(guilddata.voice);
      return msg.channel.send(`Resumed`);
    }
  },
  {
    name: 'forceskip',
    full_string: false,
    description: '`!forceskip` skips the currently playing song',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot skip song in voice channel, guild not in database');
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
    name: 'play',
    full_string: false,
    description: '`!play <url>` to play the audio of a youtube url, like every other music bot in existence',
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot play music in voice channel, guild not in database');
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      if (!(msg.member.voiceChannelID == guilddata.voice.channel.id || common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg)))
        return msg.channel.send('You must be in the same voice channel as I\'m in to play a song.  Admins and mods can bypass this though.');
      let latestobj;
      try {
        latestobj = await common.clientVCManager.addSong(guilddata.voice, args[0]);
      } catch (e) {
        console.error(e);
        return msg.channel.send('Invalid url');
      }
      msg.channel.send(`${latestobj.desc} added to queue`);
      return common.clientVCManager.startMainLoop(guilddata.voice, msg.channel);
    }
  },
  {
    name: 'songslist',
    full_string: false,
    description: '`!songslist` to list the currently playing song and the next songs',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot play music in voice channel, guild not in database');
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0)
        return msg.channel.send('Currently playing no songs');
      else if (songslist.length == 1)
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.time) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`);
      else
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.time) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})\nQueue:\n${songslist.slice(1).map(x => x.desc).join('\n')}`);
    }
  },
  {
    name: 'currentsong',
    full_string: false,
    description: '`!currentsong` to list the currently playing song',
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot play music in voice channel, guild not in database');
      if (!guilddata.voice.channel) return msg.channel.send('I\'m not in a voice channel');
      let songslist = guilddata.voice.songslist;
      if (songslist.length == 0)
        return msg.channel.send('Currently playing no songs');
      else if (songslist.length == 1)
        return msg.channel.send(`Currently playing ${songslist[0].desc} (${guilddata.voice.dispatcher ? common.msecToHMS(guilddata.voice.dispatcher.time) : '-:--.---'} / ${common.msecToHMS(songslist[0].expectedLength)})`);
    }
  },
];
