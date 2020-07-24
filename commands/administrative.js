module.exports = [
  {
    name: 'say',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      let text = argstring.slice(4);
      msg.delete();
      msg.channel.send(text);
    }
  },
  {
    name: 'sayy',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      let argr = argstring.split(' ');
      let channelid = argr[1].slice(2, argr[1].length - 1);
      let text = argr.slice(2).join(' ');
      client.channels.get(channelid).send(text);
    }
  },
  {
    name: 'c-gmute',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      mutelist.push(user.id);
      msg.channel.send(`Globally muted ${user.tag}`);
    }
  },
  {
    name: 'c-gunmute',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      let ind;
      if ((ind = mutelist.indexOf(user.id)) != -1) {
        mutelist.splice(ind, 1);
        msg.channel.send(`Globally unmuted ${user.tag}`);
      } else {
        msg.channel.send(`${user.tag} not gobally muted`);
      }
    }
  },
  {
    name: 'c-mute',
    full_string: false,
    description: '`!c-mute @person` to auto-delete any messages sent by person in this guild',
    public: true,
    execute(msg, argstring, command, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot mute, guild not in database');
      if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.hasPermission('ADMINISTRATOR'))) return msg.channel.send('You do not have permission to run this command.');;
      props.saved.guilds[msg.guild.id].mutelist.push(user.id);
      msg.channel.send(`Muted ${user.tag}`);
      schedulePropsSave();
    }
  },
  {
    name: 'c-unmute',
    full_string: false,
    description: '`!c-unmute @person` to stop auto-deleting messages sent by person in this guild',
    public: true,
    execute(msg, argstring, command, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot mute, guild not in database');
      if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.hasPermission('ADMINISTRATOR'))) return msg.channel.send('You do not have permission to run this command.');;
      let ind;
      if ((ind = props.saved.guilds[msg.guild.id].mutelist.indexOf(user.id)) != -1) {
        props.saved.guilds[msg.guild.id].mutelist.splice(ind, 1);
        msg.channel.send(`Unmuted ${user.tag}`);
      } else {
        msg.channel.send(`${user.tag} not muted`);
      }
      schedulePropsSave();
    }
  },
  {
    name: 'kick',
    full_string: false,
    description: '`!kick @person` to kick someone from this guild',
    public: true,
    execute(msg, argstring, command, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!msg.member.hasPermission('KICK_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025')
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (member.hasPermission('KICK_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') {
        var perm_failed = new Discord.RichEmbed()
          .setTitle('Access denied!')
          .setDescription('This user is a mod!');
        return msg.channel.send(perm_failed);
      }
      if (!client.hasPermission('KICK_MEMBERS'))
        return msg.channel.send('I cannot kick members');
      member.kick();
      msg.delete();
      var kick = new Discord.RichEmbed()
        .setTitle("Goodbye!")
        .setDescription(`${member.displayName} has been successfully kicked`);
      msg.channel.send(kick);
    }
  },
  {
    name: 'ban',
    full_string: false,
    description: '`!ban @person` to ban someone from this guild',
    public: true,
    execute(msg, argstring, command, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!msg.member.hasPermission('BAN_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025')
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (member.hasPermission("BAN_MEMBERS") && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') {
        var perm_failed = new Discord.RichEmbed()
          .setTitle('Access denied!')
          .setDescription('This user is a mod!')
        return msg.channel.send(perm_failed);
      }
      if (!client.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('I cannot ban members');
      member.ban();
      msg.delete();
      var ban = new Discord.RichEmbed()
        .setTitle("Goodbye!")
        .setDescription(`${member.displayName} has been stook with a ban hammer`);
      msg.channel.send(ban);
    }
  },/*
  {
    name: 'unban',
    full_string: false,
    description: '`!unban @person` to unban someone from this guild',
    public: true,
    execute(msg, argstring, command, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!msg.member.hasPermission('MANAGE_SERVER') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025')
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (member.hasPermission("BAN_MEMBERS") && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') {
        var perm_failed = new Discord.RichEmbed()
          .setTitle('Access denied!')
          .setDescription('This user is a mod!')
        return msg.channel.send(perm_failed);
      }
      if (!client.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('I cannot ban members');
      member.ban();
      msg.delete();
      var ban = new Discord.RichEmbed()
        .setTitle("Goodbye!")
        .setDescription(`${member.displayName} has been stook with a ban hammer`);
      msg.channel.send(ban);
    }
  },*/
  {
    name: 'giveadmin',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
      if (/^[0-9]+$/.test(args[0])) { developers.push(args[0]); }
      else if (/^<@![0-9]+>$/.test(args[0])) { developers.push(args[0].slice(3, args[0].length - 1)); }
      else return;
      setTimeout(() => {
        let arr = developers.filter(x => x != args[0]);
        developers.splice(0, Infinity);
        developers.push(...arr);
        msg.channel.send(args.slice(2, Infinity).join(' ') || 'times up fool');
      }, Number(args[1]) || 120000);
    }
  },
  {
    name: 'wipedevelopers',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      developers.length = 0;
    }
  },
  {
    name: 'eval',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)))
        return msg.channel.send('You do not have permissions to run this command.');
      if (args.length == 2 && args[0] == 'deez' && args[1] == 'nuts') return msg.channel.send('no');
      let cmd = argstring.slice(5), res;
      console.debug(`evaluating ${util.inspect(cmd)}`);
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        var richres = new Discord.RichEmbed()
          .setTitle('Eval Result')
          .setDescription(util.inspect(res));
        msg.channel.send(richres);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        var richres = new Discord.RichEmbed()
          .setTitle('Eval Error')
          .setDescription(e.stack);
        msg.channel.send(richres);
      }
    }
  },
  {
    name: 'evalv',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring.slice(5), res;
      console.debug(`evaluating (output voided) ${util.inspect(cmd)}`);
      try {
        res = eval(cmd);
        console.debug(res);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
      }
    }
  },
  {
    name: 'exec',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring.slice(5), res;
      console.debug(`shell exec ${util.inspect(cmd)}`);
      let proc = cp.exec(cmd, { timeout: 20000, windowsHide: true }, (err, stdout, stderr) => {
        procs.splice(procs.indexOf(proc), 1);
        if (err) {
          console.log('error in shell exec');
          console.debug(err.stack);
          var richres = new Discord.RichEmbed()
            .setTitle('Shell Command Error')
            .setDescription(err.stack);
          msg.channel.send(richres);
          return;
        }
        stdout = stdout.toString(); stderr = stderr.toString();
        console.debug(`shell command result\nstdout:\n${util.inspect(stdout)}\nstderr:\n${util.inspect(stderr)}`);
        var richres = new Discord.RichEmbed()
          .setTitle('Shell Command Result')
          .setDescription(`*stdout*:\n${util.inspect(stdout)}\n*stderr*:\n${util.inspect(stderr)}`);
        msg.channel.send(richres);
      });
      procs.push(proc);
    }
  },
  {
    name: 'echoargs',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      msg.channel.send(argstring.split('').map(x => ((x == '<') ? ('\\' + x) : x)).join(''));
    }
  },
  {
    name: 'crash',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id))
        return msg.reply('Only developers can test crashing thebotcat.');
      msg.channel.send('Crashing myself RIP');
      throw new Error('ERORRORORORO');
    }
  }
];