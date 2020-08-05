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
      let channel;
      if (channel = client.channels.get(channelid))
        channel.send(text);
    }
  },
  {
    name: 'getdmchannel',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      if (!args[0]) return;
      var user;
      if (!(user = msg.mentions.users.first())) {
        let users = msg.guild.members.keyArray().map(x => msg.guild.members.get(x).user);
        if (/^[0-9]+$/.test(args[0])) {
          let arr = users.filter(x => x.id == args[0]);
          if (arr.length == 1) user = arr[0];
        } else {
          let search = args[0].toLowerCase();
          let matches = users.filter(x => x.tag.toLowerCase().includes(search));
          if (matches.length == 0) return;
          if (matches.length == 1) user = matches[0];
          else {
            matches = matches.filter(x => x.tag.includes(args[0]));
            if (matches.length == 0) return;
            if (matches.length == 1) user = matches[0];
            else return;
          }
        }
      }
      user.createDM().then(x => msg.channel.send(`DM channel for ${user.tag} is ${x.id}, use \`!sayy <#${x.id}> content\` to speak in channel`));
    }
  },
  {
    name: 'listdmchannels',
    full_string: false,
    public: false,
    execute(msg, argstring, command, args) {
      if (!((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id))) return;
      let channels = client.channels.keyArray().map(x => client.channels.get(x)).filter(x => x.type == 'dm').map(x => `${x.id}: ${x.recipient.tag}`).join('\n');
      msg.channel.send(`DM channels:\n${channels}`);
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
      if (!mutelist.includes(user.id)) {
        mutelist.push(user.id);
        msg.channel.send(`Globally muted ${user.tag}`);
      } else {
        msg.channel.send(`${user.tag} already globally muted`);
      }
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
    name: '@someone',
    full_string: false,
    description: '`!@someone` pings a random person on the server',
    public: true,
    execute (msg, argstring, command, args) {
      if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.hasPermission('ADMINISTRATOR') || msg.guild.id == '717268211246301236')) return;
      var members = msg.guild.members.keyArray().map(x => msg.guild.members.get(x)).filter(x => !x.user.bot);
      var random_member = members[Math.floor(Math.random() * members.length)];
      msg.channel.send(`Random ping: <@!${random_member.user.id}>`);
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
      if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.hasPermission('ADMINISTRATOR'))) return msg.channel.send('You do not have permission to run this command.');
      if (!props.saved.guilds[msg.guild.id].mutelist.includes(user.id)) {
        props.saved.guilds[msg.guild.id].mutelist.push(user.id);
        msg.channel.send(`Muted ${user.tag}`);
        schedulePropsSave();
      } else {
        msg.channel.send(`${user.tag} already muted`);
      }
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
      if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.hasPermission('ADMINISTRATOR'))) return msg.channel.send('You do not have permission to run this command.');
      let ind;
      if ((ind = props.saved.guilds[msg.guild.id].mutelist.indexOf(user.id)) != -1) {
        props.saved.guilds[msg.guild.id].mutelist.splice(ind, 1);
        msg.channel.send(`Unmuted ${user.tag}`);
        schedulePropsSave();
      } else {
        msg.channel.send(`${user.tag} not muted`);
      }
    }
  },
  {
    name: 'lock',
    full_string: false,
    description: '`!lock` to lock this channel, preventing anyone other than moderators from talking in it\n`!lock #channel` to lock a specific channel',
    public: true,
    execute(msg, argstring, command, args) {
      if (args.length == 0) {
        if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot lock channel, guild not in database');
        if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.roles.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)) || msg.channel.permissionsFor(msg.member).hasPermission('MANAGE_CHANNEL'))) return msg.channel.send('You do not have permission to run this command.');
        let perms = common.serializePermissionOverwrites(msg.channel);
        let newperms = perms.map(x => Object.assign({}, x));
        let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[msg.channel.type];
        let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * (type & 1) | Discord.Permissions.FLAGS['CONNECT'] * (type & 2);
        newperms.forEach(x => {
          if (!(props.saved.guilds[msg.guild.id].modroles.includes(x.id) || x.type == 'role' && msg.guild.roles.get(x.id).hasPermission('MANAGE_CHANNELS'))) {
            x.allow &= ~bits;
            x.deny |= bits;
          }
        });
        if (!common.serializedPermissionsEqual(perms, newperms)) {
          props.saved.guilds[msg.guild.id].savedperms[msg.channel.id] = perms;
          common.partialDeserializePermissionOverwrites(msg.channel, newperms);
          msg.channel.send(`Locked channel <#${msg.channel.id}> (id ${msg.channel.id})`);
          schedulePropsSave();
        } else {
          msg.channel.send(`Channel <#${msg.channel.id}> (id ${msg.channel.id}) already locked or no permissions to change`);
        }
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1), channel;
        if (channel = msg.guild.channels.find(x => x.id == channelid)) {
          if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.roles.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)) || channel.permissionsFor(msg.member).hasPermission('MANAGE_CHANNEL'))) return msg.channel.send('You do not have permission to run this command.');
          let perms = common.serializePermissionOverwrites(channel);
          let newperms = perms.map(x => Object.assign({}, x));
          let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[channel.type];
          let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * (type & 1) | Discord.Permissions.FLAGS['CONNECT'] * (type & 2);
          newperms.forEach(x => {
            if (!props.saved.guilds[msg.guild.id].modroles.includes(x.id)) {
              x.allow &= ~bits;
              x.deny |= bits;
            }
          });
          if (!common.serializedPermissionsEqual(perms, newperms)) {
            props.saved.guilds[msg.guild.id].savedperms[channelid] = perms;
            common.partialDeserializePermissionOverwrites(channel, newperms);
            msg.channel.send(`Locked channel <#${channelid}> (id ${channelid})`);
            schedulePropsSave();
          } else {
            msg.channel.send(`Channel <#${channelid}> (id ${channelid}) already locked or no permissions to change`);
          }
        } else return msg.channel.send('Cannot lock channel outside of this guild.');
      }
    }
  },
  {
    name: 'unlock',
    full_string: false,
    description: '`!unlock` to unlock this channel, resetting permissions to what they were before the lock\n`!unlock #channel` to unlock a specific channel',
    public: true,
    execute(msg, argstring, command, args) {
      if (args.length == 0) {
        if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot lock channel, guild not in database');
        if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.roles.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)) || msg.channel.permissionsFor(msg.member).hasPermission('MANAGE_CHANNEL'))) return msg.channel.send('You do not have permission to run this command.');
        let perms;
        if (perms = props.saved.guilds[msg.guild.id].savedperms[msg.channel.id]) {
          common.partialDeserializePermissionOverwrites(msg.channel, perms);
          delete props.saved.guilds[msg.guild.id].savedperms[msg.channel.id];
          msg.channel.send(`Unlocked channel <#${msg.channel.id}> (id ${msg.channel.id})`);
          schedulePropsSave();
        } else {
          msg.channel.send(`Channel <#${msg.channel.id}> (id ${msg.channel.id}) not locked`);
        }
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1), channel;
        if (channel = msg.guild.channels.find(x => x.id == channelid)) {
          if (!(((!props.erg || msg.channel.id == '724006510576926810') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id)) || msg.member.roles.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)) || msg.channel.permissionsFor(msg.member).hasPermission('MANAGE_CHANNEL'))) return msg.channel.send('You do not have permission to run this command.');
          let perms;
          if (perms = props.saved.guilds[msg.guild.id].savedperms[channelid]) {
            common.partialDeserializePermissionOverwrites(channel, perms);
            delete props.saved.guilds[msg.guild.id].savedperms[channelid];
            msg.channel.send(`Unlocked channel <#${channelid}> (id ${channelid})`);
            schedulePropsSave();
          } else {
            msg.channel.send(`Channel <#${channelid}> (id ${channelid}) not locked`);
          }
        } else return msg.channel.send('Cannot unlock channel outside of this guild.');
      }
    }
  },/*
  {
    name: 'resetnicknames',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id) && !msg.member.hasPermission('ADMINISTRATOR')) return;
      console.log(`resetnickname called by ${msg.author.tag} in ${msg.guild.name}`);
      var member_array = msg.guild.members.keyArray().map(x => msg.guild.members.get(x));
      var already_reset = 0, reset_successful = 0, reset_fail = 0;
      member_array.forEach(
        async x => {
          if (x.nickname != null) {
            try {
              await x.setNickname(x.user.username);
              console.log(`reset nickname of ${x.user.tag}`);
              reset_successful++;
            } catch (e) {
              console.log(`failed reset nickname of ${x.user.tag} due to ${e.toString()}`);
              reset_fail++;
            }
          } else {
            console.log(`already reset nickname of ${x.user.tag}`);
            already_reset++;
          }
          if (already_reset + reset_successful + reset_fail == member_array.length) {
            msg.channel.send(`${reset_successful} nicknames reset\n${reset_fail} nicknames couldn't be reset due to permission errors\n${already_reset} nicknames already reset`);
          }
        }
      );
    }
  },*/
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
      let cmd = argstring.slice(5), res;
      console.debug(`evaluating ${util.inspect(cmd)}`);
      if (args.length == 2 && (args[0] == 'deez' && args[1] == 'nuts' || args[0] == 'goe' && args[1] == 'mama')) return msg.channel.send('no');
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