module.exports = [
  {
    name: 'suppressembeds',
    description: '`!suppressembeds <messageid> <\'suppress\'/\'unsuppress\'> [#channel]` suppresses or unsuppresses embeds on a message',
    description_slash: 'suppresses or unsuppresses embeds on a message',
    flags: 0b110110,
    options: [
      {
        type: 3, name: 'value', description: 'to suppress or unsuppress embeds', required: true,
        choices: [ { name: 'suppress', value: 'suppress' }, { name: 'unsuppress', value: 'unsuppress' } ],
      },
      { type: 3, name: 'messageid', description: 'id of message or message link', required: true },
      { type: 7, name: 'channel', description: 'channel the message is in' },
    ],
    async execute(o, msg, rawArgs) {
      let suppress, match, channel, targetMsg;
      
      switch (rawArgs[0]) {
        case 'suppress': suppress = true; break;
        case 'unsuppress': suppress = false; break;
        default: return msg.channel.send('Options are \'suppress\' and \'unsuppress\'').then(x => setTimeout(() => x.delete(), 5000));
      }
      
      if (match = /^([0-9]+)$/.exec(rawArgs[1])) {
        targetMsg = match[1];
        if (match = /<#([0-9]+)>/.exec(rawArgs[2])) channel = match[1];
      } else if (match = /^https:\/\/(?:canary.)?discord(?:app)?.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)$/.exec(rawArgs[1])) {
        channel = match[1];
        targetMsg = match[2];
      }
      
      channel = channel ? msg.guild.channels.cache.get(channel) : msg.channel;
      if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
        return msg.channel.send('Cannot suppress embeds on message in channel outside of this guild.').then(x => setTimeout(() => x.delete(), 5000));
      
      try {
        targetMsg = await channel.messages.fetch(targetMsg);
      } catch (e) {
        return msg.channel.send('Error in fetching message').then(x => setTimeout(() => x.delete(), 5000));
      }
      
      if (msg.author.id == targetMsg.author.id || common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        targetMsg.suppressEmbeds(suppress);
      else
        return msg.channel.send('You do not have permission to suppress other member\'s embeds.').then(x => setTimeout(() => x.delete(), 5000));
      
      return msg.channel.send(`Embeds in message https://discord.com/channels/${msg.guild.id}/${channel.id}/${targetMsg.id} in ${suppress ? 'suppressed' : 'unsuppressed'}.`);
    },
    async execute_slash(o, interaction, command, args) {
      let match, suppress, channel, targetMsg;
      
      switch (args[0].value) {
        case 'suppress': suppress = true; break;
        case 'unsuppress': suppress = false; break;
      }
      
      if (match = /^([0-9]+)$/.exec(args[1].value)) {
        targetMsg = match[1];
        if (args[2]) channel = args[2].value;
      } else if (match = /^https:\/\/(?:canary.)?discord(?:app)?.com\/channels\/[0-9]+\/([0-9]+)\/([0-9]+)$/.exec(args[1].value)) {
        channel = match[1];
        targetMsg = match[2];console.log(targetMsg);
      }
      
      channel = channel ? o.guild.channels.cache.get(channel) : o.channel;
      if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
        return common.slashCmdResp(interaction, true, 'Cannot suppress embeds on message in channel outside of this guild.');
      
      try {
        targetMsg = await channel.messages.fetch(targetMsg);
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'Error in fetching message');
      }
      
      if (o.author.id == targetMsg.author.id || common.hasBotPermissions(o, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        targetMsg.suppressEmbeds(suppress);
      else
        return common.slashCmdResp(interaction, true, 'You do not have permission to suppress other member\'s embeds.');
      
      return common.slashCmdResp(interaction, false, `Embeds in message https://discord.com/channels/${o.guild.id}/${channel.id}/${targetMsg.id} in ${suppress ? 'suppressed' : 'unsuppressed'}.`);
    },
  },
  {
    name: 'slowmode',
    description: '`!slowmode <seconds> [#channel]` sets the slowmode in a text channel',
    description_slash: 'sets slowmode in a text channel',
    flags: 0b110110,
    options: [
      { type: 4, name: 'slowmode', description: 'slowmode in seconds', required: true },
      { type: 7, name: 'channel', description: 'the channel' },
    ],
    async execute(o, msg, rawArgs) {
      let seconds, channel;
      
      seconds = Math.floor(Number(rawArgs[0]));
      if (!Number.isSafeInteger(seconds) || seconds < 0) return msg.channel.send('Invalid seconds for slowmode.');
      
      if (/<#[0-9]+>/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
          return msg.channel.send('Cannot set slowmode in channel outside of this guild.');
      }
      if (!channel) channel = msg.channel;
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.SLOWMODE, channel))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (channel.type == 'text' || channel.type == 'news') {
        try {
          await channel.setRateLimitPerUser(seconds);
          return msg.channel.send(`Slowmode in channel <#${channel.id}> set to ${seconds} seconds.`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nrate_limit_per_user: int value should be less than or equal to ')) {
            return msg.channel.send(`Slowmode must be less than or equal to ${estring.slice(98).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return msg.channel.send(`Error for setting slowmode in channel <#${channel.id}>.`);
          }
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> not a text channel.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      let seconds, channel;
      
      seconds = Math.floor(args[0].value);
      if (!Number.isSafeInteger(seconds) || seconds < 0) return common.slashCmdResp(interaction, true, 'Invalid seconds for slowmode.');
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
          return common.slashCmdResp(interaction, true, 'Cannot set slowmode in channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (channel.type == 'text' || channel.type == 'news') {
        try {
          await channel.setRateLimitPerUser(seconds);
          return common.slashCmdResp(interaction, false, `Slowmode in channel <#${channel.id}> set to ${seconds} seconds.`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nrate_limit_per_user: int value should be less than or equal to ')) {
            return common.slashCmdResp(interaction, true, `Slowmode must be less than or equal to ${estring.slice(98).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.slashCmdResp(interaction, true, `Error for setting slowmode in channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.slashCmdResp(interaction, true, `Channel <#${channel.id}> not a text channel.`);
      }
    },
  },
  {
    name: 'bitrate',
    description: '`!bitrate <bytespersec> #channel` sets the bitrate (bps not kbps) of a voice channel',
    description_slash: 'sets the bitrate of a voice channel',
    flags: 0b110110,
    options: [
      { type: 4, name: 'bitrate', description: 'bitrate in bytes per second', required: true },
      { type: 7, name: 'channel', description: 'the voice channel', required: true },
    ],
    async execute(o, msg, rawArgs) {
      let bitrate, channel;
      
      bitrate = Math.floor(Number(rawArgs[0]));
      if (!Number.isSafeInteger(bitrate) || bitrate < 0) return msg.channel.send('Invalid bitrate');
      
      if (/<#[0-9]+>/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot set bitrate of channel outside of this guild.');
      }
      
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
            return msg.channel.send(`Error in setting bitrate of channel <#${channel.id}>.`);
          }
        }
      } else {
        return msg.channel.send(`Channel <#${channel.id}> not a voice channel`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      let bitrate, channel;
      
      bitrate = Math.floor(args[0].value);
      if (!Number.isSafeInteger(bitrate) || bitrate < 0) return common.slashCmdResp(interaction, true, 'Invalid bitrate');
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, true, 'Cannot set bitrate of channel outside of this guild.');
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.SLOWMODE, channel))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (channel.type == 'voice') {
        try {
          await channel.setBitrate(bitrate);
          return common.slashCmdResp(interaction, false, `Channel <#${channel.id}> bitrate set to ${bitrate}`);
        } catch (e) {
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be greater than or equal to ')) {
            return common.slashCmdResp(interaction, true, `Bitrate must be greater than or equal to ${estring.slice(89).replace(/[^0-9]+/g, '')}.`);
          } else if (estring.startsWith('DiscordAPIError: Invalid Form Body\nbitrate: int value should be less than or equal to ')) {
            return common.slashCmdResp(interaction, true, `Bitrate must be less than or equal to ${estring.slice(86).replace(/[^0-9]+/g, '')}.`);
          } else {
            console.error(e);
            return common.slashCmdResp(interaction, true, `Error in setting bitrate of channel <#${channel.id}>.`);
          }
        }
      } else {
        return common.slashCmdResp(interaction, true, `Channel <#${channel.id}> not a voice channel`);
      }
    },
  },
  {
    name: 'purge',
    description: '`!purge <amount> [#channel]` deletes `amount` messages from a channel',
    description_slash: 'deletes messages from a channel',
    flags: 0b111110,
    options: [
      { type: 4, name: 'amount', description: 'amount of messages to purge', required: true },
      { type: 7, name: 'channel', description: 'the channel' },
    ],
    async execute(o, msg, rawArgs) {
      let msgs, channel;
      
      msgs = rawArgs[0] == 'all' ? -1 : Number(rawArgs[0]);
      if (!Number.isSafeInteger(msgs)) return msg.channel.send('Invalid number of messages to delete');
      
      if (/<#[0-9]+>/.test(rawArgs[1])) {
        channel = msg.guild.channels.cache.get(rawArgs[1].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) return msg.channel.send('Cannot purge messages in channel outside of this guild.');
      }
      if (!channel) channel = msg.channel;
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        return msg.channel.send('You do not have permission to run this command.');
      
      try {
        await channel.bulkDelete(msgs);
        return msg.channel.send(`${msgs} messages purged successfully.`);
      } catch (e) {
        return msg.channel.send('Error in purging messages');
      }
    },
    async execute_slash(o, interaction, command, args) {
      let msgs = args[0].value, channel;
      
      if (args[1]) {
        channel = o.guild.channels.cache.get(args[1].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) return common.slashCmdResp(interaction, true, 'Cannot purge messages in channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.DELETE_MESSAGES, channel))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      try {
        await channel.bulkDelete(msgs);
        return common.slashCmdResp(interaction, false, `${msgs} messages purged successfully.`);
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'Error in purging messages');
      }
    },
  },
  {
    name: 'lock',
    description: '`!lock [#channel] [reason]` locks a channel, preventing anyone other than moderators from sending messages in it',
    description_slash: 'locks a channel, preventing anyone other than moderators from sending messages in it',
    flags: 0b110110,
    options: [
      { type: 7, name: 'channel', description: 'the channel' },
      { type: 3, name: 'reason', description: 'the reason to lock' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');
      
      let channel, reason = [];
      
      for (var i = 0; i < rawArgs.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(rawArgs[0])) {
          reason.push(rawArgs[i]);
        } else {
          channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
            return msg.channel.send('Cannot lock channel outside of this guild.');
        }
      }
      
      reason = reason.join(' ');
      if (!channel) channel = msg.channel;
      
      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      if (!newperms.filter(x => x.id == msg.guild.id)) {
        newperms.push({
          id: msg.guild.id,
          type: 'role',
          allow: 0,
          deny: 0,
        });
      }
      let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[channel.type];
      let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * !!(type & 1) | Discord.Permissions.FLAGS['CONNECT'] * !!(type & 2);
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
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      let channel, reason = args[1] && args[1].value;
      
      if (args[0]) {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
          return common.slashCmdResp(interaction, true, 'Cannot lock channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      let perms = common.serializePermissionOverwrites(channel);
      let newperms = perms.map(x => Object.assign({}, x));
      if (!newperms.filter(x => x.id == o.guild.id)) {
        newperms.push({
          id: o.guild.id,
          type: 'role',
          allow: 0,
          deny: 0,
        });
      }
      let type = { dm: 0, text: 1, voice: 2, category: 3, news: 1, store: 1, unknown: 0 }[channel.type];
      let bits = Discord.Permissions.FLAGS['SEND_MESSAGES'] * !!(type & 1) | Discord.Permissions.FLAGS['CONNECT'] * !!(type & 2);
      newperms.forEach(x => {
        if (!Object.keys(props.saved.guilds[o.guild.id].perms).filter(y => y == x.id && props.saved.guilds[o.guild.id].perms[y] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK)).length) {
          x.allow &= ~bits;
          x.deny |= bits;
        }
      });
      let newpermids = newperms.map(x => x.id);
      Object.keys(props.saved.guilds[o.guild.id].perms).forEach(x => {
        if (props.saved.guilds[o.guild.id].perms[x] & (common.constants.botRolePermBits.LOCK_CHANNEL | common.constants.botRolePermBits.BYPASS_LOCK) && !newpermids.includes(x))
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
          props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id] = perms;
          schedulePropsSave();
          return common.slashCmdResp(interaction, false, `Locked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.slashCmdResp(interaction, true, estring);
        }
      } else {
        return common.slashCmdResp(interaction, false, `Channel <#${channel.id}> (id ${channel.id}) already locked or no permissions to change.`);
      }
    },
  },
  {
    name: 'unlock',
    description: '`!unlock [#channel] [reason]` unlocks a channel, resetting permissions to what they were before the lock',
    description_slash: 'unlocks a channel, resetting permissions to what they were before the lock',
    flags: 0b110110,
    options: [
      { type: 7, name: 'channel', description: 'the channel' },
      { type: 3, name: 'reason', description: 'the reason to unlock' },
    ],
    async execute(o, msg, rawArgs) {
      if (!props.saved.guilds[msg.guild.id]) {
        props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(msg.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.LOCK_CHANNEL))
        return msg.channel.send('You do not have permission to run this command.');
      
      let channel, reason = [];
      
      for (var i = 0; i < rawArgs.length; i++) {
        if (i > 0 || !/<#[0-9]+>/.test(rawArgs[0])) {
          reason.push(rawArgs[i]);
        } else {
          channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
          if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL'))
            return msg.channel.send('Cannot unlock channel outside of this guild.');
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
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.LOCK_CHANNEL))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      let channel, reason = args[1] && args[1].value;
      
      if (args[0]) {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL'))
          return common.slashCmdResp(interaction, true, 'Cannot unlock channel outside of this guild.');
      }
      if (!channel) channel = o.channel;
      
      let perms = props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id];
      if (perms) {
        try {
          await common.partialDeserializePermissionOverwrites(channel, perms);
          delete props.saved.guilds[o.guild.id].temp.stashed.channeloverrides[channel.id];
          schedulePropsSave();
          return common.slashCmdResp(interaction, false, `Unlocked channel <#${channel.id}> (id ${channel.id}).`);
        } catch (e) {
          console.error(e);
          let estring = e.toString();
          if (estring.startsWith('DiscordAPIError'))
            return common.slashCmdResp(interaction, true, estring);
        }
      } else {
        return common.slashCmdResp(interaction, false, `Channel <#${channel.id}> (id ${channel.id}) not locked.`);
      }
    },
  },
  {
    name: 'mute',
    description: '`!mute @person [reason]` mutes someone by adding the muted role to them',
    description_slash: 'mutes someone by adding the muted role to them',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'the member to mute', required: true },
      { type: 3, name: 'reason', description: 'the reason to mute' },
    ],
    async execute(o, msg, rawArgs) {
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
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        return msg.channel.send('Could not find member.');
      }
      
      let mutereason = rawArgs.slice(1).join(' ');
      
      if (!member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.add(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${mutereason ? ' ' + mutereason : ''}`);
        return msg.channel.send(`Muted ${member.user.tag}.`);
      } else {
        return msg.channel.send(`${member.user.tag} already muted.`);
      }
      return promise;
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.MUTE))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[o.guild.id].mutedrole)
        return common.slashCmdResp(interaction, true, 'Error: no guild muted role specified, set one with `!settings mutedrole set <@role|id|name|query>`');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(interaction, true, 'Could not find member.');
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'Could not find member.');
      }
      
      let mutereason = args[1] && args[1].value;
      
      if (!member.roles.cache.get(props.saved.guilds[o.guild.id].mutedrole)) {
        await member.roles.add(props.saved.guilds[o.guild.id].mutedrole, `[By ${o.author.tag} (id ${o.author.id})]${mutereason ? ' ' + mutereason : ''}`);
        return common.slashCmdResp(interaction, false, `Muted ${member.user.tag}.`);
      } else {
        return common.slashCmdResp(interaction, false, `${member.user.tag} already muted.`);
      }
      return promise;
    },
  },
  {
    name: 'unmute',
    description: '`!unmute @person` unmutes someone by removing the muted role from them',
    description_slash: 'unmutes someone by removing the muted role from them',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'the member to unmute', required: true },
      { type: 3, name: 'reason', description: 'the reason to unmute' },
    ],
    async execute(o, msg, rawArgs) {
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
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        return msg.channel.send('Could not find member.');
      }
      
      let unmutereason = rawArgs.slice(1).join(' ');
      
      if (member.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole)) {
        await member.roles.remove(props.saved.guilds[msg.guild.id].mutedrole, `[By ${msg.author.tag} (id ${msg.author.id})]${unmutereason ? ' ' + unmutereason : ''}`);
        return msg.channel.send(`Unmuted ${member.user.tag}.`);
      } else {
        return msg.channel.send(`${member.user.tag} not muted.`);
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!props.saved.guilds[o.guild.id]) {
        props.saved.guilds[o.guild.id] = common.getEmptyGuildObject(o.guild.id);
        schedulePropsSave();
      }
      
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.MUTE))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (!props.saved.guilds[o.guild.id].mutedrole)
        return common.slashCmdResp(interaction, true, 'Error: no guild muted role specified, set one with `!settings mutedrole <@role|id|name|query>`');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(interaction, true, 'Could not find member.');
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'Could not find member.');
      }
      
      let unmutereason = args[1] && args[1].value;
      
      if (member.roles.cache.get(props.saved.guilds[o.guild.id].mutedrole)) {
        await member.roles.remove(props.saved.guilds[o.guild.id].mutedrole, `[By ${o.author.tag} (id ${o.author.id})]${unmutereason ? ' ' + unmutereason : ''}`);
        return common.slashCmdResp(interaction, false, `Unmuted ${member.user.tag}.`);
      } else {
        return common.slashCmdResp(interaction, false, `${member.user.tag} not muted.`);
      }
    },
  },
  {
    name: 'kick',
    description: '`!kick @person [reason]` kicks someone from this guild',
    description_slash: 'kicks someone from this guild',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'the member to kick', required: true },
      { type: 3, name: 'reason', description: 'optional kick reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.KICK))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (!msg.guild.me.hasPermission('KICK_MEMBERS'))
        return msg.channel.send('Error: I do not have permission to kick members.');
      
      let member;
      try {
        member = await common.searchMember(msg.guild.members, rawArgs[0]);
        if (!member) return msg.channel.send('Could not find member.');
      } catch (e) {
        console.error(e);
        return msg.channel.send('Could not find member.');
      }
      
      if (msg.member.id != msg.guild.ownerID &&
        (member.id == msg.guild.ownerID || msg.member.roles.highest.position <= member.roles.highest.position))
        return msg.channel.send('You cannot kick someone equal or higher than you in the role hierarchy.');
      
      if (msg.guild.me.id != msg.guild.ownerID &&
        (member.id == msg.guild.ownerID || msg.guild.me.roles.highest.position <= member.roles.highest.position))
        return msg.channel.send('Error: I cannot kick someone equal or higher than me in the role hierarchy.');
      
      let kickreason = rawArgs.slice(1).join(' ');
      
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let kickconfirm = await msg.channel.send(`Are you sure you want to kick user ${member.user.tag} (id ${member.id})${kickreason ? ' with reason ' + util.inspect(kickreason) : ''}?`, { allowedMentions: { parse: [] } });
          let kickreacts = kickconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
          await kickconfirm.react('✅'); await kickconfirm.react('❌');
          kickreacts = await kickreacts;
          if (kickreacts.keyArray().length == 0 || kickreacts.keyArray()[0] == '❌')
            return kickconfirm.edit(kickconfirm.content + '\nKick cancelled.');
          
          await member.kick(`[By ${msg.author.tag} (id ${msg.author.id})]${kickreason ? ' ' + kickreason : ''}`);
          return kickconfirm.edit(kickconfirm.content + `\n${member.user.tag} (id ${member.id}) has been successfully kicked`);
        } else {
          await member.kick(`[By ${msg.author.tag} (id ${msg.author.id})]${kickreason ? ' ' + kickreason : ''}`);
          return msg.channel.send(`${member.user.tag} (id ${member.id}) has been successfully kicked`);
        }
      } catch (e) {
        console.error(e);
        return msg.channel.send('Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.KICK))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (!o.guild.me.hasPermission('KICK_MEMBERS'))
        return common.slashCmdResp(interaction, true, 'Error: I do not have permission to kick members.');
      
      let member;
      try {
        member = await o.guild.members.fetch(args[0].value);
        if (!member) return common.slashCmdResp(interaction, true, 'Could not find member.');
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(interaction, true, 'Could not find member.');
      }
      
      if (o.member.id != o.guild.ownerID &&
        (member.id == o.guild.ownerID || o.member.roles.highest.position <= member.roles.highest.position))
        return common.slashCmdResp(interaction, true, 'You cannot kick someone equal or higher than you in the role hierarchy.');
      
      if (o.guild.me.id != o.guild.ownerID &&
        (member.id == o.guild.ownerID || o.guild.me.roles.highest.position <= member.roles.highest.position))
        return common.slashCmdResp(interaction, true, 'Error: I cannot kick someone equal or higher than me in the role hierarchy.');
      
      let kickreason = args[1] && args[1].value;
      
      try {
        await member.kick(`[By ${o.author.tag} (id ${o.author.id})]${kickreason ? ' ' + kickreason : ''}`);
        return common.slashCmdResp(interaction, false, `${member.user.tag} (id ${member.id}) has been successfully kicked`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(interaction, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'ban',
    description: '`!ban @person [reason]` bans someone from this guild',
    description_slash: 'bans someone from this guild',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'the member to ban', required: true },
      { type: 3, name: 'reason', description: 'optional ban reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (!msg.guild.me.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('Error: I do not have permission to ban members.');
      
      let user = await common.searchMember(msg.guild.members, rawArgs[0]);
      if (!user) {
        user = await common.searchUser(rawArgs[0]);
        if (!user) return msg.channel.send('Could not find member.');
      }
      
      let banreason = rawArgs.slice(1).join(' ');
      
      if (user instanceof Discord.GuildMember) {
        if (msg.member.id != msg.guild.ownerID &&
          (user.id == msg.guild.ownerID || msg.member.roles.highest.position <= user.roles.highest.position))
          return msg.channel.send('You cannot ban someone equal or higher than you in the role hierarchy.');
        
        if (msg.guild.me.id != msg.guild.ownerID &&
          (user.id == msg.guild.ownerID || msg.guild.me.roles.highest.position <= user.roles.highest.position))
          return msg.channel.send('Error: I cannot ban someone equal or higher than me in the role hierarchy.');
        
        user = user.user;
      }
        
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let banconfirm = await msg.channel.send(`Are you sure you want to ban user ${user.tag} (id ${user.id})${banreason ? ' with reason ' + util.inspect(banreason) : ''}?`, { allowedMentions: { parse: [] } });
          let banreacts = banconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
          await banconfirm.react('✅'); await banconfirm.react('❌');
          banreacts = await banreacts;
          if (banreacts.keyArray().length == 0 || banreacts.keyArray()[0] == '❌')
            return banconfirm.edit(banconfirm.content + '\nBan cancelled.');
          
          await msg.guild.members.ban(user, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return banconfirm.edit(banconfirm.content + `\n${user.tag} (id ${user.id}) has been successfully banned`);
        } else {
          await msg.guild.members.ban(user, { reason: `[By ${msg.author.tag} (id ${msg.author.id})]${banreason ? ' ' + banreason : ''}` });
          return msg.channel.send(`${user.tag} (id ${user.id}) has been successfully banned`);
        }
      } catch (e) {
        console.error(e);
        return msg.channel.send('Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.BAN))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (!o.guild.me.hasPermission('BAN_MEMBERS'))
        return common.slashCmdResp(interaction, true, 'Error: I do not have permission to ban members.');
      
      let user = await o.guild.members.fetch(args[0].value);
      if (!user) {
        user = await client.users.fetch(args[0].value);
        if (!user) return common.slashCmdResp(interaction, true, 'Could not find member.');
      }
      
      let banreason = args[1] && args[1].value;
      
      if (user instanceof Discord.GuildMember) {
        if (o.member.id != o.guild.ownerID &&
          (user.id == o.guild.ownerID || o.member.roles.highest.position <= user.roles.highest.position))
          return common.slashCmdResp(interaction, true, 'You cannot ban someone equal or higher than you in the role hierarchy.');
        
        if (o.guild.me.id != o.guild.ownerID &&
          (user.id == o.guild.ownerID || o.guild.me.roles.highest.position <= user.roles.highest.position))
          return common.slashCmdResp(interaction, true, 'Error: I cannot ban someone equal or higher than me in the role hierarchy.');
        
        user = user.user;
      }
      
      try {
        await o.guild.members.ban(user, { reason: `[By ${o.author.tag} (id ${o.author.id})]${banreason ? ' ' + banreason : ''}` });
        return common.slashCmdResp(interaction, false, `${user.tag} (id ${user.id}) has been successfully banned`);
      } catch (e) {
        console.error(e);
        return common.slashCmdResp(interaction, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'unban',
    description: '`!unban userid [reason]` unbans someone from this guild',
    description_slash: 'unbans someone from this guild',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'the member to unban', required: true },
      { type: 3, name: 'reason', description: 'optional unban reason' },
    ],
    async execute(o, msg, rawArgs) {
      if (!common.hasBotPermissions(msg, common.constants.botRolePermBits.BAN))
        return msg.channel.send('You do not have permission to run this command.');
      
      if (!msg.guild.me.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('Error: I do not have permission to unban members.');
      
      let userid;
      if (rawArgs[0]) {
        if (/<@!?[0-9]+>|[0-9]+/.test(rawArgs[0]))
          userid = rawArgs[0].replace(/[<@!>]/g, '');
      }
      if (!userid) return msg.channel.send('Could not find user.');
      
      let baninfo;
      try {
        baninfo = await msg.guild.fetchBan(userid);
        if (!baninfo) return msg.channel.send('User not banned or nonexistent.');
      } catch (e) {
        return msg.channel.send('User not banned or nonexistent.');
      }
      
      let unbanreason = rawArgs.slice(1).join(' ');
      
      try {
        let guilddata = props.saved.guilds[msg.guild.id];
        if (guilddata && (guilddata.confirm_kb || guilddata.confirm_kb == null) || !guilddata) {
          let unbanconfirm = await msg.channel.send(`Are you sure you want to unban user ${baninfo.user.tag} (id ${baninfo.user.id})${unbanreason ? ' with reason ' + util.inspect(unbanreason) : ''}?`, { allowedMentions: { parse: [] } });
          let unbanreacts = unbanconfirm.awaitReactions((react, user) => (react.emoji.name == '✅' || react.emoji.name == '❌') && user.id == msg.author.id, { time: 60000, max: 1 });
          await unbanconfirm.react('✅');
          await unbanconfirm.react('❌');
          unbanreacts = await unbanreacts;
          if (unbanreacts.keyArray().length == 0 || unbanreacts.keyArray()[0] == '❌')
            return unbanconfirm.edit(unbanconfirm.content + '\nUnban cancelled.');
          
          await msg.guild.members.unban(userid, `[By ${msg.author.tag} (id ${msg.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
          return unbanconfirm.edit(unbanconfirm.content + `\n${baninfo.user.tag} (id ${baninfo.user.id}) has been successfully unbanned`);
        } else {
          await msg.guild.members.unban(userid, `[By ${msg.author.tag} (id ${msg.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
          return msg.channel.send(`${baninfo.user.tag} (id ${baninfo.user.id}) has been successfully unbanned`);
        }
      } catch (e) {
        return msg.channel.send('Error: something went wrong.');
      }
    },
    async execute_slash(o, interaction, command, args) {
      if (!common.hasBotPermissions(o, common.constants.botRolePermBits.BAN))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      if (!o.guild.me.hasPermission('BAN_MEMBERS'))
        return common.slashCmdResp(interaction, true, 'Error: I do not have permission to unban members.');
      
      let userid = args[0] && args[0].value;
      
      let baninfo;
      try {
        baninfo = await o.guild.fetchBan(userid);
        if (!baninfo) return common.slashCmdResp(interaction, true, 'User not banned or nonexistent.');
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'User not banned or nonexistent.');
      }
      
      let unbanreason = args[1] && args[1].value;
      
      try {
        await o.guild.members.unban(userid, `[By ${o.author.tag} (id ${o.author.id})]${unbanreason ? ' ' + unbanreason : ''}`);
        return common.slashCmdResp(interaction, false, `${baninfo.user.tag} (id ${baninfo.user.id}) has been successfully unbanned`);
      } catch (e) {
        return common.slashCmdResp(interaction, true, 'Error: something went wrong.');
      }
    },
  },
  {
    name: 'emoterole',
    description: 'configures which roles can use which emoji\n' +
      '`!emoterole add <emote|id|name> [<@role|id|name>] ...` adds roles that can use an emoji\n' +
      '`!emoterole remove <emote|id|name> [<@role|id|name>] ...` removes roles that can use an emoji\n' +
      '`!emoterole set <emote|id|name> [<@role|id|name>] ...` sets roles that can use an emoji',
    description_slash: 'configures which roles can use which emoji',
    flags: 0b110110,
    options: [
      {
        type: 1, name: 'add', description: 'adds roles which can use the emoji',
        options: [
          { type: 3, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: 3, name: 'roles', description: 'roles to add' },
        ],
      },
      {
        type: 1, name: 'remove', description: 'removes roles which can use the emoji',
        options: [
          { type: 3, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: 3, name: 'roles', description: 'roles to remove' },
        ],
      },
      {
        type: 1, name: 'set', description: 'sets roles which can use the emoji',
        options: [
          { type: 3, name: 'emote', description: 'emote, id, or search query', required: true },
          { type: 3, name: 'roles', description: 'roles to set' },
        ],
      },
    ],
    execute(o, msg, rawArgs) {
      if (!msg.member.hasPermission('MANAGE_EMOJIS'))
        return msg.channel.send('You do not have permission to run this command.');
      
      let emote;
      if (/^<a?:[A-Za-z]+:[0-9]+>$/.test(rawArgs[1])) {
        let end = rawArgs[1].split(':')[2];
        emote = msg.guild.emojis.resolve(end.slice(0, -1));
      } else if (/^[0-9]+$/.test(rawArgs[1])) {
        emote = msg.guild.emojis.resolve(rawArgs[1]);
      } else {
        emote = msg.guild.emojis.cache.find(x => x.name == rawArgs[1]);
      }
      if (emote == null) return msg.channel.send('Error: couldn\'t fetch emote.');
      
      let roles = rawArgs.slice(2).map(x => common.searchRole(msg.guild.roles, x)).filter(x => x);
      
      switch (rawArgs[0]) {
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
    },
    execute_slash(o, interaction, command, args) {
      if (!o.member.hasPermission('MANAGE_EMOJIS'))
        return common.slashCmdResp(interaction, true, 'You do not have permission to run this command.');
      
      let emote;
      if (/^<a?:[A-Za-z]+:[0-9]+$>/.test(args[0].options[0].value)) {
        let end = args[0].options[0].value.split(':')[2];
        emote = o.guild.emojis.resolve(end.slice(0, -1));
      } else if (/^[0-9]+$/.test(args[0].options[0].value)) {
        emote = o.guild.emojis.resolve(args[0].options[0].value);
      } else {
        emote = o.guild.emojis.cache.find(x => x.name == args[0].options[0].value);
      }
      if (emote == null) return common.slashCmdResp(interaction, true, 'Error: couldn\'t fetch emote.');
      
      let roles = args[0].options[1] ? args[0].options[1].value.split(' ').map(x => common.searchRole(o.guild.roles, x)).filter(x => x) : [];
      
      switch (args[0].name) {
        case 'add':
          emote.roles.add(roles);
          return common.slashCmdResp(interaction, false, `Roles ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'} added to <:${emote.name}:${emote.id}> emote`);
          break;
        case 'remove':
          emote.roles.remove(roles);
          return common.slashCmdResp(interaction, false, `Roles ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'} removed from <:${emote.name}:${emote.id}> emote`);
          break;
        case 'set':
          emote.roles.set(roles);
          return common.slashCmdResp(interaction, false, `<:${emote.name}:${emote.id}> emote roles set to ${roles.length ? roles.map(x => `<@&${x.id}>`).join(' ') : 'nothing'}`);
          break;
      }
    },
  },
];
