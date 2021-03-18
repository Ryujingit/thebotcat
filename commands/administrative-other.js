module.exports = [
  {
    name: 'say',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg) || addlbotperms[msg.author.id] & 1)) return;
      let text = o.cmdstring.slice(4);
      nonlogmsg(`say from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(text)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`say from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      msg.delete();
      return msg.channel.send(text);
    }
  },
  {
    name: 'sayy',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg) || addlbotperms[msg.author.id] & 2)) return;
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`sayy from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${common.explainChannel(channel, 1)}: ${util.inspect(text)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return;
      let argr = o.argstring.split(' ');
      let channelid = argr[0].slice(2, argr[0].length - 1);
      let text = argr.slice(1).join(' ');
      let channel;
      if (channel = client.channels.cache.get(channelid)) {
        nonlogmsg(`sayy from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${common.explainChannel(channel, 1)}: ${util.inspect(text)}`);
        return channel.send(text);
      }
    }
  },
  {
    name: 'getdmchannel',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 4)) return;
      let user = await common.searchUser(rawArgs.join(' '), { safeMode: false });
      if (!user) return msg.channel.send(`Query invalid`);
      let dmchannel = await user.createDM();
      return msg.channel.send(`DM channel for ${user.tag} is ${dmchannel.id}, use \`!sayy <#${dmchannel.id}> content\` to speak in channel`);
    }
  },
  {
    name: 'listdmchannels',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 4)) return;
      let channels = client.channels.cache.array().filter(x => x.type == 'dm').map(x => `${x.id}: ${x.recipient.tag}`).join('\n');
      return msg.channel.send(`DM channels:\n${channels}`);
    }
  },
  {
    name: 'c-gmute',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 8)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      if (!mutelist.includes(user.id)) {
        mutelist.push(user.id);
        return msg.channel.send(`Globally muted ${user.tag}`);
      } else {
        return msg.channel.send(`${user.tag} already globally muted`);
      }
    }
  },
  {
    name: 'c-gunmute',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || addlbotperms[msg.author.id] & 8)) return;
      var user;
      if (!(user = msg.mentions.users.first())) return;
      let ind;
      if ((ind = mutelist.indexOf(user.id)) != -1) {
        mutelist.splice(ind, 1);
        return msg.channel.send(`Globally unmuted ${user.tag}`);
      } else {
        return msg.channel.send(`${user.tag} not gobally muted`);
      }
    }
  },
  {
    name: 'givedeveloper',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
      nonlogmsg(`givedeveloper from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(o.argstring)}`);
      let id;
      if (/^[0-9]+$/.test(rawArgs[0])) id = rawArgs[0];
      else if (/^<@!?[0-9]+>$/.test(rawArgs[0])) id = rawArgs[0].replace(/[<@!>]/g, '');
      else return;
      developers.push(id);
      return new Promise((resolve, reject) => {
        // make this cancel existing timeout if command is run again
        setTimeout(() => {
          let arr = developers.filter(x => x != id);
          developers.splice(0, Infinity);
          developers.push(...arr);
          resolve(msg.channel.send(rawArgs.slice(2, Infinity).join(' ') || 'times up fool'));
        }, Number(rawArgs[1]) || 120000);
      });
    }
  },
  {
    name: 'giveaddlperm',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg)) return;
      nonlogmsg(`giveaddlperm from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(o.argstring)}`);
      let id;
      if (/^[0-9]+$/.test(rawArgs[0])) id = rawArgs[0];
      else if (/^<@!?[0-9]+>$/.test(rawArgs[0])) id = rawArgs[0].replace(/[<@!>]/g, '');
      else return;
      let perms = Number(rawArgs[1]);
      if (!Number.isSafeInteger(perms)) return;
      addlbotperms[id] = perms;
      return new Promise((resolve, reject) => {
        // make this cancel existing timeout if command is run again
        setTimeout(() => {
          delete addlbotperms[id];
          resolve(msg.channel.send(rawArgs.slice(3, Infinity).join(' ') || 'times up fool'));
        }, Number(rawArgs[2]) || 120000);
      });
    }
  },
  {
    name: 'wipedevelopers',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg)) return;
      developers.length = 0;
    }
  },
  {
    name: 'eval',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = o.argstring, res;
      nonlogmsg(`evaluating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (rawArgs.length == 2 && (rawArgs[0] == 'deez' && rawArgs[1] == 'nuts' || rawArgs[0] == 'goe' && rawArgs[1] == 'mama')) return msg.channel.send('no');
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`))) {
          return msg.channel.send('Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
      try {
        res = eval(cmd);
        console.debug(`-> ${util.inspect(res)}`);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Result')
          .setDescription(util.inspect(res));
        return await msg.channel.send(richres);
      } catch (e) {
        console.log('error in eval');
        console.debug(e.stack);
        var richres = new Discord.MessageEmbed()
          .setTitle('Eval Error')
          .setDescription(e.stack);
        return await msg.channel.send(richres);
      }
    }
  },
  {
    name: 'evalv',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = o.argstring, res;
      nonlogmsg(`evaluating (output voided) from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`evaluating (output voided) from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`)))
          return;
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
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
    name: 'exec',
    flags: 12,
    async execute(o, msg, rawArgs) {
      if (!(common.isDeveloper(msg) || common.isConfirmDeveloper(msg)))
        return msg.channel.send('You do not have permissions to run this command.');
      let cmd = o.argstring, res;
      nonlogmsg(`shell exec from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`);
      if (global.confirmeval && common.isConfirmDeveloper(msg)) {
        if (!(await confirmeval(`shell exec from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(cmd)}`))) {
          return msg.channel.send('Eval command failed');
        }
      } else if (common.isConfirmDeveloper(msg) && !common.isDeveloper(msg)) return msg.channel.send('You do not have permissions to run this command.');
      return new Promise((resolve, reject) => {
        let proc = cp.exec(cmd, { timeout: 20000, windowsHide: true }, (err, stdout, stderr) => {
          procs.splice(procs.indexOf(proc), 1);
          if (err) {
            console.log('error in shell exec');
            console.debug(err.stack);
            var richres = new Discord.MessageEmbed()
              .setTitle('Shell Command Error')
              .setDescription(err.stack);
            msg.channel.send(richres).then(x => resolve(x)).catch(e => reject(e));
            return;
          }
          stdout = stdout.toString(); stderr = stderr.toString();
          console.debug(`shell command result\nstdout:\n${util.inspect(stdout)}\nstderr:\n${util.inspect(stderr)}`);
          var richres = new Discord.MessageEmbed()
            .setTitle('Shell Command Result')
            .setDescription(`*stdout*:\n${util.inspect(stdout)}\n*stderr*:\n${util.inspect(stderr)}`);
            msg.channel.send(richres).then(x => resolve(x)).catch(e => reject(e));
        });
        procs.push(proc);
      });
    }
  },
  {
    name: 'crash',
    flags: 12,
    execute(o, msg, rawArgs) {
      if (!common.isDeveloper(msg))
        return msg.reply('Only developers can test crashing thebotcat.');
      msg.channel.send('Crashing myself RIP');
      throw new Error('ERORRORORORO');
    }
  },
];
