module.exports = [
  {
    name: 'version',
    full_string: false,
    description: '`!version` prints the version of my code',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      return msg.channel.send(`Thebotcat is version ${version}`);
    }
  },
  {
    name: 'ping',
    full_string: false,
    description: '`!ping` checks my ping to the web and discord',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      return new Promise((resolve, reject) => {
        msg.channel.send('Checking Ping').then(m => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = m.createdTimestamp - msg.createdTimestamp;
          
            resolve(m.edit(`*Bot Ping:* **${botPing}**ms\n*API Ping:* **${apiPing}**ms`));
          });
        });
      });
    }
  },
  {
    name: 'uptime',
    full_string: false,
    description: '`!uptime` to see thebotcat\'s uptime',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatUptimeMessage());
    }
  },
  {
    name: 'status',
    full_string: false,
    description: '`!status` to see thebotcat\'s status',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatStatusMessage());
    }
  },
  {
    name: 'help',
    full_string: false,
    description: '`!help` to list commands\n`!help <command>` to print help for command',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (args.length == 0) {
        let [ commandsList, commandsCategorized ] = getCommandsCategorized();
        return msg.channel.send({
          embed: {
            title: `Commands (${commandsList.length})`,
            description: 'Run `!help <command>` for help on a specific command.',
            fields: Object.keys(commandsCategorized).map(
              x => ({ name: `${x} (${commandsCategorized[x].length})`, value: commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None', inline: false })
            ),
          }
        });
      } else {
        let cmdobj = commands.filter(x => x.name == args[0])[0];
        if (cmdobj && cmdobj.public) {
          if (cmdobj.description)
            return msg.channel.send(cmdobj.description);
          else
            return msg.channel.send(`Command ${args[0]} has no description.`);
        } else {
          return msg.channel.send(`Command ${args[0]} does not exist.`);
        }
      }
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
        let channels = msg.guild.channels.cache.keyArray().map(x => msg.guild.channels.cache.get(x)), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].type == 'text' || channels[i].type == 'news') {
            message = await channels[i].send('ghostdot');
            await message.delete();
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        for (var i = 0; i < args.length; i++) {
          if (/<#[0-9]+>/g.test(args[i])) {
            channel = msg.guild.channels.cache.get(args[i].slice(2, args[0].length - 1));
            if (channel.type == 'text' || channel.type == 'news') {
              message = await channel.send('ghostdot');
              await message.delete();
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
        let channels = msg.guild.channels.cache.keyArray().map(x => msg.guild.channels.cache.get(x)), channel, message;
        for (var i = 0; i < channels.length; i++) {
          if (channels[i].type == 'text' || channels[i].type == 'news') {
            message = await channels[i].send('ghostdot');
            await message.delete();
            await new Promise(r => setTimeout(r), 400);
          }
        }
      } else {
        for (var i = 0; i < args.length; i++) {
          if (/<#[0-9]+>/g.test(args[i])) {
            channel = msg.guild.channels.cache.get(args[i].slice(2, args[0].length - 1));
            if (channel.type == 'text' || channel.type == 'news') {
              message = await channel.send('ghostdot');
              await message.delete();
              await new Promise(r => setTimeout(r), 400);
            }
          }
        }
      }
    }
  },
];
