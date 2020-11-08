module.exports = [
  {
    name: '@someone',
    full_string: false,
    description: '`!@someone` pings a random person on the server',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isAdmin(msg) || msg.guild.id == '717268211246301236')) return;
      var members = msg.guild.members.cache.keyArray().map(x => msg.guild.members.cache.get(x)).filter(x => !x.user.bot);
      var random_member = members[Math.floor(Math.random() * members.length)];
      return msg.channel.send(`Random ping: <@!${random_member.user.id}>`);
    }
  },
  {
    name: 'ghostdot',
    full_string: false,
    description: '`!ghostdot` to send a message then delete it in this channel\n`!ghostdot #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot all` to send a message then immediately delete it in every channel in a guild',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return;
      if (args.length == 1 && args[0] == 'all') {
        console.debug(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = msg.guild.channels.cache.keyArray().map(x => msg.guild.channels.cache.get(x)), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == 'text' || channels[i].type == 'news')) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        console.debug(`ghostdot from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${args.join(' ')}`);
        for (var i = 0; i < args.length; i++) {
          if (/<#[0-9]+>/g.test(args[i])) {
            channel = msg.guild.channels.cache.get(args[i].slice(2, args[0].length - 1));
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
    full_string: false,
    description: '`!ghostdot_delmsg` to send a message then delete it in this channel\n`!ghostdot_delmsg #channel1 [#channel2 ...]` to send a message and delete it in a certain channel or channels\n`!ghostdot_delmsg all` to send a message then immediately delete it in every channel in a guild',
    public: false,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(common.isDeveloper(msg) || common.isOwner(msg) || common.isAdmin(msg)))
        return msg.delete();
      msg.delete();
      if (args.length == 1 && args[0] == 'all') {
        console.debug(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: all`);
        let channels = msg.guild.channels.cache.keyArray().map(x => msg.guild.channels.cache.get(x)), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i] && (channels[i].type == 'text' || channels[i].type == 'news')) {
            message = await channels[i].send('ghostdot');
            try { await message.delete(); } catch (e) { }
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        console.debug(`ghostdot_delmsg from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${args.join(' ')}`);
        for (var i = 0; i < args.length; i++) {
          if (/<#[0-9]+>/g.test(args[i])) {
            channel = msg.guild.channels.cache.get(args[i].slice(2, args[0].length - 1));
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
