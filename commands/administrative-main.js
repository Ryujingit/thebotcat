module.exports = [
  {
    name: 'supressembeds',
    full_string: false,
    description: '`!supressembeds <\'suppress\'/\'unsuppress\'> [#channel] <messageid>` to supress or unsupress embeds on a message',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      let suppress, channel, msgid;
      
      switch (args[0]) {
        case 'suppress': suppress = true; break;
        case 'unsuppress': suppress = false; break;
        default: return msg.channel.send('Options are \'supress\' and \'unsupress\''); break;
      }
      
      if (/<#[0-9]+>/.test(args[1])) {
        channel = msg.guild.channels.cache.find(x => x.id == args[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot set slowmode in channel outside of this guild.');
        msgid = args[2];
      } else {
        msgid = args[1];
      }

      if (!channel) channel = msg.channel;
      
      if (channel.type == 'text' || channel.type == 'announcement') {
        let targetMsg;
        try {
          targetMsg = await channel.messages.fetch(msgid);
        } catch (e) {
          return msg.channel.send('Error in fetching message');
        }
        if (msg.author.id == targetMsg.author.id || !common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
          targetMsg.suppressEmbeds(suppress);
        else
          return msg.channel.send('You do not have permission to suppress other member\'s embeds.');
        return msg.channel.send(`Embeds in message ${msgid} in <#${channel.id}> ${suppress ? 'supressed' : 'unsupressed'}.`);
      } else {
        return msg.channel.send(`Channel <#${channel.id}> not a text channel.`);
      }
    }
  },
  {
    name: 'slowmode',
    full_string: false,
    description: '`!slowmode [#channel] <seconds>` to set the slowmode in a text channel to a certain value',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      let channel, seconds;

      if (/<#[0-9]+>/.test(args[0])) {
        channel = msg.guild.channels.cache.find(x => x.id == args[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot set slowmode in channel outside of this guild.');
        seconds = Math.floor(Number(args[1]));
      } else {
        seconds = Math.floor(Number(args[0]));
      }

      if (!channel) channel = msg.channel;
      
      if (!Number.isSafeInteger(seconds) || seconds < 0) return msg.channel.send('Invalid seconds for slowmode.');
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.SLOWMODE, channel))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (channel.type == 'text' || channel.type == 'announcement') {
        try {
          await channel.setRateLimitPerUser(seconds);
          return msg.channel.send(`Slowmode in channel <#${channel.id}> set to ${seconds} seconds.`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nrate_limit_per_user: int value should be less than or equal to ')) {
            return msg.channel.send(`Slowmode must be less than or equal to ${estring.slice(98).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return msg.channel.send('Error.');
          }
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> not a text channel.`);
      }
    }
  },
  {
    name: 'bitrate',
    full_string: false,
    description: '`!bitrate [#channel] <bytespersec>` to set the bitrate (bps not kbps) in a voice channel to a certain value',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      let channel, bitrate;

      if (/<#[0-9]+>/.test(args[0])) {
        channel = msg.guild.channels.cache.find(x => x.id == args[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot set bitrate of channel outside of this guild.');
        bitrate = Math.floor(Number(args[1]));
      } else {
        bitrate = Math.floor(Number(args[0]));
      }

      if (!channel) channel = msg.channel;
      
      if (!Number.isSafeInteger(bitrate) || bitrate < 0) return msg.channel.send('Invalid bitrate');
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.SLOWMODE, channel))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (channel.type == 'voice') {
        try {
          await channel.setBitrate(bitrate);
          return msg.channel.send(`Channel <#${channel.id}> bitrate set to ${bitrate}`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be greater than or equal to ')) {
            return msg.channel.send(`Bitrate must be greater than or equal to ${estring.slice(89).replace(/[^0-9]+/g, '')}.`);
          } else if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be less than or equal to ')) {
            return msg.channel.send(`Bitrate must be less than or equal to ${estring.slice(86).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return msg.channel.send('Error.');
          }
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> not a voice channel`);
      }
    }
  },
  {
    name: 'purge',
    full_string: false,
    description: '`!purge [#channel] <amount>` to delete `amount` messages from the channel',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      let channel, msgs;

      if (/<#[0-9]+>/.test(args[0])) {
        channel = msg.guild.channels.cache.find(x => x.id == args[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot purge messages in channel outside of this guild.');
        msgs = args[1] == 'all' ? -1 : Number(args[1]);
      } else {
        msgs = args[0] == 'all' ? -1 : Number(args[0]);
      }

      if (!channel) channel = msg.channel;
      
      if (!Number.isSafeInteger(msgs)) return msg.channel.send('Invalid number of messages to delete');
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        return msg.channel.send('You do not have permission to run this command.');
      
      try {
        await channel.bulkDelete(msgs);
        return msg.channel.send(`${msgs} messages purged successfully.`);
      } catch (e) {
        return msg.channel.send('Error in purging messages');
      }
    }
  },
  {
    name: 'lock',
    full_string: false,
    description: '`!lock [#channel]` to lock the channel, preventing anyone other than moderators from talking in it',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let channel, reason = [];

      for (var i = 0; i < args.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(args[i])) {
          reason.push(args[i]);
        } else {
          channel = msg.guild.channels.cache.find(x => x.id == args[i].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot lock channel outside of this guild.');
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
        try {
          await common.partialDeserializePermissionOverwrites(channel, newperms);
          props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id] = perms;
          schedulePropsSave();
          return msg.channel.send(`Locked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return msg.channel.send(estring);
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> (id ${channel.id}) already locked or no permissions to change.`);
      }
    }
  },
  {
    name: 'unlock',
    full_string: false,
    description: '`!unlock [#channel]` to unlock the channel, resetting permissions to what they were before the lock',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }

      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');

      let channel, reason = [];

      for (var i = 0; i < args.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(args[i])) {
          reason.push(args[i]);
        } else {
          channel = msg.guild.channels.cache.find(x => x.id == args[i].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot unlock channel outside of this guild.');
        }
      }

      reason = reason.join(' ');
      if (!channel) channel = msg.channel;

      let perms = props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
      if (perms) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, perms);
          delete props.saved.guilds[msg.guild.id].temp.stashed.channeloverrides[channel.id];
          schedulePropsSave();
          return msg.channel.send(`Unlocked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return msg.channel.send(estring);
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> (id ${channel.id}) not locked.`);
      }
    }
  },
  {
    name: 'mute',
    full_string: false,
    description: '`!mute @person` to mute someone by adding the muted role to them',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }

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
        return msg.channel.send(`Muted ${member.user.tag}.`);
      } else {
        return msg.channel.send(`${member.user.tag} already muted.`);
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
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }

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
        return msg.channel.send(`Unmuted ${member.user.tag}.`);
      } else {
        return msg.channel.send(`${member.user.tag} not muted.`);
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
      var member_array = msg.guild.members.cache.array();
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
      
      if (msg.member.id != msg.guild.ownerID &&
        (member.id == msg.guild.ownerID || msg.member.roles.highest.position <= member.roles.highest.position))
        return msg.channel.send('You cannot kick someone equal or higher than you in the role hierarchy.');

      if (msg.guild.me.id != msg.guild.ownerID &&
        (member.id == msg.guild.ownerID || msg.guild.me.roles.highest.position <= member.roles.highest.position))
        return msg.channel.send('Error: I cannot kick someone equal or higher than me in the role hierarchy.');

      try {
        let text = `Are you sure you want to kick user ${member.user.tag} (id ${member.id})${kickreason ? ' with reason ' + util.inspect(kickreason) : ''}?`;
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Confirm Kick', description: text } };
        let kickconfirm = await msg.channel.send(text);
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
          let text = `Are you sure you want to ban unknown user${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`;
          if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Confirm Ban', description: text } };
          let banconfirm = await msg.channel.send(text);
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

        if (msg.member.id != msg.guild.ownerID &&
          (member.id == msg.guild.ownerID || msg.member.roles.highest.position <= member.roles.highest.position))
          return msg.channel.send('You cannot ban someone equal or higher than you in the role hierarchy.');

        if (msg.guild.me.id != msg.guild.ownerID &&
          (member.id == msg.guild.ownerID || msg.guild.me.roles.highest.position <= member.roles.highest.position))
          return msg.channel.send('Error: I cannot ban someone equal or higher than me in the role hierarchy.');

        try {
          let text = `Are you sure you want to ban user ${member.user.tag} (id ${member.id})${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`;
          if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Confirm Ban', description: text } };
          let banconfirm = await msg.channel.send(text);
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
        let text = `Are you sure you want to unban user ${baninfo.user.tag} (id ${baninfo.user.id})${unbanreason ? ' with reason ' + util.inspect(unbanreason) : ''}?`;
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Confirm Unban', description: text } };
        let unbanconfirm = await msg.channel.send(text);
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
    name: 'emoterole',
    full_string: false,
    description: '`!emoterole add <emote|id|name> [<@role|id|name>] ...` to add roles that can use the emoji\n`!emoterole remove <emote|id|name> [<@role|id|name>] ...` to remove roles that can use the emoji\n`!emoterole set <emote|id|name> [<@role|id|name>] ...` to set that can use the emoji',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!msg.member.hasPermission('MANAGE_EMOJIS'))
        return msg.channel.send('You do not have permission to run this command.');
      
      let emote;
      
      if (/<a?:[A-Za-z]+:[0-9]+>/.test(args[1])) {
        let end = args[1].slice(':')[2];
        emote = msg.guild.emojis.resolve(end.slice(0, -1));
      } else if (/[0-9]+/.test(args[1])) {
        emote = msg.guild.emojis.resolve(args[1]);
      } else {
        emote = msg.guild.emojis.cache.find(x => x.name == args[1]);
      }
      
      let roles = args.slice(2).map(x => common.searchRole(msg.guild.roles, x));
      
      switch (args[0]) {
        case 'add':
          emote.roles.add(roles);
          return msg.channel.send({ embed: { title: 'Roles Added', description: `Roles ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'} added to <:${emote.name}:${emote.id}> emote` } });
          break;
        case 'remove':
          emote.roles.remove(roles);
          return msg.channel.send({ embed: { title: 'Roles Removed', description: `Roles ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'} removed from <:${emote.name}:${emote.id}> emote` } });
          break;
        case 'set':
          emote.roles.set(roles);
          return msg.channel.send({ embed: { title: 'Roles Set', description: `<:${emote.name}:${emote.id}> emote roles set to ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'}` } });
          break;
      }
    }
  }
];
