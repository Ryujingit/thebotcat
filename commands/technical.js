module.exports = [
  {
    name: 'version',
    full_string: false,
    description: '`!version` prints the version of my code',
    public: true,
    execute(msg, argstring, command, args) {
      msg.channel.send(`Thebotcat is version ${version}`);
    }
  },
  {
    name: 'ping',
    full_string: false,
    description: '`!ping` checks my ping to the web and discord',
    public: true,
    execute(msg, argstring, command, args) {
      msg.channel.send('Checking Ping').then(m => {
        let beforerequest = Date.now(), afterrequest;
        https.get('https://example.com', res => {
          afterrequest = Date.now();
          res.socket.destroy();
          
          var botPing = afterrequest - beforerequest;
          var apiPing = m.createdTimestamp - msg.createdTimestamp;
        
          m.edit(`*Bot Ping:* **${botPing}**ms\n*API Ping:* **${apiPing}**ms`);
        });
      });
    }
  },
  {
    name: 'help',
    full_string: false,
    description: '`!help` to display number of commands\n`!help list` to list commands\n`!help <command>` to print help for command',
    public: true,
    execute(msg, argstring, command, args) {
      if (args.length == 0) {
        msg.channel.send(`I have ${commands.filter(x => x.public).length} commands, run \`!help list\` to list them or \`!help <command>\` for help on a specific command.`);
      } else if (args[0] == 'list') {
        msg.channel.send(`Commands: ${commands.filter(x => x.public).map(x => `\`${x.name}\``).join(', ')}\nRun \`!help <command>\` for help on a specific command.`);
      } else {
        let cmdobj = commands.filter(x => x.name == args[0])[0];
        if (cmdobj && cmdobj.public) {
          if (cmdobj.description)
            msg.channel.send(cmdobj.description);
          else
            msg.channel.send(`Command ${args[0]} has no description.`);
        } else {
          msg.channel.send(`Command ${args[0]} does not exist.`);
        }
      }
    }
  }
];