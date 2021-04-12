module.exports = [
  {
    name: '@_everyone',
    description: '`!@_everyone members [hidden]` pings everyone ... the manual way\n`!@_everyone roles [hidden]` to ping all roles instead',
    flags: 0b010100,
    execute(o, msg, rawArgs) {
      if (!persGuildData.special_guilds_set.has(msg.guild.id)) return;
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
    },
  },
  {
    name: '@someone',
    description: '`!@someone` pings a random person on the server',
    flags: 0b010110,
    execute(o, msg, rawArgs) {
      if (!(common.isAdmin(msg) || msg.guild.id == '717268211246301236')) return;
      let members = msg.guild.members.cache.array().filter(x => !x.user.bot);
      let random_member = members[common.randInt(0, members.length)];
      return msg.channel.send(`Random ping: <@!${random_member.user.id}>`);
    },
  },
];
