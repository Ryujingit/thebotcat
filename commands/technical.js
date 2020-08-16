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
    name: 'help',
    full_string: false,
    description: '`!help` to display number of commands\n`!help list` to list commands\n`!help <command>` to print help for command',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (args.length == 0) {
        return msg.channel.send(`I have ${commands.filter(x => x.public).length} commands, run \`!help list\` to list them or \`!help <command>\` for help on a specific command.`);
      } else if (args[0] == 'list') {
        let commandsCategorized = getCommandsCategorized();
        return msg.channel.send({
          embed: {
            title: 'Commands',
            description: 'Run `!help <command>` for help on a specific command.',
            fields: Object.keys(commandsCategorized).map(
              x => ({ name: x, value: commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None', inline: false })
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
  }
];
