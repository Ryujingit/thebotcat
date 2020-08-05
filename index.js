var starttime = new Date();

var https = require('https');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var Discord = require('discord.js');
var common = require('./common.js');
var client = new Discord.Client();
var math = require('./math.min.js');
math.config({ number: 'BigNumber' });
math.oldimport = math.import.bind(math);
math.oldcreateUnit = math.createUnit.bind(math);
math.import({
  'import':     function (...args) { if (!safecontext) throw new Error('Function import is disabled'); return math.oldimport(...args); },
  'createUnit': function (...args) { if (!safecontext) throw new Error('Function createUnit is disabled'); return math.oldcreateUnit(...args); },
  /*'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }*/
}, { override: true });
global.savecontext = true;

//                 Ryujin                coolguy284            amrpowershot
var developers = ['405091324572991498', '312737536546177025'];

var mutelist = [];

var badwords = [
  /*
    type=0: ignore
    type=1: word by itself
    type=2: match per word
    type=3: match using includes
    type=4: regex match
    type&8: apply tolowercase
    
    adminbypass&1: developers
    adminbypass&2: server admins
    adminbypass&4: server mod roles
  */
  { enabled: true, type: 9, adminbypass: 0, word: 'heck', retailiation: 'Refrain from using that heck word you frick' },
  { enabled: true, type: 11, adminbypass: 0, word: 'nigger', retailiation: 'You said the n word.  Mods can see this message and you will get perm banned.' },
  { enabled: true, type: 11, adminbypass: 0, word: 'faggot', retailiation: 'You said fa***t.  Mods can see this message and you will get perm banned.' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/, retailiation: 'uwu or owo are blacklisted and you will get banned' },
  { enabled: false, type: 4, adminbypass: 0, word: '███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝', retailiation: 'at this point im just gonna say f you' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bp[  /-]*p\b)/, retailiation: 'pp is blacklisted and you will get banned' },
  { enabled: false, type: 3, adminbypass: 0, word: `The first time I drank coffee I cried. I didn't cry because of the taste, that would be stupid. I cried because of the cup. I looked down into my coffee and bugs filled the premises. Disgusted I threw the cup down but nothing was there. Not the cup, not the bugs, not the street. I'm not blind, I do see darkness, and it was dark but not nighttime. I was alone in the city. My arms weren't there. My hands were gone. My image was nothing but a figment. I cried. I'm crying. I'm lost without an end. I won't ever drink coffee again.`, retailiation: 'dez\'s life story is private information' },
];

var prefix = '!';

var version = '1.3.5';

var commands = [];

var procs = [];

var props = {
  saved: null,
  savedstringify: null,
  savescheduled: false,
};

if (fs.existsSync('props.json')) {
  try {
    let val = JSON.parse(props.savedstringify = fs.readFileSync('props.json').toString(), math.reviver);
    if (val.feat && val.guilds && val.calc_scopes) props.saved = val;
    else throw new Error('Loaded props.json but incomplete');
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

if (!props.saved) {
  props.saved = {
    feat: {
      calc: false,
    },
    guilds: {
      '711668012528304178': {
        modroles: ['730919511284252754'],
        infochannel: '724006510576926810',
        mutelist: [],
        savedperms: {},
        prefix: prefix,
      },
      '671477379482517516': {
        modroles: [],
        infochannel: '710670425318883409',
        mutelist: [],
        savedperms: {},
        prefix: prefix,
      },
      '688806155530534931': {
        modroles: [],
        infochannel: '688806772382761040',
        mutelist: [],
        savedperms: {},
        prefix: prefix,
      },
      '717268211246301236': {
        modroles: [],
        infochannel: '739314876182167602',
        mutelist: [],
        savedperms: {},
        prefix: prefix,
      },
      'default': {
        modroles: [],
        infochannel: '724006510576926810',
        mutelist: [],
        savedperms: {},
      }
    },
    calc_scopes: {},
    sendmsgid: '739603137601601647',
    lastnum: 5000,
    lastnumid: '739532317537599509',
  };
  propsSave();
}

Object.defineProperty(props.saved.guilds.default, 'prefix', {
  configurable: true,
  enumerable: false,
  get: () => prefix,
  set: val => prefix = val,
});

// props.saved.guilds integrity check
(() => {
  let ks = Object.keys(props.saved.guilds), obj;
  for (var i = 0; i < ks.length; i++) {
    obj = props.saved.guilds[ks[i]];
    if (!obj.modroles) obj.modroles = [];
    if (obj.infochannel === undefined) obj.infochannel = null;
    if (!obj.mutelist) obj.mutelist = [];
    if (!obj.savedperms) obj.savedperms = {};
    if (!obj.prefix) obj.prefix = prefix;
  }
})();

function propsSave() {
  let val;
  if ((val = JSON.stringify(props.saved, math.replacer)) != props.savedstringify) {
    fs.writeFileSync('props.json', val);
    props.savedstringify = val;
  }
}

function schedulePropsSave() {
  if (props.savescheduled) return;
  props.savescheduled = true;
  setTimeout(() => {
    propsSave();
    props.savescheduled = false;
  }, 60000);
}

var indexeval = function (val) { return eval(val); };
var infomsg = function (msg, val) {
  let guildinfo, channelid;
  if ((guildinfo = msg.guild ? props.saved.guilds[msg.guild.id] : undefined) && (channelid = guildinfo.infochannel) || (guildinfo = props.saved.guilds['default']) && (channelid = guildinfo.infochannel)) {
    return client.channels.get(channelid).send(val);
  }
};
var logmsg = function (val) {
  return client.channels.get('736426551050109010').send(val);
}

Object.assign(global, { starttime, https, fs, util, cp, Discord, common, client, math, developers, mutelist, badwords, commands, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands });
Object.defineProperties(global, {
  prefix: {
    configurable: true,
    enumerable: true,
    get() { return prefix; },
    set(val) { prefix = val; },
  },
  version: {
    configurable: true,
    enumerable: true,
    get() { return version; },
    set(val) { version = val; },
  },
  messageHandler: {
    configurable: true,
    enumerable: true,
    get() { return messageHandler; },
    set(val) { messageHandler = val; },
  }
});

function addBadWord(word, msgreply) { badwords.push([word.toLowerCase(), msgreply]); }
function removeBadWord(word) { badwords.splice(badwords.map(x => x[0]).indexOf(word), 1); }

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

var messageHandlers = [
  msg => {
    if (msg.channel.id == '738599826765250632') {
      msg.delete();
      client.channels.get('738593863958003756').send(`${msg.author.tag}: ${msg.content}`);
      props.saved.sendmsgid = msg.id;
      schedulePropsSave();
    }
    if (msg.channel.id == '738602247549616170' && (props.saved.lastnum == null || props.saved.lastnum < 5000)) {
      if (msg.embeds.length || props.saved.lastnum != null && Number(msg.content) != props.saved.lastnum + 1) { msg.delete(); console.log(`[${new Date().toISOString()}] count to 5000, deleted ${msg.author.tag}: ${msg.content}`); }
      else props.saved.lastnum = Number(msg.content);
      if (props.saved.lastnum >= 5000)
        msg.channel.send('The goal of 5000 has been reached, this channel has now been freed.');
      props.saved.lastnumid = msg.id;
      schedulePropsSave();
    }
  }
];

global.messageHandlers = messageHandlers;

(async () => {
  while (!client.token)
    await new Promise(r => setTimeout(r, 1000));
  console.log('Checking for new messages in send only channel');
  let channel = client.channels.get('738599826765250632'), messages;
  try {
    while (channel.lastMessageID != props.saved.sendmsgid) {
      console.log('New messages detected');
      messages = await channel.fetchMessages({ after: props.saved.sendmsgid });
      console.log('Loaded up to 50 new messages');
      messages = messages.keyArray().map(x => messages.get(x)).sort((a, b) => { a = a.createdTimestamp; b = b.createdTimestamp; if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0; } });
      if (messages.length == 0) {
        props.saved.sendmsgid = channel.lastMessageID;
        break;
      }
      for (var i = 0; i < messages.length; i++) {
        console.log(`message handlering from ${props.saved.sendmsgid}`);
        messageHandlers[0](messages[i]);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  } catch (e) {
    console.error(e.toString());
  }
  console.log('Checking for new messages in count to 5000 channel');
  channel = client.channels.get('738602247549616170');
  try {
    while (props.saved.lastnum < 5000 && channel.lastMessageID != props.saved.lastnumid) {
      console.log('New messages detected');
      messages = await channel.fetchMessages({ after: props.saved.lastnumid });
      console.log('Loaded up to 50 new messages');
      messages = messages.keyArray().map(x => messages.get(x)).sort((a, b) => { a = a.createdTimestamp; b = b.createdTimestamp; if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0; } });
      if (messages.length == 0) {
        props.saved.lastnumid = channel.lastMessageID;
        break;
      }
      for (var i = 0; i < messages.length; i++) {
        console.log(`message handlering from ${props.saved.lastnumid}`);
        messageHandlers[0](messages[i]);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  } catch (e) {
    console.error(e.toString());
  }
  console.log('All caught up');
  propsSave();
})();

var messageHandler = msg => {
  if (!msg.author.bot && msg.content.startsWith('!lavealt')) {
    if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return;
    let cmd = msg.content.slice(9), res;
    console.debug(`lavealt ${util.inspect(cmd)}`);
    try {
      res = eval(cmd);
      console.debug(`-> ${util.inspect(res)}`);
      if (props.erg) return;
      var richres = new Discord.RichEmbed()
        .setTitle('Lavealt Rs')
        .setDescription(util.inspect(res));
      msg.channel.send(richres);
    } catch (e) {
      console.log('err in lavealt');
      console.debug(e.stack);
      if (props.erg) return;
      var richres = new Discord.RichEmbed()
        .setTitle('Lavealt Er')
        .setDescription(e.stack);
      msg.channel.send(richres);
    }
    return;
  }
  
  for (var i = 0; i < messageHandlers.length; i++) {
    if (messageHandlers[i](msg, i) === 0) return;
  }
  
  if (msg.guild && msg.guild.id == '631990565550161951') return;
  
  if (msg.author.bot) return;
  
  if (mutelist.includes(msg.author.id) || 
      msg.guild && props.saved.guilds[msg.guild.id] && (
        props.saved.guilds[msg.guild.id].mutelist.includes(msg.author.id)
      )
    ) {
    msg.delete();
  }
  
  if (!msg.guild) logmsg(`dm from ${msg.author.tag} with contents ${util.inspect(msg.content)}`);
  
  // this is the screening for bad words part
  if (msg.guild) {
    let isdeveloper = !props.erg && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id),
        isadmin = msg.member.hasPermission('ADMINISTRATOR'),
        ismod = props.saved.guilds[msg.guild.id] ? msg.member.roles.filter(x => props.saved.guilds[msg.guild.id].modroles.includes(x)) != null : false;
    let dodelete = false;
    let word, content, bypass;
    for (var i = 0; i < badwords.length; i++) {
      word = badwords[i];
      if (word.enabled) {
        content = msg.content;
        if (word.type & 8) content = content.toLowerCase();
        bypass = isdeveloper && word.adminbypass & 1 || isadmin && word.adminbypass & 2 || ismod && word.adminbypass & 4;
        if (!bypass) {
          switch (word.type & 7) {
            case 0: break;
            case 1:
              if (content != word.word) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 2:
              if (!content.split(/ +/g).some(x => x == word.word)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 3:
              if (!content.includes(word.word)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            case 4:
              if (!word.word.test(content)) break;
              dodelete = true; msg.reply(word.retailiation); break;
            default: break;
          }
        }
      }
    }
    if (dodelete) msg.delete();
  }
  
  let guilddata = props.saved.guilds[msg.guild ? msg.guild.id : 'default'];
  let workingprefix = guilddata ? guilddata.prefix : props.saved.guilds.default.prefix;
  
  if (/^<@!?682719630967439378>$/.test(msg.content)) return msg.channel.send(`I am Thebotcat version ${version}, prefix \`${workingprefix}\``);
  
  if (!msg.content.startsWith(workingprefix) || !msg.guild) return;
  
  // argstring = the part after the workingprefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var cmdstring = msg.content.slice(workingprefix.length).trim(), args, command;
  
  // this code loops through the commands array to see if the stated text matches any known command
  var didexecute = false;
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].full_string && commands[i].name == cmdstring || !commands[i].full_string && cmdstring.startsWith(commands[i].name)) {
      command = commands[i].name;
      if (cmdstring[command.length] != ' ' && cmdstring.length > command.length) continue;
      let argstring = cmdstring.slice(command.length + 1);
      args = argstring == '' ? [] : argstring.split(' ');
      commands[i].execute(msg, cmdstring, command, argstring, args);
      didexecute = true;
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
});

client.on('guildDelete', guild => {
  console.log(`Left a guild: ${guild.name}`);
  
  client.user.setActivity(`! | ${client.guilds.size} servers | wash your hands kids`);
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

process.on('exit', propsSave);

require('./normal.js');