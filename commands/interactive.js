module.exports = [
  {
    name: 'avatar',
    full_string: false,
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      let targetMember;
      if (!msg.mentions.members.first()) {
        targetMember = msg.guild.members.get(msg.author.id);
      } else {
        targetMember = msg.mentions.members.first();
      }
      
      let avatarEmbed = new Discord.RichEmbed()
        .setImage(targetMember.user.displayAvatarURL)
        .setColor(targetMember.displayHexColor);
      return msg.channel.send(avatarEmbed);
    }
  },
  {
    name: 'coinflip',
    full_string: false,
    description: '`!coinflip` returns tails or heads with 50% probability each',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (Math.random() < 0.5) {
        return msg.channel.send('I\'m flipping a coin, and the result is...: tails!');
      } else {
        return msg.channel.send('I\'m flipping a coin, and the result is...: heads!');
      }
    }
  },
  {
    name: 'rps',
    full_string: false,
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = args[0];
      if (!uReply) return msg.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return msg.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = replies[Math.floor(Math.random() * replies.length)];
      
      let status = common.rps(uReply, result);
      
      let logbegin = `rock/paper/scissors requested by ${msg.author.tag}, they chose ${uReply}, i chose ${result}, `;
      if (status == 0) {
        logmsg(logbegin + 'tie');
        return msg.channel.send('It\'s a tie! We had the same choice.');
      } else if (status == 1) {
        logmsg(logbegin + 'i won');
        return msg.channel.send('I won!');
      } else if (status == -1) {
        logmsg(logbegin + 'they won');
        return msg.channel.send('You won!');
      }
    }
  },
  {
    name: 'join',
    full_string: false,
    description: '`!join` for me to join the voice channel you are in\n`!join <channel>` for me to join a voice channel',
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
    public: true,
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
  {
    name: 'calc',
    full_string: false,
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      let expr = argstring, res, text;
      console.debug(`calculating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(expr)}`);
      let scope;
      if (!(scope = props.saved.calc_scopes[msg.author.id])) {
        scope = props.saved.calc_scopes[msg.author.id] = {};
      }
      global.safecontext = false;
      let promise;
      try {
        res = math.evaluate(expr, scope);
        promise = msg.channel.send(text = `Result: ${res}`);
        console.log(text);
      } catch (e) {
        promise =  msg.channel.send(text = e.toString());
        console.error(text);
      } finally {
        global.safecontext = true;
      }
      schedulePropsSave();
      return promise;
    }
  },
  {
    name: 'calc_scopeview',
    full_string: false,
    description: '`!calc_scopeview` returns JSON of your variable scope',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      console.debug(`calc_scopeview from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let scope = props.saved.calc_scopes[msg.author.id], text;
      let promise;
      if (scope) {
        try {
          promise = msg.channel.send(text = JSON.stringify(scope, math.replacer));
          console.log(text);
        } catch (e) {
          console.error(e);
          try {
            promise = msg.channel.send(text = `Scope too big to fit in a discord message, variables:\n${Reflect.ownKeys(scope).join(', ')}`);
            console.log(text);
          } catch (e) {
            console.error(e);
            promise = msg.channel.send(text = `Scope variables too big to fit in a discord message, use \`!calc_scopeclear\` to wipe`);
            console.log(text);
          }
        }
      } else {
        promise = msg.channel.send(text = `You do not have a scope created yet, one is created when \`!calc\` is run`);
        console.log(text);
      }
      return promise;
    }
  },
  {
    name: 'calc_scopeclear',
    full_string: false,
    description: '`!calc_scopeclear` wipes your scope for the `!calc` command clean',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      console.debug(`calc_scopeclear from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let scope = props.saved.calc_scopes[msg.author.id], text;
      let promise;
      if (scope) {
        delete props.saved.calc_scopes[msg.author.id];
        promise = msg.channel.send(text = `Cleared scope successfully`);
        console.log(text);
        schedulePropsSave();
      } else {
        promise = msg.channel.send(text = `You do not have a scope created yet`);
        console.log(text);
      }
      return promise;
    }
  },
];
