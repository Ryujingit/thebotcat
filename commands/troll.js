module.exports = [
  {
    name: '@_everyone',
    description: '`!@_everyone members [hidden]` pings everyone ... the manual way\n`!@_everyone roles [hidden]` to ping all roles instead',
    flags: 4,
    execute(o, msg, rawArgs) {
      if (!common.isAdmin(msg)) return;
      if (rawArgs[1]) {
        if (rawArgs[0] == 'roles') {
          let promises = [ msg.channel.send('@ everyone').then(x => x.edit('@everyone')) ];
          let roles = msg.guild.roles.cache.array().map(x => `<@&${x.id}>`);
          for (var i = 0; i < roles.length; i += 90) {
            promises.push(msg.channel.send(roles.slice(i, i + 90).join('')).then(x => x.delete()));
          }
          return Promise.allSettled(promises);
        } else if (rawArgs[0] == 'members') {
          if (msg.guild.memberCount > 1000)
            return msg.channel.send('Error: too many members in guild to ping all members.');
          let promises = [ msg.channel.send('@ everyone').then(x => x.edit('@everyone')) ];
          let members = msg.guild.members.cache.array().filter(x => !x.user.bot).map(x => `<@${x.id}>`);
          for (var i = 0; i < members.length; i += 95) {
            promises.push(msg.channel.send(members.slice(i, i + 95).join('')).then(x => x.delete()));
          }
          return Promise.allSettled(promises);
        }
      } else {
        if (rawArgs[0] == 'roles') {
          let promises = [];
          let roles = msg.guild.roles.cache.array().map(x => `<@&${x.id}>`);
          for (var i = 0; i < roles.length; i += 90) {
            promises.push(msg.channel.send(roles.slice(i, i + 90).join('')));
          }
          return Promise.allSettled(promises);
        } else if (rawArgs[0] == 'members') {
          if (msg.guild.memberCount > 1000)
            return msg.channel.send('Error: too many members in guild to ping all members.');
          let promises = [];
          let members = msg.guild.members.cache.array().filter(x => !x.user.bot).map(x => `<@${x.id}>`);
          for (var i = 0; i < members.length; i += 95) {
            promises.push(msg.channel.send(members.slice(i, i + 95).join('')));
          }
          return Promise.allSettled(promises);
        }
      }
    }
  },
  {
    name: '@someone',
    description: '`!@someone` pings a random person on the server',
    flags: 6,
    execute(o, msg, rawArgs) {
      if (!(common.isAdmin(msg) || msg.guild.id == '717268211246301236')) return;
      let members = msg.guild.members.cache.array().filter(x => !x.user.bot);
      let random_member = members[Math.floor(Math.random() * members.length)];
      return msg.channel.send(`Random ping: <@!${random_member.user.id}>`);
    }
  },
  {
    name: 'ghostdot',
    description: '`!ghostdot` to send a message then delete it in this channel\n`!ghostdot #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot all` to send a message then immediately delete it in every channel in a guild',
    flags: 6,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return;
      if (rawArgs.length == 1 && rawArgs[0] == 'all') {
        console.debug(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = msg.guild.channels.cache.array(), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == 'text' || channels[i].type == 'news')) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        console.debug(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${rawArgs.join(' ')}`);
        for (var i = 0; i < rawArgs.length; i++) {
          if (/<#[0-9]+>/g.test(rawArgs[i])) {
            channel = msg.guild.channels.cache.get(rawArgs[i].slice(2, rawArgs[0].length - 1));
            if (channel && (channel.type == 'text' || channel.type == 'news')) {
              message = await channel.send('ghostdot');
              try { await message.delete(); } catch (e) { }
              await new Promise(r => setTimeout(r), 400);
            }
          }
        }
      }
    }
  },
  {
    name: 'ghostdot_delmsg',
    description: '`!ghostdot_delmsg` to send a message then delete it in this channel\n`!ghostdot_delmsg #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot_delmsg all` to send a message then immediately delete it in every channel in a guild',
    flags: 4,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return msg.delete();
      msg.delete();
      if (rawArgs.length == 1 && rawArgs[0] == 'all') {
        console.debug(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = msg.guild.channels.cache.array(), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == 'text' || channels[i].type == 'news')) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        console.debug(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${rawArgs.join(' ')}`);
        for (var i = 0; i < rawArgs.length; i++) {
          if (/<#[0-9]+>/g.test(rawArgs[i])) {
            channel = msg.guild.channels.cache.get(rawArgs[i].slice(2, rawArgs[0].length - 1));
            if (channel && (channel.type == 'text' || channel.type == 'news')) {
              message = await channel.send('ghostdot');
              try { await message.delete(); } catch (e) { }
              await new Promise(r => setTimeout(r), 400);
            }
          }
        }
      }
    }
  },
];
