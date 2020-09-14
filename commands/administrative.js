module.exports = [
  {
    name: 'say',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      let text = cmdstring.slice(4);
      console.debug(`say from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(text)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`say from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      msg.delete();
      return msg.channel.send(text);
    }
  },
  {
    name: 'sayy',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`sayy from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${channel.guild?channel.guild.name+':'+channel.name:'dms'}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      let argr = argstring.split(' ');
      let channelid = argr[0].slice(2, argr[0].length - 1);
      let text = argr.slice(1).join(' ');
      let channel;
      if (channel = client.channels.cache.get(channelid)) {
        console.debug(`sayy from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${channel.guild?channel.guild.name+':'+channel.name:'dms'}: ${util.inspect(text)}`);
        return channel.send(text);
      }
    }
  },
  {
    name: 'getdmchannel',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      if (!args[0]) return;
      var user;
      if (!(user = msg.mentions.users.first())) {
        let users = msg.guild.members.cache.keyArray().map(x => msg.guild.members.cache.get(x).user);
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
      let dmchannel = await user.createDM();
      return msg.channel.send(`DM channel for ${user.tag} is ${dmchannel.id}, use \`!sayy <#${dmchannel.id}> content\` to speak in channel`);
    }
  },
  {
    name: 'listdmchannels',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      let channels = client.channels.cache.keyArray().map(x => client.channels.cache.get(x)).filter(x => x.type == 'dm').map(x => `${x.id}: ${x.recipient.tag}`).join('\n');
      return msg.channel.send(`DM channels:\n${channels}`);
    }
  },
  {
    name: 'c-gmute',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!mutelist.includes(user.id)) {
        mutelist.push(user.id);
        return msg.channel.send(`Globally muted ${user.tag}`);
      } else {
        return msg.channel.send(`${user.tag} already globally muted`);
      }
    }
  },
  {
    name: 'c-gunmute',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      let ind;
      if ((ind = mutelist.indexOf(user.id)) != -1) {
        mutelist.splice(ind, 1);
        return msg.channel.send(`Globally unmuted ${user.tag}`);
      } else {
        return msg.channel.send(`${user.tag} not gobally muted`);
      }
    }
  },
  {
    name: '@someone',
    full_string: false,
    description: '`!@someone` pings a random person on the server',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || msg.guild.id == '717268211246301236')) return;
      var members = msg.guild.members.cache.keyArray().map(x => msg.guild.members.cache.get(x)).filter(x => !x.user.bot);
      var random_member = members[Math.floor(Math.random() * members.length)];
      return msg.channel.send(`Random ping: <@!${random_member.user.id}>`);
    }
  },
  {
    name: 'settings',
    full_string: false,
    description: '`!settings` to see available settings\n`!settings <setting>` for help on a specific setting',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot run any settings commands, guild not in database');
      let normalperms = common.isDeveloper(msg) || common.isAdmin(msg);
      let ismod = common.isMod(msg);
      if (!(normalperms || ismod)) return msg.channel.send('You do not have permission to run this command.');
      let promise;
      if (args.length == 0) promise = msg.channel.send(`List of settings:\nprefix, modroles`);
      else if (args.length == 1) {
        if (args[0] == 'prefix') promise = msg.channel.send(`The current server prefix is: \`${props.saved.guilds[msg.guild.id].prefix}\`\n\`!settings prefix <newprefix>\` to set`);
        else if (args[0] == 'modroles') {
          let roles = props.saved.guilds[msg.guild.id].modroles.map(x => `<@&${x}>`).join(' ');
          msg.channel.send({ embed: { title: 'Moderator Roles', description: `${roles||'No moderator roles'}\n\nCommands:\n\`!settings modroles list\`\n\`!settings modroles add|remove <mention|id|name>\`` } });
        } else promise = msg.channel.send(`No such setting \`${args[0]}\``);
      } else {
        if (args[0] == 'prefix') {
          props.saved.guilds[msg.guild.id].prefix = args[1];
          promise = msg.channel.send(`Server prefix set to: \`${args[1]}\``);
          schedulePropsSave();
        } else if (args[0] == 'modroles') {
          if (args[1] == 'list') {
            let roles = props.saved.guilds[msg.guild.id].modroles.map(x => `<@&${x}>`).join(' ');
            return msg.channel.send({ embed: { title: 'Moderator Roles', description: `${roles||'No moderator roles'}` } });
          }
          if (args[1] != 'add' && args[1] != 'remove') return msg.channel.send('Commands: `!settings modroles list|add|remove`');
          if (!args[2]) return msg.channel.send('Usage: `!settings modroles add|remove <mention|id|name>`');
          if (!normalperms && ismod) return msg.channel.send('You do not have permission to run this command.');
          let roleid;
          if (/^<@&[0-9]+>$/.test(args[2])) roleid = args[2].slice(3, args[2].length - 1);
          else if (/^[0-9]+$/.test(args[2])) roleid = args[2];
          else {
            let rolelist = msg.guild.roles.cache.keyArray().map(x => msg.guild.roles.cache.get(x)), roleres;
            roleres = rolelist.filter(x => x.name == args[2]);
            if (roleres.length > 2) return msg.channel.send('Error: ambigous role name');
            else if (roleres.length == 1) roleid = roleres[0].id;
            if (!roleid) {
              let lowername = args[2].toLowerCase();
              roleres = rolelist.filter(x => x.name.toLowerCase() == lowername);
              if (roleres.length > 2) return msg.channel.send('Error: ambigous role name');
              else if (roleres.length == 1) roleid = roleres[0].id;
            }
            if (!roleid) {
              let lowername = args[2].toLowerCase();
              roleres = rolelist.filter(x => x.name.toLowerCase().includes(lowername));
              if (roleres.length > 2) return msg.channel.send('Error: ambigous role name');
              else if (roleres.length == 1) roleid = roleres[0].id;
            }
            if (!roleid) return msg.channel.send('Error: could not find role with name ${args[2]}');
          }
          if (args[1] == 'add') {
            if (!props.saved.guilds[msg.guild.id].modroles.includes(roleid)) {
              props.saved.guilds[msg.guild.id].modroles.push(roleid);
              promise = msg.channel.send({ embed: { title: 'Moderator Roles', description: `Added <@&${roleid}> as moderator role` } });
              schedulePropsSave();
            } else {
              promise = msg.channel.send({ embed: { title: 'Moderator Roles', description: `<@&${roleid}> already moderator role` } });
            }
          } else if (args[1] == 'remove') {
            let ind;
            if ((ind = props.saved.guilds[msg.guild.id].modroles.indexOf(roleid)) != -1) {
              props.saved.guilds[msg.guild.id].modroles.splice(ind, 1);
              promise = msg.channel.send({ embed: { title: 'Moderator Roles', description: `Removed <@&${roleid}> as moderator role` } });
              schedulePropsSave();
            } else {
              promise = msg.channel.send({ embed: { title: 'Moderator Roles', description: `<@&${roleid}> not moderator role` } });
            }
          }
        }
        else promise = msg.channel.send(`No such setting \`${args[0]}\``);
      }
      return promise;
    }
  },
  {
    name: 'c-mute',
    full_string: false,
    description: '`!c-mute @person` to auto-delete any messages sent by person in this guild',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot mute, guild not in database');
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg))) return msg.channel.send('You do not have permission to run this command.');
      let promise;
      if (!props.saved.guilds[msg.guild.id].mutelist.includes(user.id)) {
        props.saved.guilds[msg.guild.id].mutelist.push(user.id);
        promise = msg.channel.send(`Muted ${user.tag}`);
        schedulePropsSave();
      } else {
        promise = msg.channel.send(`${user.tag} already muted`);
      }
      return promise;
    }
  },
  {
    name: 'c-unmute',
    full_string: false,
    description: '`!c-unmute @person` to stop auto-deleting messages sent by person in this guild',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot mute, guild not in database');
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg))) return msg.channel.send('You do not have permission to run this command.');
      let ind;
      let promise;
      if ((ind = props.saved.guilds[msg.guild.id].mutelist.indexOf(user.id)) != -1) {
        props.saved.guilds[msg.guild.id].mutelist.splice(ind, 1);
        promise = msg.channel.send(`Unmuted ${user.tag}`);
        schedulePropsSave();
      } else {
        promise = msg.channel.send(`${user.tag} not muted`);
      }
      return promise;
    }
  },
  {
    name: 'lock',
    full_string: false,
    description: '`!lock` to lock this channel, preventing anyone other than moderators from talking in it\n`!lock #channel` to lock a specific channel',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot lock channel, guild not in database');
      let promise;
      if (args.length == 0) {
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || msg.channel.permissionsFor(msg.member).has('MANAGE_CHANNELS'))) return msg.channel.send('You do not have permission to run this command.');
        let perms = common.serializePermissionOverwrites(msg.channel);
        let newperms = perms.map(x => Object.assign({}, x));
        let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[msg.channel.type];
        let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * (type & 1) | Discord.Permissions.FLAGS['CONNECT'] * (type & 2);
        newperms.forEach(x => {
          if (!(props.saved.guilds[msg.guild.id].modroles.includes(x.id) || x.type == 'role' && msg.guild.roles.cache.get(x.id).permissions.has('MANAGE_CHANNELS'))) {
            x.allow &= ~bits;
            x.deny |= bits;
          }
        });
        if (!common.serializedPermissionsEqual(perms, newperms)) {
          props.saved.guilds[msg.guild.id].savedperms[msg.channel.id] = perms;
          common.partialDeserializePermissionOverwrites(msg.channel, newperms);
          promise = msg.channel.send(`Locked channel <#${msg.channel.id}> (id ${msg.channel.id})`);
          schedulePropsSave();
        } else {
          promise = msg.channel.send(`Channel <#${msg.channel.id}> (id ${msg.channel.id}) already locked or no permissions to change`);
        }
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1), channel;
        if (channel = msg.guild.channels.find(x => x.id == channelid)) {
          if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channel.permissionsFor(msg.member).has('MANAGE_CHANNELS'))) return msg.channel.send('You do not have permission to run this command.');
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
            promise = msg.channel.send(`Locked channel <#${channelid}> (id ${channelid})`);
            schedulePropsSave();
          } else {
            promise = msg.channel.send(`Channel <#${channelid}> (id ${channelid}) already locked or no permissions to change`);
          }
        } else return msg.channel.send('Cannot lock channel outside of this guild.');
      }
      return promise;
    }
  },
  {
    name: 'unlock',
    full_string: false,
    description: '`!unlock` to unlock this channel, resetting permissions to what they were before the lock\n`!unlock #channel` to unlock a specific channel',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) return msg.channel.send('Error: cannot unlock channel, guild not in database');
      let promise;
      if (args.length == 0) {
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || msg.channel.permissionsFor(msg.member).has('MANAGE_CHANNELS'))) return msg.channel.send('You do not have permission to run this command.');
        let perms;
        if (perms = props.saved.guilds[msg.guild.id].savedperms[msg.channel.id]) {
          common.partialDeserializePermissionOverwrites(msg.channel, perms);
          delete props.saved.guilds[msg.guild.id].savedperms[msg.channel.id];
          promise = msg.channel.send(`Unlocked channel <#${msg.channel.id}> (id ${msg.channel.id})`);
          schedulePropsSave();
        } else {
          promise = msg.channel.send(`Channel <#${msg.channel.id}> (id ${msg.channel.id}) not locked`);
        }
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1), channel;
        if (channel = msg.guild.channels.find(x => x.id == channelid)) {
          if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || msg.channel.permissionsFor(msg.member).has('MANAGE_CHANNELS'))) return msg.channel.send('You do not have permission to run this command.');
          let perms;
          if (perms = props.saved.guilds[msg.guild.id].savedperms[channelid]) {
            common.partialDeserializePermissionOverwrites(channel, perms);
            delete props.saved.guilds[msg.guild.id].savedperms[channelid];
            promise = msg.channel.send(`Unlocked channel <#${channelid}> (id ${channelid})`);
            schedulePropsSave();
          } else {
            promise = msg.channel.send(`Channel <#${channelid}> (id ${channelid}) not locked`);
          }
        } else return msg.channel.send('Cannot unlock channel outside of this guild.');
      }
      return promise;
    }
  },/*
  {
    name: 'resetnicknames',
    full_string: false,
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isAdmin(msg))) return;
      console.log(`resetnickname called by ${msg.author.tag} in ${msg.guild.name}`);
      var member_array = msg.guild.members.cache.keyArray().map(x => msg.guild.members.cache.get(x));
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
            return msg.channel.send(`${reset_successful} nicknames reset\n${reset_fail} nicknames couldn't be reset due to permission errors\n${already_reset} nicknames already reset`);
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
    async execute(msg, cmdstring, command, argstring, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg) || common.isMod(msg) || msg.member.hasPermission('KICK_MEMBERS')))
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (!msg.guild.me.hasPermission('KICK_MEMBERS')) {
        var kickerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`I do not have permission to kick members.`);
        return msg.channel.send(kickerror);
      }
      try {
        await member.kick();
        var kick = new Discord.MessageEmbed()
          .setTitle("Goodbye!")
          .setDescription(`${member.displayName} has been successfully kicked`);
        return msg.channel.send(kick);
      } catch (e) {
        var kickerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`Cannot kick ${member.displayName}, not high enough in the role hierarchy`);
        return msg.channel.send(kickerror);
      }
    }
  },
  {
    name: 'ban',
    full_string: false,
    description: '`!ban @person` to ban someone from this guild',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg) || msg.member.hasPermission('BAN_MEMBERS')))
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (!msg.guild.me.hasPermission('BAN_MEMBERS')) {
        var banerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`I do not have permission to ban members.`);
        return msg.channel.send(banerror);
      }
      try {
        await member.ban();
        var ban = new Discord.MessageEmbed()
          .setTitle("Goodbye!")
          .setDescription(`${member.displayName} has been successfully banned`);
        return msg.channel.send(ban);
      } catch (e) {
        var banerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`Cannot ban ${member.displayName}, not high enough in the role hierarchy`);
        return msg.channel.send(banerror);
      }
    }
  },
  {
    name: 'unban',
    full_string: false,
    description: '`!unban @person` to unban someone from this guild',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg) || common.isMod(msg) || msg.member.hasPermission('MANAGE_SERVER')))
        return msg.channel.send('You do not have permission to run this command.');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (!msg.guild.me.hasPermission('MANAGE_SERVER')) {
        var unbanerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`I do not have permission to unban members.`);
        return msg.channel.send(unbanerror);
      }
      try {
        await msg.guild.unban(member);
        var unban = new Discord.MessageEmbed()
          .setTitle("Welcome back")
          .setDescription(`${member.displayName} has been successfully unbanned`);
        return msg.channel.send(unban);
      } catch (e) {
        var unbanerror = new Discord.MessageEmbed()
          .setTitle("Error")
          .setDescription(`Cannot unban ${member.displayName}`);
        return msg.channel.send(unbanerror);
      }
    }
  },
  {
    name: 'giveadmin',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
      if (/^[0-9]+$/.test(args[0])) { developers.push(args[0]); }
      else if (/^<@![0-9]+>$/.test(args[0])) { developers.push(args[0].slice(3, args[0].length - 1)); }
      else return;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let arr = developers.filter(x => x != args[0]);
          developers.splice(0, Infinity);
          developers.push(...arr);
          resolve(msg.channel.send(args.slice(2, Infinity).join(' ') || 'times up fool'));
        }, Number(args[1]) || 120000);
      });
    }
  },
  {
    name: 'wipedevelopers',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      developers.length = 0;
    }
  },
  {
    name: 'eval',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring, res;
      console.debug(`evaluating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
      if (args.length == 2 && (args[0] == 'deez' && args[1] == 'nuts' || args[0] == 'goe' && args[1] == 'mama')) return msg.channel.send('no');
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`))) {
          return msg.channel.send('Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Result')
          .setDescription(util.inspect(res));
        return await msg.channel.send(richres);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Error')
          .setDescription(e.stack);
        return await msg.channel.send(richres);
      }
    }
  },
  {
    name: 'evalv',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring, res;
      console.debug(`evaluating (output voided) from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating (output voided) from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
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
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring, res;
      console.debug(`shell exec from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`shell exec from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`))) {
          return msg.channel.send('Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
      return new Promise((resolve, reject) => {
        let proc = cp.exec(cmd, { timeout: 20000, windowsHide: true }, (err, stdout, stderr) => {
          procs.splice(procs.indexOf(proc), 1);
          if (err) {
            console.log('error in shell exec');
            console.debug(err.stack);
            var richres = new Discord.MessageEmbed()
              .setTitle('Shell Command Error')
              .setDescription(err.stack);
            msg.channel.send(richres).then(x => resolve(x)).catch(e => reject(e));
            return;
          }
          stdout = stdout.toString(); stderr = stderr.toString();
          console.debug(`shell command result\nstdout:\n${util.inspect(stdout)}\nstderr:\n${util.inspect(stderr)}`);
          var richres = new Discord.MessageEmbed()
            .setTitle('Shell Command Result')
            .setDescription(`*stdout*:\n${util.inspect(stdout)}\n*stderr*:\n${util.inspect(stderr)}`);
            msg.channel.send(richres).then(x => resolve(x)).catch(e => reject(e));
        });
        procs.push(proc);
      });
    }
  },
  {
    name: 'echoargs',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (!common.isDeveloper(msg)) return;
      return msg.channel.send(cmdstring.split('').map(x => ((x == '<') ? ('\\' + x) : x)).join(''));
    }
  },
  {
    name: 'crash',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id))
        return msg.reply('Only developers can test crashing thebotcat.');
      msg.channel.send('Crashing myself RIP');
      throw new Error('ERORRORORORO');
    }
  }
];
