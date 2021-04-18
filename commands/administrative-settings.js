module.exports = [
  {
    name: 'settings',
    description: '`!settings` for available settings\n`!settings <setting>` for help on a specific setting',
    description_slash: 'changes botcat\'s settings for this guild',
    flags: 0b110110,
    options: [
      {
        type: 1, name: 'prefix', description: 'view or change my server prefix',
        options: [ { type: 3, name: 'prefix', description: 'the prefix' } ],
      },
      {
        type: 1, name: 'confirmkb', description: 'view or set whether there is confirmation on the kick, ban, and unban commands',
        options: [ { type: 5, name: 'confirmation', description: 'confirmation' } ],
      },
      {
        type: 2, name: 'badwords', description: 'configures moderation on bad words',
        options: [
          {
            type: 1, name: 'list', description: 'list all badwords or a specific word',
            options: [ { type: 3, name: 'word', description: 'a badword' } ],
          },
          {
            type: 1, name: 'add', description: 'add a badword',
            options: [
              { type: 3, name: 'word', description: 'the badword to add', required: true },
              { type: 3, name: 'retaliation', description: 'the retaliation for saying the badword', required: true },
              {
                type: 4, name: 'type', description: 'type flags for badword', required: true,
                choices: [
                  { name: '0: entire message is badword, case sensitive', value: 0 },
                  { name: '1: message split by spaces contains badword, case sensitive', value: 1 },
                  { name: '2: badword is substring in message, case sensitive', value: 2 },
                  { name: '4: entire message is badword, case insensitive', value: 4 },
                  { name: '5: message split by spaces contains badword, case insensitive', value: 5 },
                  { name: '6: badword is substring in message, case insensitive', value: 6 },
                ],
              },
              { type: 5, name: 'enabled', description: 'whether the word is enabled' },
              { type: 5, name: 'ignore_admin', description: 'whether the badword can be said by admins' },
              { type: 3, name: 'ignored_roles', description: 'roles who can say the badword' },
            ],
          },
          {
            type: 1, name: 'remove', description: 'remove a badword',
            options: [ { type: 3, name: 'word', description: 'the badword to remove', required: true } ],
          },
          {
            type: 1, name: 'modify', description: 'modify a badword',
            options: [
              { type: 3, name: 'word', description: 'the badword to modify', required: true },
              { type: 3, name: 'retaliation', description: 'the retaliation for saying the badword' },
              {
                type: 4, name: 'type', description: 'type flags for badword',
                choices: [
                  { name: '0: entire message is badword, case sensitive', value: 0 },
                  { name: '1: message split by spaces contains badword, case sensitive', value: 1 },
                  { name: '2: badword is substring in message, case sensitive', value: 2 },
                  { name: '4: entire message is badword, case insensitive', value: 4 },
                  { name: '5: message split by spaces contains badword, case insensitive', value: 5 },
                  { name: '6: badword is substring in message, case insensitive', value: 6 },
                ],
              },
              { type: 5, name: 'enabled', description: 'whether the word is enabled' },
              { type: 5, name: 'ignore_admin', description: 'whether the badword can be said by admins' },
              { type: 3, name: 'ignored_roles', description: 'roles who can say the badword' },
            ],
          },
        ],
      },
      {
        type: 2, name: 'logchannel', description: 'view or set server logging channel',
        options: [
          { type: 1, name: 'view', description: 'view server logging channel' },
          {
            type: 1, name: 'set', description: 'set server logging channel',
            options: [ { type: 7, name: 'logchannel', description: 'the logging channel or this channel if one isn\'t provided' } ],
          },
          { type: 1, name: 'clear', description: 'clear server logging channel' },
        ],
      },
      {
        type: 2,
        name: 'mutedrole',
        description: 'view or set muted role',
        options: [
          {
            type: 1, name: 'view', description: 'view muted role'
          },
          {
            type: 1, name: 'set', description: 'set muted role or unset if none is provided',
            options: [ { type: 8, name: 'mutedrole', description: 'the role' } ],
          },
        ],
      },
      {
        type: 2, name: 'roles', description: 'view or set bot-level role permissions',
        options: [
          {
            type: 1, name: 'view', description: 'view roles with bot-level permissions or view permissions for one role',
            options: [ { type: 8, name: 'role', description: 'the role' } ],
          },
          {
            type: 1, name: 'init', description: 'create bot-level permissions for a role',
            options: [ { type: 8, name: 'role', description: 'the role', required: true } ],
          },
          {
            type: 1, name: 'clear', description: 'remove bot-level permissions for a role',
            options: [ { type: 8, name: 'role', description: 'the role', required: true } ],
          },
          {
            type: 1, name: 'setperms', description: 'set bot-level permissions for a role',
            options: [
              { type: 8, name: 'role', description: 'the role', required: true },
              {
                type: 3, name: 'value', description: 'enable or disable permissions', required: true,
                choices: [ { name: 'enable', value: 'enable'}, { name: 'disable', value: 'disable'} ],
              },
              { type: 3, name: 'permissions', description: 'string of a permission or permissions', required: true },
            ]
          },
        ],
      },
      {
        type: 2, name: 'overrides', description: 'view or set bot-level role permission overrides for channels',
        options: [
          {
            type: 1, name: 'view', description: 'view channels with overrides (bot-level), overrides for a channel, or a specific override',
            options: [
              { type: 7, name: 'channel', description: 'a channel' },
              { type: 8, name: 'role', description: 'a role' },
            ]
          },
          {
            type: 1, name: 'init', description: 'create bot-level overrides for a role in a channel',
            options: [
              { type: 7, name: 'channel', description: 'the channel', required: true },
              { type: 8, name: 'role', description: 'the role' },
            ]
          },
          {
            type: 1, name: 'clear', description: 'remove bot-level overrides for a role in a channel',
            options: [
              { type: 7, name: 'channel', description: 'the channel', required: true },
              { type: 8, name: 'role', description: 'the role' },
            ]
          },
          {
            type: 1, name: 'setperms', description: 'set bot-level overrides for a role in a channel',
            options: [
              { type: 7, name: 'channel', description: 'the channel', required: true },
              { type: 8, name: 'role', description: 'the role', required: true },
              {
                type: 3, name: 'value', description: 'enable, disable, or reset permissions', required: true,
                choices: [ { name: 'enable', value: 'enable'}, { name: 'disable', value: 'disable'}, { name: 'reset', value: 'reset'} ],
              },
              { type: 3, name: 'permissions', description: 'string of a permission or permissions', required: true },
            ]
          },
        ],
      },
      {
        type: 2, name: 'enabledcmds', description: 'view or set which commands are enabled',
        options: [
          {
            type: 1, name: 'view', description: 'view whether commands are enabled globally or for a category or command',
            options: [
              {
                type: 3, name: 'scope', description: 'the scope of the view', required: true,
                choices: [ { name: 'global', value: 'global' }, { name: 'category', value: 'category' }, { name: 'command', value: 'command' } ],
              },
              { type: 3, name: 'cat_or_cmd', description: 'the category or command' },
            ]
          },
          {
            type: 1, name: 'set', description: 'set whether commands are enabled globally or for a category or command',
            options: [
              {
                type: 3, name: 'scope', description: 'the scope of the setting', required: true,
                choices: [ { name: 'global', value: 'global' }, { name: 'category', value: 'category' }, { name: 'command', value: 'command' }, { name: 'all', value: 'all' } ],
              },
              {
                type: 3, name: 'value', description: 'whether to enable or disable', required: true,
                choices: [ { name: 'enable', value: 'enable' }, { name: 'disable', value: 'disable' } ],
              },
              { type: 3, name: 'cat_or_cmd', description: 'the category or command' },
            ],
          },
        ],
      },
    ],
    execute(o, msg, rawArgs) {
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
      
      if (rawArgs.length == 0) {
        if (fullperms)
          return msg.channel.send(`List of settings:\nprefix, confirmkb, badwords, logchannel, mutedrole, roles, overrides, enabledcmds`);
        else
          return msg.channel.send(`List of settings:\nprefix, badwords`);
      }
      
      switch (rawArgs[0]) {
        case 'prefix':
          if (rawArgs.length == 1) {
            return msg.channel.send(`The current server prefix is: \`${guilddata.prefix}\`\n\`${guilddata.prefix}settings prefix <newprefix>\` to set.`);
          } else {
            guilddata.prefix = rawArgs.slice(1).join(' ');
            schedulePropsSave();
            return msg.channel.send(`Server prefix set to: \`${guilddata.prefix}\``);
          }
          break;
        
        case 'confirmkb':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send(`Confirmation on the kick, ban, and unban commands: ${guilddata.confirm_kb ? '✅' : '❌'}\n\`${guilddata.prefix}settings confirmkb true|yes|false|no\` to set.`);
          } else {
            switch (rawArgs[1]) {
              case 'true': case 'yes':
                guilddata.confirm_kb = true;
                break;
              
              case 'false': case 'no':
                guilddata.confirm_kb = false;
                break;
              
              default:
                return msg.channel.send(`\`${guilddata.prefix}settings confirmkb true|yes|false|no\` to set.`);
            }
            schedulePropsSave();
            return msg.channel.send(`Confirmation on the kick, ban, and unban commands set to: ${guilddata.confirm_kb ? '✅' : '❌'}`);
          }
          break;
        
        case 'badwords':
          if (rawArgs.length == 1) {
            return msg.channel.send(
              'To list badwords run `settings badwords list`.\n' +
              'To list info about one badword run `settings badwords list <word>`.\n' +
              'To add a badword run `settings badwords add <word> <retaliation> <type> <enabled> <ignore_admin> [<ignored_role> ...]`.\n' +
              'To remove a badword run `settings badwords remove <word>`.\n' +
              'To modify a badword run `settings badwords modify <word> <retaliation> <type> <enabled> <ignore_admin> [<ignored_role> ...]`.'
            );
          } else {
            switch (rawArgs[1]) {
              case 'list':
                if (rawArgs.length == 2) {
                  return msg.channel.send({ embed: { title: 'List of badwords', description: guilddata.basic_automod.bad_words.map(x => x.word).join(', ') } });
                } else {
                  let word = guilddata.basic_automod.bad_words.filter(x => x.word == rawArgs[2])[0];
                  if (!word) return msg.channel.send({ embed: { title: 'Error', description: `Word ${util.inspect(rawArgs[2])} not found` } });
                  return msg.channel.send({
                    embed: {
                      title: `Information for badword ${util.inspect(word.word)}`,
                      fields: [
                        { name: 'Retailiation', value: `${word.retaliation}`, inline: false },
                        { name: 'Enabled', value: `${word.enabled}`, inline: true },
                        { name: 'Ignore Admin', value: `${word.ignore_admin}`, inline: true },
                        { name: 'Ignored Roles', value: `${word.ignored_roles.length ? word.ignored_roles.map(x => `<@&#{x}>`).join(' ') : 'None'}`, inline: false },
                      ],
                    }
                  });
                }
                break;
              
              case 'add':
                if (rawArgs.length < 8) return msg.channel.send('Not enough arguments');
                let type = Number(rawArgs[5]);
                if (!(Number.isSafeInteger(type) && type >= 0 && type < 8 && type % 4 != 3))
                  return msg.channel.send('Type must be an integer and any of 0, 1, 2, 4, 5, 6');
                if (guilddata.basic_automod.bad_words.filter(x => x.word == rawArgs[2]).length)
                  return msg.channel.send({ embed: { title: 'Word Already Exists', description: `Word ${util.inspect(rawArgs[5])} already exists` } });
                guilddata.basic_automod.bad_words.push({
                  enabled: common.stringToBoolean(rawArgs[4]),
                  type,
                  ignore_admin: common.stringToBoolean(rawArgs[6]),
                  ignored_roles: rawArgs[7].split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x),
                  word: rawArgs[2],
                  retaliation: rawArgs[3],
                });
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Added', description: `Word ${util.inspect(rawArgs[2])} successfully added` } });
                break;
              
              case 'remove':
                if (rawArgs.length < 3) return msg.channel.send('Not enough arguments');
                let index = null;
                for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == rawArgs[2]) {
                    index = i;
                    break;
                  }
                }
                if (index == null) return msg.channel.send({ embed: { title: 'Word Not Found', description: `Word ${util.inspect(rawArgs[2])} not found` } });
                guilddata.basic_automod.bad_words.splice(index, 1);
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Removed', description: `Word ${util.inspect(rawArgs[2])} successfully removed` } });
                break;
              
              case 'modify':
                if (rawArgs.length < 8) return msg.channel.send('Not enough arguments');
                let index2 = null;
                for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                  if (guilddata.basic_automod.bad_words[i].word == rawArgs[2]) {
                    index2 = i;
                    break;
                  }
                }
                if (index2 == null) return msg.channel.send({ embed: { title: 'Word Not Found', description: `Word ${util.inspect(rawArgs[2])} not found` } });
                let type2 = Number(rawArgs[5]);
                if (!(Number.isSafeInteger(type2) && type2 >= 0 && type2 < 8 && type2 % 4 != 3))
                  return msg.channel.send('Type must be an integer and any of 0, 1, 2, 4, 5, 6');
                guilddata.basic_automod.bad_words[index2] = {
                  enabled: common.stringToBoolean(rawArgs[4]),
                  type: type2,
                  ignore_admin: common.stringToBoolean(rawArgs[6]),
                  ignored_roles: rawArgs[7].split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x),
                  word: rawArgs[2],
                  retaliation: rawArgs[3],
                };
                schedulePropsSave();
                return msg.channel.send({ embed: { title: 'Word Modified', description: `Word ${util.inspect(rawArgs[2])} successfully modified` } });
                break;
            }
          }
          break;
        
        case 'logchannel':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send(
              `The current logging channel is ` + (guilddata.logging.main ? `<#${guilddata.logging.main}> (id ${guilddata.logging.main})` : `none`) + '.\n' +
              'To set logging channel to this channel run `settings logchannel set`.\n' +
              'To set logging channel to a channel run `settings logchannel set <#channel>`.\n' +
              'To turn off logging run `settings logchannel clear`.'
            );
          } else {
            let logchannel = rawArgs.slice(1).join(' ');
            if (logchannel == 'clear') {
              guilddata.logging.main = null;
              schedulePropsSave();
              return msg.channel.send('Logging disabled.');
            } else if (logchannel == 'set') {
              guilddata.logging.main = msg.channel.id;
              schedulePropsSave();
              return msg.channel.send(`Logging channel set to <#${msg.channel.id}> (id ${msg.channel.id}).`);
            } else if (/^set <#[0-9]+>$/.test(logchannel)) {
              logchannel = logchannel.slice(6, logchannel.length - 1);
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
                'To set logging channel to a channel run `settings logchannel set <#channel>`.\n' +
                'To turn off logging run `settings logchannel clear`.'
              );
            }
          }
          break;
        
        case 'mutedrole':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send({
              embed: {
                title: 'Muted Role',
                description: `The muted role is currently set to: ${guilddata.mutedrole ? '<@&' + guilddata.mutedrole + '>' : 'nothing'}\n` +
                  `To change, run \`settings mutedrole set <@mention|id|name|query>\`.\nTo reset, run \`settings mutedrole set\`.`,
              }
            });
          } else {
            if (rawArgs[1] == 'set') {
              if (rawArgs.length == 2) {
                if (guilddata.mutedrole) {
                  guilddata.mutedrole = null;
                  schedulePropsSave();
                  return msg.channel.send('Muted role reset.');
                } else {
                  return msg.channel.send('Muted role not set in the first place.');
                }
              } else {
                let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
                if (Array.isArray(role)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${roles.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  guilddata.mutedrole = role.id;
                  schedulePropsSave();
                  return msg.channel.send({ embed: { title: 'Muted Role', description: `<@&${role.id}> set as muted role.` } });
                }
              }
            } else {
              return msg.channel.send('Invalid option. To change, run `settings mutedrole set <@mention|id|name|query>`.\nTo reset, run `settings mutedrole set`.');
            }
          }
          break;
        
        case 'roles':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send(
              'This command configures the bot-level permissions certain roles have, ranging from music command access to muting, locking, kicking, banning, and bot settings control.\n\n' +
              'To view roles with bot-level permissions set, run `settings roles view`.\n' +
              'To view the permissions for one role, run `settings roles view <@mention|name|query>`\n' +
              'To create permissions for a role, run `settings roles init <@mention|name|query>`\n' +
              'To remove permissions for a role, run `settings roles clear <@mention|name|query>`\n' +
              'To set a specific permission for a role, run `settings roles setperms <@mention|name|query> enable/disable [<permission name|permission id> ...]`',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                if (rawArgs.length == 2) {
                  return msg.channel.send({
                    embed: {
                      title: 'Roles',
                      description: 'Roles with bot-level permissions:\n' + Object.keys(guilddata.perms).map(x => `<@&${x}>`),
                    }
                  });
                } else {
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
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
                let role = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
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
                let role2 = common.searchRoles(msg.guild.roles, rawArgs.slice(2).join(' '));
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
              
              case 'setperms':
                if (rawArgs[3] != 'enable' && rawArgs[3] != 'disable')
                  return msg.channel.send('Invalid option. Run `settings roles` to view options.');
                
                let role3 = common.searchRoles(msg.guild.roles, rawArgs[2]);
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
                  let permsToChange = rawArgs.slice(4).map(perm => {
                    let nperm = Number(perm);
                    if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                    else return common.constants.botRolePermBits[perm];
                  }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
                  if (rawArgs[3] == 'enable')
                    guilddata.perms[role3.id] |= permsToChange;
                  else
                    guilddata.perms[role3.id] &= ~permsToChange;
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Permissions Updated',
                      description: `Permissions ${changedPerms.map(x => `\'${x}\'`).join(', ')} ${rawArgs[2] == 'enable' ? 'enabled' : 'disabled'} for role <@&${role3.id}>.`
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
        
        case 'overrides':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send(
              'This command configures the bot-level permission overrides for certain channels.\n\n' +
              'To view channels with overrides, run `settings overrides view`.\n' +
              'To view override roles for a channel, run `settings overrides view #channel`.\n' +
              'To view the permissions for one role on one channel, run `settings overrides view #channel <@mention|name|query>`\n' +
              'To create overrides for a channel, run `settings overrides init #channel`\n' +
              'To remove overrides for a channel, run `settings overrides clear #channel`\n' +
              'To create permissions for a role, run `settings overrides init #channel <@mention|name|query>`\n' +
              'To remove permissions for a role, run `settings overrides clear #channel <@mention|name|query>`\n' +
              'To set a specific permission for a role, run `settings overrides setperms #channel <@mention|name|query> enable/disable/reset [<permission name|permission id> ...]`',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                if (rawArgs.length == 2) {
                  return msg.channel.send({
                    embed: {
                      title: 'Channels',
                      description: 'Channels with bot-level permission overrides:\n' + Object.keys(guilddata.overrides).map(x => `<#${x}>`),
                    }
                  });
                } else if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return msg.channel.send({
                      embed: {
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }
                    });
                  }
                  return msg.channel.send({
                    embed: {
                      title: 'Roles',
                      description: `Roles with bot-level permission overrides for <#${channel.id}>:\n` + Object.keys(guilddata.overrides[channel.id]).map(x => `<@&${x}>`),
                    }
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return msg.channel.send({
                      embed: {
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (!guilddata.overrides[channel.id][role.id])
                      return msg.channel.send({
                        embed: {
                          title: 'No Permissions',
                          description: `No bot-level overrides in channel <#${channel.id}> for role <@&${role.id}>.`
                        }
                      });
                    return msg.channel.send({
                      embed: {
                        title: 'Permissions',
                        description: `Permissions for <@&${role.id}>:\n` + 
                          common.getBotPermissionsArray(guilddata.overrides[channel.id][role.id], true).map(x => `${x[1] > 0 ? '🟩' : x[1] < 0 ? '🟥' : '⬛'} ${x[0]}`).join('\n')
                      }
                    });
                  }
                }
                break;
              
              case 'init':
                if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (guilddata.overrides[channel.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Overrides Exist',
                        description: `Bot-level overrides already exist for channel <#${channel.id}>.`
                      }
                    });
                  guilddata.overrides[channel.id] = {};
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Overrides Created',
                      description: `Overrides created for channel <#${channel.id}>.`
                    }
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return msg.channel.send({
                      embed: {
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (guilddata.overrides[channel.id][role.id])
                      return msg.channel.send({
                        embed: {
                          title: 'Overrides Exist',
                          description: `Bot-level overrides already exist in channel <#${channel.id}> for role <@&${role.id}>.`
                        }
                      });
                    guilddata.overrides[channel.id][role.id] = { allows: 0, denys: 0 };
                    schedulePropsSave();
                    return msg.channel.send({
                      embed: {
                        title: 'Overrides Created',
                        description: `Overrides created in channel <#${channel.id}> for role <@&${role.id}>.`
                      }
                    });
                  }
                }
                break;
              
              case 'clear':
                if (rawArgs.length == 3) {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Overrides Do Not Exist',
                        description: `Bot-level overrides do not exist for channel <#${channel.id}>.`
                      }
                    });
                  delete guilddata.overrides[channel.id];
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Overrides Cleared',
                      description: `Overrides cleared for channel <#${channel.id}>.`
                    }
                  });
                } else {
                  let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                  if (!channel) {
                    return msg.channel.send('Error: no such channel');
                  }
                  if (!guilddata.overrides[channel.id]) {
                    return msg.channel.send({
                      embed: {
                        title: 'No Overrides',
                        description: `No bot-level overrides for channel <#${channel.id}>.`
                      }
                    });
                  }
                  let role = common.searchRoles(msg.guild.roles, rawArgs.slice(3).join(' '));
                  if (Array.isArray(role)) {
                    return msg.channel.send({
                      embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role.map(x => '<@&' + x.id + '>').join(' ')}` }
                    });
                  } else {
                    if (!guilddata.overrides[channel.id][role.id])
                      return msg.channel.send({
                        embed: {
                          title: 'Overrides Do Not Exist',
                          description: `Bot-level overrides do not exist in channel <#${channel.id}> for role <@&${role.id}>.`
                        }
                      });
                    delete guilddata.overrides[channel.id][role.id];
                    schedulePropsSave();
                    return msg.channel.send({
                      embed: {
                        title: 'Overrides Cleared',
                        description: `Overrides cleared in channel <#${channel.id}> for role <@&${role.id}>.`
                      }
                    });
                  }
                }
                break;
              
              case 'setperms':
                if (rawArgs[4] != 'enable' && rawArgs[4] != 'disable' && rawArgs[4] != 'reset')
                  return msg.channel.send('Invalid option. Run `settings overrides` to view options.');
                
                let channel = msg.guild.channels.cache.get(/^<#([0-9]+)>$/.exec(rawArgs[2])[1]);
                if (!channel) {
                  return msg.channel.send('Error: no such channel');
                }
                if (!guilddata.overrides[channel.id]) {
                  return msg.channel.send({
                    embed: {
                      title: 'No Overrides',
                      description: `No bot-level overrides for channel <#${channel.id}>.`
                    }
                  });
                }
                let role3 = common.searchRoles(msg.guild.roles, rawArgs[3]);
                if (Array.isArray(role3)) {
                  return msg.channel.send({
                    embed: { title: 'Not Specific Enough', description: `Your query narrows it down to these roles:\n${role3.map(x => '<@&' + x.id + '>').join(' ')}` }
                  });
                } else {
                  if (!guilddata.overrides[channel.id][role3.id])
                    return msg.channel.send({
                      embed: {
                        title: 'Overrides Do Not Exist',
                        description: `Bot-level overrides do not exist in channel <#${channel.id}> for role <@&${role3.id}>.`
                      }
                    });
                  let changedPerms = [];
                  let permsToChange = rawArgs.slice(5).map(perm => {
                    let nperm = Number(perm);
                    if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                    else return common.constants.botRolePermBits[perm];
                  }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
                  switch (rawArgs[4]) {
                    case 'enable':
                      guilddata.overrides[channel.id][role3.id].allows |= permsToChange;
                      guilddata.overrides[channel.id][role3.id].denys &= ~permsToChange;
                      break;
                    case 'disable':
                      guilddata.overrides[channel.id][role3.id].denys |= permsToChange;
                      guilddata.overrides[channel.id][role3.id].allows &= ~permsToChange;
                      break;
                    case 'reset':
                      guilddata.overrides[channel.id][role3.id].allows &= ~permsToChange;
                      guilddata.overrides[channel.id][role3.id].denys &= ~permsToChange;
                      break;
                  }
                  schedulePropsSave();
                  return msg.channel.send({
                    embed: {
                      title: 'Overrides Updated',
                      description: `Overrides ${changedPerms.map(x => `\'${x}\'`).join(', ')} ${rawArgs[1] == 'enable' ? 'enabled' : rawArgs[1] == 'disable' ? 'disabled' : 'reset'} in channel <#${channel.id}> for role <@&${role3.id}>.`
                    }
                  });
                }
                break;
              
              default:
                return msg.channel.send('Invalid option. Run `settings overrides` to view options.');
                break;
            }
          }
          break;
        
        case 'enabledcmds':
          if (!fullperms) return silenced ? null : msg.channel.send('You do not have permission to run this command.');
          if (rawArgs.length == 1) {
            return msg.channel.send(
              'This command configures which commands are enabled.\n\n' +
              'To view whether commands are enabled globally, run `settings enabledcmds view global`.\n' +
              'To view whether a particular command or category is enabled, run `settings enabledcmds view <\'category\'/\'command\'> <command/category>`.\n' +
              'To turn on or off commands globally, run `settings enabledcmds set global <\'enable\'/\'disable\'>`.\n' +
              'To turn on or off a particular command or category, run `settings enabledcmds set <\'category\'/\'command\'> <\'enable\'/\'disable\'> <command/category>`.\n' +
              'To enable or disable everything, run `settings enabledcmds set all <\'enable\'/\'disable\'>`.',
            );
          } else {
            switch (rawArgs[1]) {
              case 'view':
                switch (rawArgs[2]) {
                  case 'global':
                    return msg.channel.send(`Commands are globally ${guilddata.enabled_commands.global ? 'enabled' : 'disabled'}.`);
                    break;
                  
                  case 'category':
                    let category = guilddata.enabled_commands.categories[rawArgs.slice(3).join(' ')];
                    if (category != null) {
                      return msg.channel.send(`The category '${rawArgs.slice(3).join(' ')}' is ${category ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The category '${rawArgs.slice(3).join(' ')}' does not exist.`);
                    }
                    break;
                  
                  case 'command':
                    let command = guilddata.enabled_commands.commands[rawArgs.slice(3).join(' ')];
                    if (command != null) {
                      return msg.channel.send(`The command '${rawArgs.slice(3).join(' ')}' is ${command ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The command '${rawArgs.slice(3).join(' ')}' does not exist.`);
                    }
                    break;
                  
                  default:
                    return msg.channel.send('Invalid option. Run `settings enabledcmds` to view options.');
                    break;
                }
                break;
              
              case 'set':
                switch (rawArgs[2]) {
                  case 'global':
                    guilddata.enabled_commands.global = rawArgs[3] == 'enable';
                    schedulePropsSave();
                    return msg.channel.send(`Global commands have been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                    break;
                  
                  case 'category':
                    let category = guilddata.enabled_commands.categories[rawArgs[4]];
                    if (category != null) {
                      guilddata.enabled_commands.categories[rawArgs[4]] = rawArgs[3] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The category '${rawArgs[4]}' has been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The category '${rawArgs[4]}' does not exist.`);
                    }
                    break;
                  
                  case 'command':
                    let command = guilddata.enabled_commands.commands[rawArgs[4]];
                    if (command != null) {
                      guilddata.enabled_commands.commands[rawArgs[4]] = rawArgs[3] == 'enable';
                      schedulePropsSave();
                      return msg.channel.send(`The command '${rawArgs[4]}' has been successfully ${rawArgs[3] == 'enable' ? 'enabled' : 'disabled'}.`);
                    } else {
                      return msg.channel.send(`The command '${rawArgs[4]}' does not exist.`);
                    }
                    break;
                  
                  case 'all':
                    let val = rawArgs[3] == 'enable';
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
    },
    execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      let guilddata = props.saved.guilds[o.guild.id];
      
      let silenced = !guilddata.enabled_commands.global ||
        !guilddata.enabled_commands.categories.Administrative ||
        !guilddata.enabled_commands.commands.settings;
      
      let perms = common.hasBotPermissions(o, common.constants.botRolePermBits.MANAGE_BOT | common.constants.botRolePermBits.MANAGE_BOT_FULL);
      
      let basicperms = perms & common.constants.botRolePermBits.MANAGE_BOT, fullperms = perms & common.constants.botRolePermBits.MANAGE_BOT_FULL;
      
      if (!basicperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      switch (args[0].name) {
        case 'prefix':
          if (!args[0].options) {
            return common.slashCmdResp(interaction, true, `The current server prefix is: \`${guilddata.prefix}\``);
          } else {
            guilddata.prefix = args[0].options[0].value;
            schedulePropsSave();
            return common.slashCmdResp(interaction, false, `Server prefix set to: \`${guilddata.prefix}\``);
          }
          break;
        
        case 'confirmkb':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
          if (!args[0].options) {
            return common.slashCmdResp(interaction, true, `Confirmation on the kick, ban, and unban commands: ${guilddata.confirm_kb ? '✅' : '❌'}.`);
          } else {
            guilddata.confirm_kb = args[0].options[0].value;
            schedulePropsSave();
            return common.slashCmdResp(interaction, false, `Confirmation on the kick, ban, and unban commands set to: ${guilddata.confirm_kb ? '✅' : '❌'}`);
          }
          break;
        
        case 'badwords':
          switch (args[0].options[0].name) {
            case 'list':
              if (!args[0].options[0].options) {
                return common.slashCmdResp(interaction, true, 'Badwords: ' + guilddata.basic_automod.bad_words.map(x => x.word).join(', '));
              } else {
                let word = guilddata.basic_automod.bad_words.filter(x => x.word == args[0].options[0].options[0].value)[0];
                if (!word) return common.slashCmdResp(interaction, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
                return common.slashCmdResp(interaction, true,
                  `Information for badword ${util.inspect(word.word)}:\n` +
                  `Retailiation: ${word.retaliation}\n` +
                  `Enabled: ${word.enabled}\n` +
                  `Ignore Admin: ${word.ignore_admin}\n` +
                  `Ignored Roles: ${word.ignored_roles.length ? word.ignored_roles.map(x => `<@&#{x}>`).join(' ') : 'None'}`);
              }
              break;
            
            case 'add':
              if (guilddata.basic_automod.bad_words.filter(x => x.word == args[0].options[0].options[0].value).length)
                return common.slashCmdResp(interaction, true, `Word ${util.inspect(args[0].options[0].options[0].value)} already exists`);
              guilddata.basic_automod.bad_words.push({
                enabled: args[0].options[0].options.filter(x => x.name == 'enabled')[0]?.value ?? true,
                type: Number(args[0].options[0].options[2].value),
                ignore_admin: args[0].options[0].options.filter(x => x.name == 'ignore_admin')[0]?.value ?? false,
                ignored_roles: (args[0].options[0].options.filter(x => x.name == 'ignore_admin')[0]?.value || '').split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x),
                word: args[0].options[0].options[0].value,
                retaliation: args[0].options[0].options[1].value,
              });
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully added`);
              break;
            
            case 'remove':
              let index = null;
              for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                if (guilddata.basic_automod.bad_words[i].word == args[0].options[0].options[0].value) {
                  index = i;
                  break;
                }
              }
              if (index == null) return common.slashCmdResp(interaction, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
              guilddata.basic_automod.bad_words.splice(index, 1);
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully removed`);
              break;
            
            case 'modify':
              let index2 = null;
              for (var i = 0; i < guilddata.basic_automod.bad_words.length; i++) {
                if (guilddata.basic_automod.bad_words[i].word == args[0].options[0].options[0].value) {
                  index2 = i;
                  break;
                }
              }
              if (index2 == null) return common.slashCmdResp(interaction, true, `Word ${util.inspect(args[0].options[0].options[0].value)} not found`);
              guilddata.basic_automod.bad_words[index2] = {
                enabled: args[0].options[0].options.filter(x => x.name == 'enabled')[0]?.value ?? guilddata.basic_automod.bad_words[index2].enabled,
                type: Number(args[0].options[0].options.filter(x => x.name == 'type')[0]?.value ?? guilddata.basic_automod.bad_words[index2].type),
                ignore_admin: args[0].options[0].options.filter(x => x.name == 'ignore_admin')[0]?.value ?? guilddata.basic_automod.bad_words[index2].ignore_admin,
                ignored_roles: (() => {
                  let val = args[0].options[0].options.filter(x => x.name == 'ignored_roles')[0]?.value;
                  return val ? val.split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x) : guilddata.basic_automod.bad_words[index2].ignored_roles;
                })(),
                word: args[0].options[0].options[0].value,
                retaliation: args[0].options[0].options.filter(x => x.name == 'retaliation')[0]?.value ?? guilddata.basic_automod.bad_words[index2].retaliation,
              };
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Word ${util.inspect(args[0].options[0].options[0].value)} successfully modified`);
              break;
          }
          break;
        
        case 'logchannel':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, false, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              return common.slashCmdResp(interaction, true, `The current logging channel is ` + (guilddata.logging.main ? `<#${guilddata.logging.main}> (id ${guilddata.logging.main})` : `none`) + '.');
              break;
            
            case 'set':
              if (!args[0].options[0].options) {
                guilddata.logging.main = o.channel.id;
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `Logging channel set to <#${o.channel.id}> (id ${o.channel.id}).`);
              } else {
                if (o.guild.channels.cache.get(args[0].options[0].options[0].value)) {
                  guilddata.logging.main = args[0].options[0].options[0].value;
                  schedulePropsSave();
                  return common.slashCmdResp(interaction, false, `Logging channel set to <#${args[0].options[0].options[0].value}> (id ${args[0].options[0].options[0].value}).`);
                } else {
                  return common.slashCmdResp(interaction, true, 'Channel nonexistent or not in this server.');
                }
              }
              break;
            
            case 'clear':
              guilddata.logging.main = null;
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, 'Logging disabled.');
              break;
          }
          break;
        
        case 'mutedrole':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              return common.slashCmdResp(interaction, true, `The muted role is currently set to: ${guilddata.mutedrole ? '<@&' + guilddata.mutedrole + '>' : 'nothing'}`);
              break;
            
            case 'set':
              if (!args[0].options[0].options) {
                if (guilddata.mutedrole) {
                  guilddata.mutedrole = null;
                  schedulePropsSave();
                  return common.slashCmdResp(interaction, false, 'Muted role reset.');
                } else {
                  return common.slashCmdResp(interaction, false, 'Muted role not set in the first place.');
                }
              } else {
                guilddata.mutedrole = args[0].options[0].options[0].value;
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `<@&${args[0].options[0].options[0].value}> set as muted role.`);
              }
              break;
          }
          break;
        
        case 'roles':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              if (!args[0].options[0].options) {
                return common.slashCmdResp(interaction, true, 'Roles with bot-level permissions:\n' + Object.keys(guilddata.perms).map(x => `<@&${x}>`));
              } else {
                let roleid = args[0].options[0].options[0].value;
                if (!guilddata.perms[roleid])
                  return common.slashCmdResp(interaction, true, `No bot-level permissions for role <@&${roleid}>.`);
                return common.slashCmdResp(interaction, true, `Permissions for <@&${roleid}>:\n` + 
                  common.getBotPermissionsArray(guilddata.perms[roleid]).map(x => `${x[1] ? '🟩' : '🟥'} ${x[0]}`).join('\n'));
              }
              break;
            
            case 'init':
              let roleid = args[0].options[0].options[0].value;
              if (guilddata.perms[roleid])
                return common.slashCmdResp(interaction, false, `Bot-level permissions already exist for role <@&${roleid}>.`);
              guilddata.perms[roleid] = guilddata.perms[o.guild.id];
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Permissions created for role <@&${roleid}>.`);
              break;
            
            case 'clear':
              let roleid2 = args[0].options[0].options[0].value;
              if (!guilddata.perms[roleid2])
                return common.slashCmdResp(interaction, false, `Bot-level permissions do not exist for role <@&${roleid2}>.`);
              if (roleid2 != o.guild.id)
                delete guilddata.perms[roleid2];
              else
                guilddata.perms[roleid2] = common.constants.botRolePermDef;
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Permissions cleared for role <@&${roleid2}>.`);
              break;
            
            case 'setperms':
              let roleid3 = args[0].options[0].options[0].value;
              if (!guilddata.perms[roleid3])
                return common.slashCmdResp(interaction, false, `Bot-level permissions do not exist for role <@&${roleid3}>.`);
              let changedPerms = [];
              let permsToChange = args[0].options[0].options[2].value.split(' ').map(perm => {
                let nperm = Number(perm);
                if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                else return common.constants.botRolePermBits[perm];
              }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
              if (args[0].options[0].options[1].value == 'enable')
                guilddata.perms[roleid3] |= permsToChange;
              else
                guilddata.perms[roleid3] &= ~permsToChange;
              schedulePropsSave();
              return common.slashCmdResp(interaction, false, `Permissions ${changedPerms.map(x => `\'${x}\'`).join(', ')} ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'} for role <@&${roleid3}>.`);
              break;
          }
          break;
        
        case 'overrides':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              if (!args[0].options[0].options) {
                return common.slashCmdResp(interaction, true, 'Channels with bot-level permission overrides:\n' + Object.keys(guilddata.overrides).map(x => `<#${x}>`));
              } else if (args[0].options[0].options.length == 1) {
                if (args[0].options[0].options[0].name != 'channel')
                  return common.slashCmdResp(interaction, true, `Role parameter by itself cannot be specified`);
                let channelid = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelid]) {
                  return common.slashCmdResp(interaction, true, `No bot-level overrides for channel <#${channelid}>.`);
                }
                return common.slashCmdResp(interaction, true, `Roles with bot-level permission overrides for <#${channelid}>:\n` + Object.keys(guilddata.overrides[channelid]).map(x => `<@&${x}>`));
              } else {
                let channelid = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelid]) {
                  return common.slashCmdResp(interaction, true, `No bot-level overrides for channel <#${channelid}>.`);
                }
                let roleid = args[0].options[0].options[1].value;
                if (!guilddata.overrides[channelid][roleid])
                  return common.slashCmdResp(interaction, true,  `No bot-level overrides in channel <#${channelid}> for role <@&${roleid}>.`);
                return common.slashCmdResp(interaction, true, `Permissions for <@&${roleid}>:\n` + 
                  common.getBotPermissionsArray(guilddata.overrides[channelid][roleid], true).map(x => `${x[1] > 0 ? '🟩' : x[1] < 0 ? '🟥' : '⬛'} ${x[0]}`).join('\n'));
              }
              break;
            
            case 'init':
              if (args[0].options[0].options.length == 1) {
                let channelid = args[0].options[0].options[0].value;
                if (guilddata.overrides[channelid])
                  return common.slashCmdResp(interaction, false, `Bot-level overrides already exist for channel <#${channelid}>.`);
                guilddata.overrides[channelid] = {};
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `Overrides created for channel <#${channelid}>.`);
              } else {
                let channelid = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelid]) {
                  return common.slashCmdResp(interaction, false, `No bot-level overrides for channel <#${channelid}>.`);
                }
                let roleid = args[0].options[0].options[1].value;
                if (guilddata.overrides[channelid][roleid])
                  return common.slashCmdResp(interaction, false, `Bot-level overrides already exist in channel <#${channelid}> for role <@&${roleid}>.`);
                guilddata.overrides[channelid][roleid] = { allows: 0, denys: 0 };
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `Overrides created in channel <#${channelid}> for role <@&${roleid}>.`);
              }
              break;
            
            case 'clear':
              if (args[0].options[0].options.length == 1) {
                let channelid = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelid])
                  return common.slashCmdResp(interaction, false, `Bot-level overrides do not exist for channel <#${channelid}>.`);
                delete guilddata.overrides[channelid];
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `Overrides cleared for channel <#${channelid}>.`);
              } else {
                let channelid = args[0].options[0].options[0].value;
                if (!guilddata.overrides[channelid]) {
                  return common.slashCmdResp(interaction, false, `No bot-level overrides for channel <#${channelid}>.`);
                }
                let roleid = args[0].options[0].options[1].value;
                if (!guilddata.overrides[channelid][roleid])
                  return common.slashCmdResp(interaction, false, `Bot-level overrides do not exist in channel <#${channelid}> for role <@&${roleid}>.`);
                delete guilddata.overrides[channelid][roleid];
                schedulePropsSave();
                return common.slashCmdResp(interaction, false, `Overrides cleared in channel <#${channelid}> for role <@&${roleid}>.`);
              }
              break;
            
            case 'setperms':
              let channelid = args[0].options[0].options[0].value;
              if (!guilddata.overrides[channelid]) {
                return common.slashCmdResp(interaction, false, `No bot-level overrides for channel <#${channelid}>.`);
              }
              let roleid = args[0].options[0].options[1].value;
              if (!guilddata.overrides[channelid][roleid])
                return common.slashCmdResp(interaction, false, `Bot-level overrides do not exist in channel <#${channelid}> for role <@&${roleid}>.`);
              let changedPerms = [];
              let permsToChange = args[0].options[0].options[3].value.split(' ').map(perm => {
                let nperm = Number(perm);
                if (nperm == nperm) return Number.isSafeInteger(nperm) && nperm > 0 ? nperm : null;
                else return common.constants.botRolePermBits[perm];
              }).filter(x => x != null).reduce((a, c) => (changedPerms.push(common.constants.botRolePermBitsInv[c]), a + c), 0) & common.constants.botRolePermAll;
              switch (args[0].options[0].options[2].value) {
                case 'enable':
                  guilddata.overrides[channelid][roleid].allows |= permsToChange;
                  guilddata.overrides[channelid][roleid].denys &= ~permsToChange;
                  break;
                case 'disable':
                  guilddata.overrides[channelid][roleid].denys |= permsToChange;
                  guilddata.overrides[channelid][roleid].allows &= ~permsToChange;
                  break;
                case 'reset':
                  guilddata.overrides[channelid][roleid].allows &= ~permsToChange;
                  guilddata.overrides[channelid][roleid].denys &= ~permsToChange;
                  break;
              }
              schedulePropsSave();
              return common.slashCmdResp(interaction, false,  `Overrides ${changedPerms.map(x => `\'${x}\'`).join(', ')} ${args[0].options[0].options[2].value == 'enable' ? 'enabled' : args[0].options[0].options[2].value == 'disable' ? 'disabled' : 'reset'} in channel <#${channelid}> for role <@&${roleid}>.`);
              break;
          }
          break;
        
        case 'enabledcmds':
          if (!fullperms) return silenced ? null : common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
          switch (args[0].options[0].name) {
            case 'view':
              switch (args[0].options[0].options[0].value) {
                case 'global':
                  return common.slashCmdResp(interaction, true, `Commands are globally ${guilddata.enabled_commands.global ? 'enabled' : 'disabled'}.`);
                  break;
                
                case 'category':
                  if (!args[0].options[0].options[1])
                    return common.slashCmdResp(interaction, true, `Category must be specified.`);
                  let category = guilddata.enabled_commands.categories[args[0].options[0].options[1].value];
                  if (category != null) {
                    return common.slashCmdResp(interaction, true, `The category '${args[0].options[0].options[1]?.value}' is ${category ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(interaction, true, `The category '${args[0].options[0].options[1]?.value}' does not exist.`);
                  }
                  break;
                
                case 'command':
                  if (!args[0].options[0].options[1])
                    return common.slashCmdResp(interaction, true, `Command must be specified.`);
                  let command = guilddata.enabled_commands.commands[args[0].options[0].options[1].value];
                  if (command != null) {
                    return common.slashCmdResp(interaction, true, `The command '${args[0].options[0].options[1]?.value}' is ${command ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(interaction, true, `The command '${args[0].options[0].options[1]?.value}' does not exist.`);
                  }
                  break;
              }
              break;
            
            case 'set':
              switch (args[0].options[0].options[0].value) {
                case 'global':
                  guilddata.enabled_commands.global = args[0].options[0].options[1].value == 'enable';
                  schedulePropsSave();
                  return common.slashCmdResp(interaction, false, `Global commands have been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                  break;
                
                case 'category':
                  if (!args[0].options[0].options[2])
                    return common.slashCmdResp(interaction, true, `Category must be specified.`);
                  let category = guilddata.enabled_commands.categories[args[0].options[0].options[2].value];
                  if (category != null) {
                    guilddata.enabled_commands.categories[args[0].options[0].options[2].value] = args[0].options[0].options[1].value == 'enable';
                    schedulePropsSave();
                    return common.slashCmdResp(interaction, false, `The category '${args[0].options[0].options[2].value}' has been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(interaction, false, `The category '${args[0].options[0].options[2].value}' does not exist.`);
                  }
                  break;
                
                case 'command':
                  if (!args[0].options[0].options[2])
                    return common.slashCmdResp(interaction, true, `Command must be specified.`);
                  let command = guilddata.enabled_commands.commands[args[0].options[0].options[2].value];
                  if (command != null) {
                    guilddata.enabled_commands.commands[args[0].options[0].options[2].value] = args[0].options[0].options[1].value == 'enable';
                    schedulePropsSave();
                    return common.slashCmdResp(interaction, false, `The command '${args[0].options[0].options[2].value}' has been successfully ${args[0].options[0].options[1].value == 'enable' ? 'enabled' : 'disabled'}.`);
                  } else {
                    return common.slashCmdResp(interaction, false, `The command '${args[0].options[0].options[2].value}' does not exist.`);
                  }
                  break;
                
                case 'all':
                  let val = args[0].options[0].options[1].value == 'enable';
                  guilddata.enabled_commands.global = val;
                  Object.keys(guilddata.enabled_commands.categories)
                    .forEach(x => guilddata.enabled_commands.categories[x] = val);
                  Object.keys(guilddata.enabled_commands.commands)
                    .forEach(x => guilddata.enabled_commands.commands[x] = val);
                  schedulePropsSave();
                  return common.slashCmdResp(interaction, false, `All commands and categories have been ${val ? 'enabled' : 'disabled'}.`);
                  break;
              }
              break;
          }
          break;
      }
    },
  },
];
