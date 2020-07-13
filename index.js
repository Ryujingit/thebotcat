var starttime = new Date();

var https = require('https');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var Discord = require('discord.js');
var client = new Discord.Client();

//                 Ryujin                coolguy284            amrpowershot        |
var developers = ['405091324572991498', '312737536546177025', '571752439263526913'];

var mutelist = [];

var badwords = [
  // [bad word, retailiation]
  ['heck', 'Refrain from using that heck word you frick'],
  ['nigger', 'You said the n word.  Mods can see this message and you will get perm banned.'],
  ['faggot', 'You said fa***t.  Mods can see this message and you will get perm banned.'],
];

var prefix = '!';

var version = '1.2.1b';

var commands = [];

var procs = [];

Object.assign(global, { starttime, https, fs, util, cp, Discord, client, developers, mutelist, badwords, commands, procs });
Object.defineProperties(global, {
  prefix: {
    configurable: true,
    enumerable: true,
    get() {
      return prefix;
    },
    set(val) {
      prefix = val;
    },
  },
  version: {
    configurable: true,
    enumerable: true,
    get() {
      return version;
    },
    set(val) {
      version = val;
    },
  }
});

function addCommand(cmd) { commands.push(cmd); }
function addCommands(cmds) { commands.push(...cmds); }
function removeCommand(cmd) {
  var index;
  while ((index = commands.indexOf(cmd)) != -1)
    commands.splice(index, 1);
}
function removeCommands(cmds) {
  var index, cmd;
  for (var i = 0; i < cmds.length; i++) {
    cmd = cmds[i];
    while ((index = commands.indexOf(cmd)) != -1)
      commands.splice(index, 1);
  }
}

addCommands(require('./commands/administrative.js'));
addCommands(require('./commands/technical.js'));
addCommands(require('./commands/interactive.js'));
addCommands(require('./commands/content.js'));

var messageHandler = msg => {
  try {
    if (mutelist.includes(msg.author.id)) {
      msg.delete();
    }
  } catch (e) { console.error(e); }
  
  if (msg.author.bot) return;
  
  // the code here is before the commands, its the screening for bad words part
  if (msg.content == 'heck') {
    msg.delete();
    msg.reply(badwords[0][1]);
    return;
  }
  
  var words = msg.content.split(/ +/g);
  var deletedonce = false;
  for (var j = 1; j < badwords.length; j++) {
    if (msg.content.toLowerCase().includes(badwords[j][0])) {
      if (!deletedonce) {
        msg.delete();
        deletedonce = true;
      }
      msg.reply(badwords[j][1]);
    }
  }
  
  if (!msg.content.startsWith(prefix)) return;
  
  // argstring = the part after the prefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var argstring = msg.content.slice(prefix.length).trim();
  var args = argstring.split(/ +/g);
  var command = args.shift().toLowerCase();
  
  // this code loops through the commands array to see if the stated text matches any known command
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].full_string && commands[i].name == argstring || !commands[i].full_string && commands[i].name == command) {
      commands[i].execute(msg, argstring, command, args);
      break;
    }
  }
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
});

client.on('guildCreate', guild => {
  console.log(`Joined a new guild: ${guild.name}`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
  //Your other stuff like adding to guildArray
});

//removed from a server
client.on('guildDelete', guild => {
  console.log(`Left a guild: ${guild.name}`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
  //remove from guildArray
});

client.on('reconnecting', () => {
  console.log(`Reconnecting!`);
});

client.on('disconnect', () => {
  console.log(`Disconnect!`);
});

client.on('message', msg => {
  try {
    messageHandler(msg);
  } catch (e) {
    console.error('ERROR, something bad happened');
    console.error(e.stack);
  }
});

process.on('uncaughtException', function (err) {
  console.error('ERROR: an exception was uncaught by an exception handler.  This is very bad and could leave the bot in an unstable state.  If this is seen contact coolguy284 or another developer immediately.');
  console.error(err);
});

process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled promise rejection from ' + p + ':');
  console.error(reason);
});

client.login('NjgyNzE5NjMwOTY3NDM5Mzc4.Xlk1ug.FPZxGGn3lqkmM28JkwUMIvkbeP8');
