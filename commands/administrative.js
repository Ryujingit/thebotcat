module.exports = [
  {
    name: 'say',
    full_string: false,
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg))) return;
      let text = cmdstring.slice(4);
      nonlogmsg(`say from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(text)}`);
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
        nonlogmsg(`sayy from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${channel.guild?channel.guild.name+':'+channel.name:'dms'}: ${util.inspect(text)}`);
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
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);

      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;

      if (!basicperms) return msg.channel.send('You do not have permission to run this command.');

      if (args.length == 0) {
        return msg.channel.send(`List of settings:\nprefix, mutedrole, roles, enabledcmds`);
      }

      switch (args[0]) {
        case 'prefix':
          if (args.length == 1) {
            return msg.channel.send(`The current server prefix is: \`${props.saved.guilds[msg.guild.id].prefix}\`\n\`${props.saved.guilds[msg.guild.id].prefix}settings prefix <newprefix>\` to set`);
          } else {
            props.saved.guilds[msg.guild.id].prefix = args.slice(1).join(' ');
            schedulePropsSave();
            return msg.channel.send(`Server prefix set to: \`${props.saved.guilds[msg.guild.id].prefix}\``);
          }
          break;

        case 'mutedrole':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send({
              embed: {
                title: 'Muted Role',
                description: `The muted role is currently set to: ${props.saved.guilds[msg.guild.id].mutedrole ? '<@&' + props.saved.guilds[msg.guild.id].mutedrole + '>' : 'nothing'}\n` +
                  `To change, run \`settings mutedrole set <@mention|id|name|query>\`.\nTo reset, run \`settings mutedrole reset\`.`,
              }
            });
          } else {
            if (args[1] == 'set') {
              let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
              if (Array.isArray(role)) {
                return msg.channel.send({
                  embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${roles.map(x => '<@&' + x.id + '>').join(' ')}` }
                });
              } else {
                props.saved.guilds[msg.guild.id].mutedrole = role.id;
                return msg.channel.send({ embed: { title: 'Muted Role', description: `<@&${role.id}> set as muted role.` } });
              }
            } else if (args[1] == 'reset') {
              if (props.saved.guilds[msg.guild.id].mutedrole) {
                props.saved.guilds[msg.guild.id].mutedrole = null;
                return msg.channel.send('Muted role reset.');
              } else {
                return msg.channel.send('Muted role not set in the first place.');
              }
            } else {
              return msg.channel.send('Invalid option. To change, run `settings mutedrole set <@mention|id|name|query>`.\nTo reset, run `settings mutedrole reset`.');
            }
          }
          break;

        case 'roles':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures the bot-level permissions certain roles have, ranging from music command access to muting, locking, kicking, banning, and bot settings control.\n\n' +
              'To view roles with bot-level permissions set, run `settings roles view`.\n' +
              'To view the permissions for one role, run `settings roles view <@mention|name|query>\n' +
              'To create permissions for a role, run `settings roles init <@mention|name|query>\n' +
              'To remove permissions for a role, run `settings roles clear <@mention|name|query>\n' +
              'To set a specific permission for a role, run `settings roles setperm <@mention|name|query> <permission name|permission id> [<2nd permission name|permission id> ...] <\'enable\'/\'disable\'>`',
            );
          } else {
            switch (args[1]) {
              case 'view':
                if (args.length == 2) {
                  return msg.channel.send({
                    embed: {
                      title: 'Roles',
                      description: 'Roles with bot-level permissions:\n' + Object.keys(props.saved.guilds[msg.guild.id].perms).map(x => `<@&${x}>`),
                    }
                  });
                } else {
                  let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (!props.saved.guilds[msg.guild.id].perms[role.id])
                      return msg.channel.send({
                        embed: {
                          title: 'No Permissions',
                          description: `No bot-level permissions for role <@&${role.id}>.`
                        }
                      });
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions',
                        description: `Permissions for <@&${role.id}>:\n` + 
                          common.getBotPermissionsArray(props.saved.guilds[msg.guild.id].perms[role.id]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n')
                      }
                    });
                  }
                }
                break;

              case 'init':
                let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (props.saved.guilds[msg.guild.id].perms[role.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Exist',
                        description: `Bot-level permissions already exist for role <@&${role.id}>.`
                      }
                    });
                  props.saved.guilds[msg.guild.id].perms[role.id] = props.saved.guilds[msg.guild.id].perms[msg.guild.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Created',
                      description: `Permissions created for role <@&${role.id}>`
                    }
                  });
                }
                break;

              case 'clear':
                let role2 = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                if (Array.isArray(role2)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role2.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!props.saved.guilds[msg.guild.id].perms[role2.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role2.id}>.`
                      }
                    });
                  delete props.saved.guilds[msg.guild.id].perms[role2.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role2.id}>`
                    }
                  });
                }
                break;

              case 'setperm':
                let role3 = common.searchRoles(msg.guild.roles, args[2]);
                if (Array.isArray(role3)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role3.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!props.saved.guilds[msg.guild.id].perms[role3.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role3.id}>.`
                      }
                    });
                  let permsToChange = args.slice(3, args.length - 1).map(perm => {

                  }).filter(x => x != null);
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role3.id}>`
                    }
                  });
                }
                break;

              default:
                return msg.channel.send('Invalid option. Run `settings roles` to view options.');
                break;
            }
          }
          break;

        case 'enabledcmds':
          if (!fullperms) return msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures which commands are enabled.\n\n' +
              'To view whether commands are enabled globally, run `settings enabledcmds view global`.\n' +
              'To view whether a particular command or category is enabled, run `settings enabledcmds view <\'category\'/\'command\'> <command/category>`.\n' +
              'To turn on or off whether commands are enabled globally, run `settings enabledcmds <\'enable\'/\'disable\'> global`.\n' +
              'To turn on or off whether a particular command or category, run `settings enabledcmds <\'enable\'/\'disable\'> <\'category\'/\'command\'> <command/category>`.\n',
            );
          } else {
            switch (args[1]) {
              case 'view':
                switch (args[2]) {
                  case 'global':
                    return msg.channel.send(`Commands are globally ${props.saved.guilds[msg.guild.id].enabled_commands.global ? 'enabled' : 'disabled'}`);
                    break;

                  case 'category':
                    let category = props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' is ${category ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The category '${ args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' is ${command ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  default:
                    return msg.channel.send('Invalid option. Run `settings enabledcmds` to view options.');
                    break;
                }
                break;

              case 'enable':
              case 'disable':
                switch (args[2]) {
                  case 'global':
                    props.saved.guilds[msg.guild.id].enabled_commands.global = args[1] == 'enable';
                    schedulePropsSave();
                    return msg.channel.send(`Global commands have been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    break;

                  case 'category':
                    let category = props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      props.saved.guilds[msg.guild.id].enabled_commands.categories[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      props.saved.guilds[msg.guild.id].enabled_commands.commands[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}`);
                    } else {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;
                }
                break;

              default:
                return msg.channel.send('Invalid option. Run `settings enabledcmds` to view options.');
                break;
            }
          }
          break;
      }
    }
  },
  {
    name: 'mute',
    full_string: false,
    description: '`!mute @person` to mute someone by adding the muted role to them',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.MUTE))
        return msg.channel.send('You do not have permission to run this command.');

      if (!props.saved.guilds[msg.guild.id].mutedrole)
        return msg.channel.send('Error: no guild muted role specified, set one with `!settings mutedrole <@role|id|name|query>`');

      let member;
      try {
        member = await common.searchMember(msg.guild.members, args[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        return msg.channel.send('Could not find member.');
      }

      let mutereason = args.slice(1).join(' ');

      if (!member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.add(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${mutereason ? ' ' + mutereason : ''}`);
        return msg.channel.send(`Muted ${member.user.tag}`);
      } else {
        return msg.channel.send(`${member.user.tag} already muted`);
      }
      return promise;
    }
  },
  {
    name: 'unmute',
    full_string: false,
    description: '`!unmute @person` to unmute someone by removing the muted role from them',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.MUTE))
        return msg.channel.send('You do not have permission to run this command.');

      if (!props.saved.guilds[msg.guild.id].mutedrole)
        return msg.channel.send('Error: no guild muted role specified, set one with `!settings mutedrole <@role|id|name|query>`');

      let member;
      try {
        member = await common.searchMember(msg.guild.members, args[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        return msg.channel.send('Could not find member.');
      }

      let unmutereason = args.slice(1).join(' ');

      if (member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.remove(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${unmutereason ? ' ' + unmutereason : ''}`);
        return msg.channel.send(`Unmuted ${member.user.tag}`);
      } else {
        return msg.channel.send(`${member.user.tag} not muted`);
      }
    }
  },
  {
    name: 'lock',
    full_string: false,
    description: '`!lock` to lock this channel, preventing anyone other than moderators from talking in it\n`!lock #channel` to lock a specific channel',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      let channelid, channel;

      if (args.length == 0) {
        channelid = msg.channel.id;
        channel = msg.channel;
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1);
        channel = msg.guild.channels.find(x => x.id == channelid);
        if (!channel) return msg.channel.send('Cannot lock channel outside of this guild.');
      }

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[channel.type];
      let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * (type & 1) | Discord.Permissions.FLAGS['CONNECT'] * (type & 2);
      newperms.forEach(x => {
        if (!props.saved.guilds[msg.guild.id].perms.filter(y => y.id == x.id && y.perms & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK)).length) {
          x.allow &= ~bits;
          x.deny |= bits;
        }
      });
      let newpermids = newperms.map(x => x.id);
      props.saved.guilds[msg.guild.id].perms.forEach(x => {
        if (x.perms & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK) && !newpermids.includes(x.id))
          newperms.push({
            id: x.id,
            type: 'role',
            allow: bits,
            deny: 0,
          });
      });

      if (!common.serializedPermissionsEqual(perms, newperms)) {
        props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channelid] = perms;
        common.partialDeserializePermissionOverwrites(channel, newperms);
        schedulePropsSave();
        return msg.channel.send(`Locked channel <#${channelid}> (id ${channelid})`);
      } else {
        return msg.channel.send(`Channel <#${channelid}> (id ${channelid}) already locked or no permissions to change`);
      }
    }
  },
  {
    name: 'unlock',
    full_string: false,
    description: '`!unlock` to unlock this channel, resetting permissions to what they were before the lock\n`!unlock #channel` to unlock a specific channel',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

      let channelid, channel;

      if (args.length == 0) {
        channelid = msg.channel.id;
        channel = msg.channel;
      } else if (/<#[0-9]+>/.test(args[0])) {
        let channelid = args[0].slice(2, args[0].length - 1);
        channel = msg.guild.channels.find(x => x.id == channelid);
        if (!channel) return msg.channel.send('Cannot unlock channel outside of this guild.');
      }

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let perms = props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channelid];
      if (perms) {
        common.partialDeserializePermissionOverwrites(channel, perms);
        delete props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channelid];
        schedulePropsSave();
        return msg.channel.send(`Unlocked channel <#${channelid}> (id ${channelid})`);
      } else {
        return msg.channel.send(`Channel <#${channelid}> (id ${channelid}) not locked`);
      }
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
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.KICK))
        return msg.channel.send('You do not have permission to run this command.');

      let member;
      try {
        member = await common.searchMember(msg.guild.members, args[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        console.error(e);
        return msg.channel.send('Could not find member.');
      }
      
      let kickreason = args.slice(1).join(' ');

      if (!msg.guild.me.hasPermission('KICK_MEMBERS'))
        return msg.channel.send('Error: I do not have permission to kick members.');
      
      if (msg.member.roles.highest.position <= member.roles.highest.position)
        return msg.channel.send('You cannot kick someone equal or higher than you in the role hierarchy.');

      if (msg.guild.me.roles.highest.position <= member.roles.highest.position)
        return msg.channel.send('Error: I cannot kick someone equal or higher than me in the role hierarchy.');

      try {
        let kickconfirm = await msg.channel.send(`Are you sure you want to kick user ${member.user.tag} (id ${member.id})${kickreason ? ' with reason ' + util.inspect(kickreason) : ''}?`);
        let kickreacts = kickconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
        await kickconfirm.react('✅');
        await kickconfirm.react('❌');
        kickreacts = await kickreacts;
        if (kickreacts.keyArray().length == 0 || kickreacts.keyArray()[0] == '❌')
          return msg.channel.send('Kick cancelled.');
        await member.kick(`[By ${msg.author.tag} (id ${msg.author.id})]${kickreason ? ' ' + kickreason : ''}`);
        return msg.channel.send(`${member.user.tag} (id ${member.id}) has been successfully kicked`);
      } catch (e) {
        console.error(e);
        return msg.channel.send('Error: something went wrong.');
      }
    }
  },
  {
    name: 'ban',
    full_string: false,
    description: '`!ban @person` to ban someone from this guild',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return msg.channel.send('You do not have permission to run this command.');

      let member, nomember;
      try {
        member = await common.searchMember(msg.guild.members, args[0]);
        if (!member) {
          if (/[0-9]+/.test(args[0])) nomember = true;
          else return msg.channel.send('Could not find member.');
        }
      } catch (e) {
        if (/[0-9]+/.test(args[0])) nomember = true;
        else return msg.channel.send('Could not find member.');
      }

      if (nomember) {
        let banreason = args.slice(1).join(' ');

        if (!msg.guild.me.hasPermission('BAN_MEMBERS'))
          return msg.channel.send('Error: I do not have permission to ban members.');

        try {
          let banconfirm = await msg.channel.send(`Are you sure you want to ban unknown user${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`);
          let banreacts = banconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
          await banconfirm.react('✅');
          await banconfirm.react('❌');
          banreacts = await banreacts;
          if (banreacts.keyArray().length == 0 || banreacts.keyArray()[0] == '❌')
            return msg.channel.send('Ban cancelled.');
          await msg.guild.members.ban(member, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return msg.channel.send(`unknown user has been successfully banned`);
        } catch (e) {
          console.error(e);
          return msg.channel.send('Error: something went wrong.');
        }
      } else {
        let banreason = args.slice(1).join(' ');

        if (!msg.guild.me.hasPermission('BAN_MEMBERS'))
          return msg.channel.send('Error: I do not have permission to ban members.');

        if (msg.member.roles.highest.position <= member.roles.highest.position)
          return msg.channel.send('You cannot ban someone equal or higher than you in the role hierarchy.');

        if (msg.guild.me.roles.highest.position <= member.roles.highest.position)
          return msg.channel.send('Error: I cannot ban someone equal or higher than me in the role hierarchy.');

        try {
          let banconfirm = await msg.channel.send(`Are you sure you want to ban user ${member.user.tag} (id ${member.id})${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`);
          let banreacts = banconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
          await banconfirm.react('✅');
          await banconfirm.react('❌');
          banreacts = await banreacts;
          if (banreacts.keyArray().length == 0 || banreacts.keyArray()[0] == '❌')
            return msg.channel.send('Ban cancelled.');
          await msg.guild.members.ban(member, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return msg.channel.send(`${member.user.tag} (id ${member.id}) has been successfully banned`);
        } catch (e) {
          console.error(e);
          return msg.channel.send('Error: something went wrong.');
        }
      }
    }
  },
  {
    name: 'unban',
    full_string: false,
    description: '`!unban @person` to unban someone from this guild',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return msg.channel.send('You do not have permission to run this command.');

      let memberid;
      if (args[0]) {
        if (/<@!?[0-9]+>|[0-9]+/.test(args[0]))
          memberid = args[0].replace(/[<@!>]/g, '');
      }
      if (!memberid) return;

      let baninfo;
      try {
        baninfo = await msg.guild.fetchBan(memberid);
        if (!baninfo) return msg.channel.send('User not banned or nonexistent.');
      } catch (e) {
        return msg.channel.send('User not banned or nonexistent.');
      }

      let unbanreason = args.slice(1).join(' ');

      if (!msg.guild.me.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('Error: I do not have permission to unban members.');

      try {
        let unbanconfirm = await msg.channel.send(`Are you sure you want to unban user ${baninfo.user.tag} (id ${baninfo.user.id})${unbanreason ? ' with reason ' + util.inspect(unbanreason) : ''}?`);
        let unbanreacts = unbanconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
        await unbanconfirm.react('✅');
        await unbanconfirm.react('❌');
        unbanreacts = await unbanreacts;
        if (unbanreacts.keyArray().length == 0 || unbanreacts.keyArray()[0] == '❌')
          return msg.channel.send('Unban cancelled.');
        await msg.guild.members.unban(memberid, `[By ${msg.author.tag} (id ${msg.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
        return msg.channel.send(`${baninfo.user.tag} (id ${baninfo.user.id}) has been successfully unbanned`);
      } catch (e) {
        return msg.channel.send('Error: something went wrong.');
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
      nonlogmsg(`evaluating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
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
      nonlogmsg(`evaluating (output voided) from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
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
      nonlogmsg(`shell exec from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(cmd)}`);
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
