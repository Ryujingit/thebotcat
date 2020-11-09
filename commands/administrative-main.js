module.exports = [
  {
    name: 'mute',
    full_string: false,
    description: '`!mute @person` to mute someone by adding the muted role to them',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.MUTE))
        return msg.channel.send('You do not have permission to run this command.');

      if (!props.saved.guilds[msg.guild.id].mutedrole)
        return msg.channel.send('Error: no guild muted role specified, set one with `!settings mutedrole set <@role|id|name|query>`');

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
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);

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
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let channel, reason = [];

      for (var i = 0; i < args.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(args[i])) {
          reason.push(args[i]);
        } else {
          channel = msg.guild.channels.cache.find(x => x.id == args[i]);
          if (!channel) return msg.channel.send('Cannot lock channel outside of this guild.');
        }
      }

      reason = reason.join(' ');
      if (!channel) channel = msg.channel;

      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      if (newperms.filter(x => x.id == msg.guild.id).length == 0) {
        newperms.push({
          id: msg.guild.id,
          type: 'role',
          allow: 0,
          deny: 0,
        });
      }
      let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[channel.type];
      let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * (type & 1) | Discord.Permissions.FLAGS['CONNECT'] * (type & 2);
      newperms.forEach(x => {
        if (!Object.keys(props.saved.guilds[msg.guild.id].perms).filter(y => y == x.id && props.saved.guilds[msg.guild.id].perms[y] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK)).length) {
          x.allow &= ~bits;
          x.deny |= bits;
        }
      });
      let newpermids = newperms.map(x => x.id);
      Object.keys(props.saved.guilds[msg.guild.id].perms).forEach(x => {
        if (props.saved.guilds[msg.guild.id].perms[x] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK) && !newpermids.includes(x))
          newperms.push({
            id: x,
            type: 'role',
            allow: bits,
            deny: 0,
          });
      });

      if (!common.serializedPermissionsEqual(perms, newperms)) {
        props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id] = perms;
        common.partialDeserializePermissionOverwrites(channel, newperms);
        schedulePropsSave();
        return msg.channel.send(`Locked channel <#${channel.id}> (id ${channel.id})`);
      } else {
        return msg.channel.send(`Channel <#${channel.id}> (id ${channel.id}) already locked or no permissions to change`);
      }
    }
  },
  {
    name: 'unlock',
    full_string: false,
    description: '`!unlock` to unlock this channel, resetting permissions to what they were before the lock\n`!unlock #channel` to unlock a specific channel',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let channel, reason = [];

      for (var i = 0; i < args.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(args[i])) {
          reason.push(args[i]);
        } else {
          channel = msg.guild.channels.cache.find(x => x.id == args[i]);
          if (!channel) return msg.channel.send('Cannot unlock channel outside of this guild.');
        }
      }

      reason = reason.join(' ');
      if (!channel) channel = msg.channel;

      let perms = props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
      if (perms) {
        common.partialDeserializePermissionOverwrites(channel, perms);
        delete props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
        schedulePropsSave();
        return msg.channel.send(`Unlocked channel <#${channel.id}> (id ${channel.id})`);
      } else {
        return msg.channel.send(`Channel <#${channel.id}> (id ${channel.id}) not locked`);
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
];