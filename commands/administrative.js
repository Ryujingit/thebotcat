module.exports = [
  {
    name: 'say',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id)) return;
      let text = argstring.slice(4);
      msg.delete();
      msg.channel.send(text);
    }
  },
  {
    name: 'sayy',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id)) return;
      let argr = argstring.split(' ');
      let channelid = argr[1].slice(2, argr[1].length - 1);
      let text = argr.slice(2).join(' ');
      client.channels.get(channelid).send(text);
    }
  },
  {
    name: 'mute',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id)) return;
      if (/<@[0-9]{1,}>/.test(args[0])) {
        let user = args[0].slice(2, args[0].length - 1);
        mutelist.push(user);
        msg.channel.send(`Muted ${args[0]}`);
      }
    }
  },
  {
    name: 'unmute',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id)) return;
      if (/<@[0-9]{1,}>/.test(args[0])) {
        for (var i = 0; i < mutelist.length; i++) {
          let user = args[0].slice(2, args[0].length - 1);
          if (mutelist[i] == user) {
            mutelist.splice(i, 1);
            msg.channel.send(`Unmuted ${args[0]}`);
            break;
          }
        }
      }
    }
  },
  {
    name: 'kick',
    full_string: false,
    execute(msg, argstring, command, args) {
      var user = msg.mentions.users.first();
      if (user == null) return;
      if (!msg.member.hasPermission('KICK_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025')
        return msg.channel.send('No permission!');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (member.hasPermission('KICK_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') {
        var perm_failed = new Discord.RichEmbed()
          .setTitle('Access denied!')
          .setDescription('This user is a mod!');
        return msg.channel.send(perm_failed);
      }
      if (!client.hasPermission('KICK_MEMBERS'))
        return msg.channel.send('I cannot kick members');
      member.kick();
      msg.delete();
      var kick = new Discord.RichEmbed()
        .setTitle("Goodbye!")
        .setDescription(`${member.displayName} has been successfully kicked`);
      msg.channel.send(kick);
    }
  },
  {
    name: 'ban',
    full_string: false,
    execute(msg, argstring, command, args) {
      var user = msg.mentions.users.first();
      if (user == null) return;
      if (!msg.member.hasPermission('BAN_MEMBERS') && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025')
        return msg.channel.send('No permission!');
      var member = msg.mentions.members.first();
      if (member == null) return;
      if (member.hasPermission("BAN_MEMBERS") && msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') {
        var perm_failed = new Discord.RichEmbed()
          .setTitle('Access denied!')
          .setDescription('This user is a mod!')
        return msg.channel.send(perm_failed);
      }
      if (!client.hasPermission('BAN_MEMBERS'))
        return msg.channel.send('I cannot ban members');
      member.ban();
      msg.delete();
      var ban = new Discord.RichEmbed()
        .setTitle("Goodbye!")
        .setDescription(`${member.displayName} has been stook with a ban hammer`);
      msg.channel.send(ban);
    }
  },
  {
    name: 'wipedevelopers',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id)) return;
      developers.length = 0;
    }
  },
  {
    name: 'eval',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring.slice(5), res;
      console.debug(`evaluating ${util.inspect(cmd)}`);
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        var richres = new Discord.RichEmbed()
          .setTitle('Eval Result')
          .setDescription(util.inspect(res));
        msg.channel.send(richres);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        var richres = new Discord.RichEmbed()
          .setTitle('Eval Error')
          .setDescription(e.stack);
        msg.channel.send(richres);
      }
    }
  },
  {
    name: 'evalv',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = argstring.slice(5), res;
      console.debug(`evaluating (output voided) ${util.inspect(cmd)}`);
      try {
        res = eval(cmd);
        console.debug(res);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
      }
    }
  },
  {
    name: 'crash',
    full_string: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025' && !developers.includes(msg.author.id))
        return msg.reply('Only developers can test crashing thebotcat.');
      msg.channel.send('Crashing myself RIP');
      throw new Error('ERORRORORORO');
    }
  }
];