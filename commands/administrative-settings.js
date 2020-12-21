module.exports = [
  {
    name: 'settings',
    description: '`!settings` to see available settings\n`!settings <setting>` for help on a specific setting',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      let guilddata = props.saved.guilds[msg.guild.id];
      
      let silenced = !guilddata.enabled_commands.global ||
        !guilddata.enabled_commands.categories.Administrative ||
        !guilddata.enabled_commands.commands.settings;

      let perms = common.hasBotPermissions(msg, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);

      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;

      if (!basicperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');

      if (args.length == 0) {
        if (fullperms)
          return msg.channel.send(`List of settings:\nprefix, badwords, logchannel, mutedrole, roles, enabledcmds`);
        else
          return msg.channel.send(`List of settings:\nprefix, badwords`);
      }

      switch (args[0]) {
        case 'prefix':
          if (args.length == 1) {
            return msg.channel.send(`The current server prefix is: \`${guilddata.prefix}\`\n\`${guilddata.prefix}settings prefix <newprefix>\` to set.`);
          } else {
            guilddata.prefix = args.slice(1).join(' ');
            schedulePropsSave();
            return msg.channel.send(`Server prefix set to: \`${guilddata.prefix}\``);
          }
          break;

        case 'badwords':
          if (args.length == 1) {
            return msg.channel.send(
              'To list badwords run `settings badwords list`.\n' +
              'To list info about one badword run `settings badwords list <word>`.\n' +
              'To add badword run `settings badwords add <enabled> <type> <ignore_admin> [<ignored_role> ...] <word> <retaliation>`.\n' +
              'To remove badword run `settings badwords remove <word>`.\n' +
              'To modify badword run `settings badwords modify <word> <enabled> <type> <ignore_admin> [<ignored_role> ...] <retaliation>`.'
            );
          } else {
            switch (args[1]) {
              case 'list':
                if (args.length == 2) {
                  return msg.channel.send({ embed: { title: 'List of badwords', description: guilddata.basic_automod.bad_words.map(x => x.word).join(', ') } });
                } else {
                  let word = guilddata.basic_automod.bad_words.filter(x => x.word == args[2])[0];
                  if (!word) return msg.channel.send({ embed: { title: 'Error', description: 'Word ${args[2]} not found' } });
                  return msg.channel.send({
                    embed: {
                      title: `Information for badword ${util.inspect(word.word)}`,
                      fields: [
                        { name: 'Enabled', value: `${word.enabled}`, inline: true },
                        { name: 'Ignore Admin', value: `${word.ignore_admin}`, inline: true },
                        { name: 'Ignored Roles', value: `${word.ignored_roles.length ? word.ignored_roles.map(x => `<@&#{x}>`).join(' ') : 'None'}`, inline: false },
                        { name: 'Retailiation', value: `${word.retaliation}`, inline: false },
                      ],
                    }
                  });
                }
                break;
              
              case 'add':
                if (args.length < 7) return msg.channel.send('Not enough arguments');
                let type = Number(args[3]);
                if (!(Number.isSafeInteger(type) && type >= 0 && type < 8))
                  return msg.channel.send('Type must be an integer and within 0-8');
                if (guilddata.basic_automod.bad_words.filter(x => x.word == args[5]).length)
                  return msg.channel.send({ embed: { title: 'Word Already Exists', description: `Word ${util.inspect(args[5])} already exists` } });
                guilddata.basic_automod.bad_words.push({ enabled: common.stringToBoolean(args[2]), type, ignore_admin: common.stringToBoolean(args[4]), ignored_roles: [], word: args[5], retaliation: args.slice(6).join(' ') });
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Added', description: `Word ${util.inspect(args[5])} successfully added` } });
                break;
              
              case 'remove':
                if (args.length < 3) return msg.channel.send('Not enough arguments');
                let index = null;
                for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == args[2]) {
                    index = i;
                    break;
                  }
                }
                if (index == null) return msg.channel.send({ embed: { title: 'Word Not Found', description: `Word ${util.inspect(args[5])} not found` } });
                guilddata.basic_automod.bad_words.splice(index, 1);
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Removed', description: `Word ${util.inspect(args[5])} successfully removed` } });
                break;
              
              case 'modify':
                if (args.length < 7) return msg.channel.send('Not enough arguments');
                let index2 = null;
                for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == args[2]) {
                    index2 = i;
                    break;
                  }
                }
                if (index2 == null) return msg.channel.send({ embed: { title: 'Word Not Found', description: `Word ${util.inspect(args[2])} not found` } });
                let type2 = Number(args[4]);
                if (!(Number.isSafeInteger(type2) && type2 >= 0 && type2 < 8))
                  return msg.channel.send('Type must be an integer and within 0-8');
                guilddata.basic_automod.bad_words[index2] = { enabled: common.stringToBoolean(args[2]), type2, ignore_admin: common.stringToBoolean(args[4]), ignored_roles: [], word: args[5], retaliation: args.slice(6).join(' ') };
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Modified', description: `Word ${util.inspect(args[5])} successfully modified` } });
                break;
            }
          }
          break;

        case 'logchannel':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              `The current logging channel is ` + (guilddata.logging.main ? `<#${guilddata.logging.main}> (id ${guilddata.logging.main})` : `none`) + '.\n' +
              'To set logging channel to this channel run `settings logchannel set`.\n' +
              'To set logging channel to a channel run `settings logchannel <#channel>`.\n' +
              'To turn of logging run `settings logchannel null`.'
            );
          } else {
            let logchannel = args.slice(1).join(' ');
            if (logchannel == 'null') {
              guilddata.logging.main = null;
              schedulePropsSave();
              return msg.channel.send('Logging channel disabled.');
            } else if (logchannel == 'set' || logchannel == 'this') {
              guilddata.logging.main = msg.channel.id;
              schedulePropsSave();
              return msg.channel.send(`Logging channel set to <#${msg.channel.id}> (id ${msg.channel.id}).`);
            } else if (/<#[0-9]+>/.test(logchannel)) {
              logchannel = logchannel.slice(2, logchannel.length - 1);
              if (msg.guild.channels.cache.get(logchannel)) {
                guilddata.logging.main = logchannel;
                schedulePropsSave();
                return msg.channel.send(`Logging channel set to <#${logchannel}> (id ${logchannel}).`);
              } else {
                return msg.channel.send('Channel nonexistent or not in this server.');
              }
            } else {
              return msg.channel.send(
                'Argument not a valid channel.\n' +
                'To set logging channel to this channel run `settings logchannel set`.\n' +
                'To set logging channel to a channel run `settings logchannel <#channel>`.\n' +
                'To turn of logging run `settings logchannel null`.'
              );
            }
          }
          break;

        case 'mutedrole':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send({
              embed: {
                title: 'Muted Role',
                description: `The muted role is currently set to: ${guilddata.mutedrole ? '<@&' + guilddata.mutedrole + '>' : 'nothing'}\n` +
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
                guilddata.mutedrole = role.id;
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Muted Role', description: `<@&${role.id}> set as muted role.` } });
              }
            } else if (args[1] == 'reset') {
              if (guilddata.mutedrole) {
                guilddata.mutedrole = null;
                schedulePropsSave();
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
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures the bot-level permissions certain roles have, ranging from music command access to muting, locking, kicking, banning, and bot settings control.\n\n' +
              'To view roles with bot-level permissions set, run `settings roles view`.\n' +
              'To view the permissions for one role, run `settings roles view <@mention|name|query>`\n' +
              'To create permissions for a role, run `settings roles init <@mention|name|query>`\n' +
              'To remove permissions for a role, run `settings roles clear <@mention|name|query>`\n' +
              'To set a specific permission for a role, run `settings roles enable/disable <@mention|name|query> <permission name|permission id> [<2nd permission name|permission id> ...]`',
            );
          } else {
            switch (args[1]) {
              case 'view':
                if (args.length == 2) {
                  return msg.channel.send({
                    embed: {
                      title: 'Roles',
                      description: 'Roles with bot-level permissions:\n' + Object.keys(guilddata.perms).map(x => `<@&${x}>`),
                    }
                  });
                } else {
                  let role = common.searchRoles(msg.guild.roles, args.slice(2).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (!guilddata.perms[role.id])
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
                          common.getBotPermissionsArray(guilddata.perms[role.id]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n')
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
                  if (guilddata.perms[role.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Exist',
                        description: `Bot-level permissions already exist for role <@&${role.id}>.`
                      }
                    });
                  guilddata.perms[role.id] = guilddata.perms[msg.guild.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Created',
                      description: `Permissions created for role <@&${role.id}>.`
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
                  if (!guilddata.perms[role2.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role2.id}>.`
                      }
                    });
                  if (role2.id != msg.guild.id)
                    delete guilddata.perms[role2.id];
                  else
                    guilddata.perms[role2.id] = common.constants.botRolePermDef;
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Cleared',
                      description: `Permissions cleared for role <@&${role2.id}>.`
                    }
                  });
                }
                break;

              case 'enable':
              case 'disable':
                let role3 = common.searchRoles(msg.guild.roles, args[2]);
                if (Array.isArray(role3)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role3.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!guilddata.perms[role3.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions Do Not Exist',
                        description: `Bot-level permissions do not exist for role <@&${role3.id}>.`
                      }
                    });
                  let changedPerms = [];
                  let permsToChange = args.slice(3).map(perm => {
                    let nperm = Number(perm);
                    if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                    else return common.constants.botRolePermBits[perm];
                  }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
                  if (args[1] == 'enable')
                    guilddata.perms[role3.id] |= permsToChange;
                  else
                    guilddata.perms[role3.id] &= ~permsToChange;
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Updated',
                      description: `Permissions ${changedPerms.map(x => `\'${x}\'`).join(', ')} ${args[1] == 'enable' ? 'enabled' : 'disabled'} for role <@&${role3.id}>.`
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
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (args.length == 1) {
            return msg.channel.send(
              'This command configures which commands are enabled.\n\n' +
              'To view whether commands are enabled globally, run `settings enabledcmds view global`.\n' +
              'To view whether a particular command or category is enabled, run `settings enabledcmds view <\'category\'/\'command\'> <command/category>`.\n' +
              'To turn on or off commands globally, run `settings enabledcmds <\'enable\'/\'disable\'> global`.\n' +
              'To turn on or off a particular command or category, run `settings enabledcmds <\'enable\'/\'disable\'> <\'category\'/\'command\'> <command/category>`.\n' +
              'To enable or disable everything, run `settings enabledcmds <\'enable\'/\'disable\'> all`.',
            );
          } else {
            switch (args[1]) {
              case 'view':
                switch (args[2]) {
                  case 'global':
                    return msg.channel.send(`Commands are globally ${guilddata.enabled_commands.global ? 'enabled' : 'disabled'}.`);
                    break;

                  case 'category':
                    let category = guilddata.enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' is ${category ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The category '${ args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = guilddata.enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' is ${command ? 'enabled' : 'disabled'}.`);
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
                    guilddata.enabled_commands.global = args[1] == 'enable';
                    schedulePropsSave();
                    return msg.channel.send(`Global commands have been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}.`);
                    break;

                  case 'category':
                    let category = guilddata.enabled_commands.categories[args.slice(3).join(' ')];
                    if (category != null) {
                      guilddata.enabled_commands.categories[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The category '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'command':
                    let command = guilddata.enabled_commands.commands[args.slice(3).join(' ')];
                    if (command != null) {
                      guilddata.enabled_commands.commands[args.slice(3).join(' ')] = args[1] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' has been successfully ${args[1] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The command '${args.slice(3).join(' ')}' does not exist.`);
                    }
                    break;

                  case 'all':
                    let val = args[1] == 'enable';
                    guilddata.enabled_commands.global = val;
                    Object.keys(guilddata.enabled_commands.categories)
                      .forEach(x => guilddata.enabled_commands.categories[x] = val);
                    Object.keys(guilddata.enabled_commands.commands)
                      .forEach(x => guilddata.enabled_commands.commands[x] = val);
                    schedulePropsSave();
                    return msg.channel.send(`All commands and categories have been ${val ? 'enabled' : 'disabled'}.`);
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
];
