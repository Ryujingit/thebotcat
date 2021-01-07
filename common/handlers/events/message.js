// main message handler
module.exports = async msg => {
  if (!msg.author.bot && msg.content.startsWith('!lavealt')) {
    if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
    let cmd = msg.content.slice(9), res;
    console.debug(`lavealt from ${msg.author.tag} in ${msg.guild ? msg.guild.name + ':' + msg.channel.name : 'dms'}: ${util.inspect(cmd)}`);
    try {
      res = eval(cmd);
      console.debug(`-> ${util.inspect(res)}`);
      if (props.erg && msg.channel.id != '733760003055288350') return;
      var richres = new Discord.MessageEmbed()
        .setTitle('Lavealt Rs')
        .setDescription(util.inspect(res));
      msg.channel.send(richres);
    } catch (e) {
      console.log('err in lavealt');
      console.debug(e.stack);
      if (props.erg && msg.channel.id != '733760003055288350') return;
      var richres = new Discord.MessageEmbed()
        .setTitle('Lavealt Er')
        .setDescription(e.stack);
      msg.channel.send(richres);
    }
    return;
  }
  
  if (handlers.extra.message) {
    let res;
    for (var i = 0; i < handlers.extra.message.length; i++) {
      if (handlers.extra.message[i].constructor == Function) res = handlers.extra.message[i](msg, i);
      else res = await handlers.extra.message[i](msg, i);
      if (res === 0) return;
    }
  }
  
  if (msg.author.bot) return;
  
  if (msg.guild && props.saved.disallowed_guilds.includes(msg.guild.id)) return;
  
  if (msg.guild && persGuildData.special_guilds.includes(msg.guild.id) && mutelist.includes(msg.author.id))
    msg.delete();
  
  if (!msg.guild) {
    if (props.feat.savedms && !props.saved.misc.dmchannels.includes(msg.channel.id)) {
      props.saved.misc.dmchannels.push(msg.channel.id);
    }
  }
  
  if (msg.channel.permissionsFor && !msg.channel.permissionsFor(client.user.id).has('SEND_MESSAGES')) return;
  
  // argstring = the part after the workingprefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var isCommand = 0, cmdstring, command, argstring, rawArgs;
  let guilddata = props.saved.guilds[msg.guild ? msg.guild.id : 'default'];
  let workingprefix = guilddata.prefix;
  
  if (msg.content == '<@' + client.user.id + '>' || msg.content == '<@!' + client.user.id + '>') return msg.channel.send(`I am ${props.feat.version == 'canary' ? 'Thebotcat Canary' : 'Thebotcat'} version ${version}, prefix \`${workingprefix}\``);
  
  if (msg.content.startsWith(universalprefix)) {
    isCommand = 1;
    cmdstring = msg.content.slice(universalprefix.length).trim();
  } else if (msg.content.startsWith(workingprefix)) {
    isCommand = 1;
    cmdstring = msg.content.slice(workingprefix.length).trim();
  } else if (msg.content.startsWith('<@' + client.user.id + '>')) {
    isCommand = 1;
    cmdstring = msg.content.slice(client.user.id.length + 3).trim();
  } else if (msg.content.startsWith('<@!' + client.user.id + '>')) {
    isCommand = 1;
    cmdstring = msg.content.slice(client.user.id.length + 4).trim();
  }
  
  if (!msg.guild) {
    if (isCommand)
      nonlogmsg(`dm from ${msg.author.tag} (channel ${msg.channel.id}) with contents ${util.inspect(msg.content)}`);
    else
      logmsg(`dm from ${msg.author.tag} (channel ${msg.channel.id}) with contents ${util.inspect(msg.content)}`);
  }
  
  // this code loops through the commands array to see if the stated text matches any known command
  if (isCommand) {
    for (var i = 0; i < commands.length; i++) {
      command = commands[i].name;
      if (!(msg.guild && commands[i].flags & 4 || !msg.guild && commands[i].flags & 8)) continue;
      if (!(commands[i].flags & 1 && command == cmdstring || !(commands[i].flags & 1) && cmdstring.startsWith(command))) continue;
      if (cmdstring[command.length] != ' ' && cmdstring[command.length] != '\n' && cmdstring.length > command.length) continue;
      if (msg.guild && (
        commands[i].flags & 2 && (command != 'settings' &&
          props.saved.guilds[msg.guild.id] && (
            !props.saved.guilds[msg.guild.id].enabled_commands.global ||
            !props.saved.guilds[msg.guild.id].enabled_commands.categories[commands[i].category] ||
            !props.saved.guilds[msg.guild.id].enabled_commands.commands[command])) ||
        !(commands[i].flags & 2) && !persGuildData.special_guilds.includes(msg.guild.id))) continue;
      argstring = cmdstring.slice(command.length).trim();
      rawArgs = common.parseArgs(argstring);
      isCommand = 2 + i;
      break;
    }
  }
  
  if (msg.guild) {
    // this is the screening for bad words part
    let isadmin = common.isAdmin(msg);
    let dodelete = false;
    let badwords = props.saved.guilds[msg.guild.id] ? props.saved.guilds[msg.guild.id].basic_automod.bad_words : [];
    let word, content, bypass;
    for (var i = 0; i < badwords.length; i++) {
      word = badwords[i];
      if (word.enabled) {
        content = msg.content;
        if (word.type & 4) content = content.toLowerCase();
        bypass = isadmin && word.ignore_admin || word.ignored_roles.some(x => msg.member.roles.cache.has(x));
        if (!bypass) {
          switch (word.type & 3) {
            case 0:
              if (content != word.word) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            case 1:
              if (!content.split(/ +/g).some(x => x == word.word)) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
            case 2:
              if (!content.includes(word.word)) break;
              dodelete = true; if (!isCommand || isCommand && command != 'settings') msg.reply(word.retaliation.replace(/\$\(rcontent\)/g, msg.content.length < 1800 ? util.inspect(msg.content) : `Error: message length over 1800 characters`)); break;
          }
        }
      }
    }
    if (dodelete) {
      if (msg.content.toLowerCase() != 'heck' || !persGuildData.special_guilds.includes(msg.guild.id))
        infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      else
        logmsg(`user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
      if (isCommand < 2) {
        try {
          await msg.delete();
        } catch (e) {}
      }
    }
  }
  
  if (isCommand >= 2) {
    try {
      return commands[isCommand - 2].execute({ msg, cmdstring, command, argstring, rawArgs }, msg, rawArgs);
    } catch (e) {
      if (e instanceof common.BotError) {
        if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(e.message)) {
          return msg.channel.send({
            embed: {
              title: 'Error',
              description: `Error: ${e.message}`,
            }
          });
        } else {
          return msg.channel.send(`Error: ${e.message}`);
        }
      } else throw e;
    }
  }
};
