var starttime = new Date(), loadtime, readytime;

var exitHandled = false;

var doWorkers = true;

var https = require('https');
var fs = require('fs');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');
var cp = require('child_process');
var stream = require('stream');
var Discord = require('discord.js');
Discord.Message.prototype.publish = async function () {
  if (this.flags.bitfield & 1 || this.channel.type != 'news') return;
  return client.rest.api.channels[this.channel.id].messages[this.id].crosspost.post();
};
var ytdl;
try { ytdl = require('ytdl-core'); } catch (e) { ytdl = null; }
var common = require('./common/index');
var math = require('./math.min.js');
var client = new Discord.Client();
math.config({ number: 'BigNumber' });
math.oldimport = math.import.bind(math);
math.oldcreateUnit = math.createUnit.bind(math);
math.import({
  'import':     function (...args) { if (calccontext) throw new Error('Function import is disabled'); return math.oldimport(...args); },
  'createUnit': function (...args) { if (calccontext) throw new Error('Function createUnit is disabled'); return math.oldcreateUnit(...args); },
  /*'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') },*/
  'delete':     function (...args) {
    if (args.length == 2) {
      return delete args[0][args[1]];
    } else if (args.length == 1) {
      if (calccontext) return delete calccontext[args[0]];
      else return delete args[0];
    } else throw new Error('Invalid arguments');
  },
}, { override: true });
global.calccontext = null;

if (doWorkers) {
  try {
    var workerpool = require('workerpool');
  } catch (e) {
    console.log('doWorkers set to true but workerpool not available so doWorkers set to false');
    doWorkers = false;
  }
}
if (doWorkers) {
  var worker = require('worker_threads');
  var pool = workerpool.pool(__dirname + '/worker.js', { workerType: 'thread', maxWorkers: 3 });
  Object.assign(global, { worker, workerpool, pool });
} else {
  var mathVMContext = vm.createContext({ math });
  Object.assign(global, { mathVMContext });
}

//                 Ryujin                coolguy284            woosh
var developers = ['405091324572991498', '312737536546177025', '342384766378573834'];
var confirmdevelopers = [];

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
  { enabled: true, type: 9, adminbypass: 0, word: 'heck', retaliation: 'Refrain from using that heck word you frick' },
  { enabled: true, type: 11, adminbypass: 0, word: 'nigger', retaliation: 'You said the n word.  Mods can see this message and you will get perm banned. (message content $(rcontent))' },
  { enabled: true, type: 11, adminbypass: 0, word: 'faggot', retaliation: 'You said fa***t.  Mods can see this message and you will get perm banned. (message content $(rcontent))' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/, retaliation: 'uwu or owo are blacklisted and you will get banned' },
  { enabled: false, type: 4, adminbypass: 0, word: '███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝', retaliation: 'at this point im just gonna say f you' },
  { enabled: false, type: 12, adminbypass: 0, word: /(?:\bp[  /-]*p\b)/, retaliation: 'pp is blacklisted and you will get banned' },
  { enabled: false, type: 3, adminbypass: 0, word: `The first time I drank coffee I cried. I didn't cry because of the taste, that would be stupid. I cried because of the cup. I looked down into my coffee and bugs filled the premises. Disgusted I threw the cup down but nothing was there. Not the cup, not the bugs, not the street. I'm not blind, I do see darkness, and it was dark but not nighttime. I was alone in the city. My arms weren't there. My hands were gone. My image was nothing but a figment. I cried. I'm crying. I'm lost without an end. I won't ever drink coffee again.`, retaliation: 'dez\'s life story is private information' },
];

var version = '1.5.1c';

var commands = [];

var procs = [];

var props = {
  feat: {
    version: 'canary', // either 'normal' or 'canary'
    repl: true,
    savedms: true,
    loaddms: false,
  },
  saved: null,
  savedstringify: null,
  savescheduled: false,
  cCPUUsage: process.cpuUsage(),
  cCPUUsageDate: new Date(),
  pCPUUsage: null,
  pCPUUsageDate: null,
  CPUUsage: null,
  memoryUsage: process.memoryUsage(),
  botStatusChannel: null,
  botStatusMsg: null,
  botStatusMsgResolve: null,
};

var defaultprefix = props.feat.version == 'normal' ? '!' : '?';
var universalprefix = props.feat.version == 'normal' ? '!(thebotcat)' : '?(thebotcat)';

try {
  fs.readFileSync('.env').toString().split(/\r?\n/g).forEach(entry => {
    if (entry[0] == '#') return;
    var split = entry.split(':');
    var key = split[0].trim();
    var value = split.slice(1).join(':').trim();
    process.env[key] = value;
  });
} catch (e) {
  console.error('Error parsing .env, thebotcat will not be able to login');
  console.error(e);
}

if (fs.existsSync('props.json')) {
  try {
    let val = JSON.parse(props.savedstringify = fs.readFileSync('props.json').toString(), math.reviver);
    if (val.feat && val.guilds && val.calc_scopes) props.saved = val;
    else throw new Error('Loaded props.json but incomplete');
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

/* format for props.saved (its not like this right now, its pending a database migration and code change in next commit):
  props.saved : object {
    feat : object {
      calc : bool (default false),
      audio : int 0-3 (default 0; &1 = join/leave, &2 = music),
      lamt : int (default 0),
    },
    guilds : object {
      <guildid> : object {
        prefix : string (default <defaultprefix>),
        enabled_commands : object {
          categories : object {
            administrative : bool,
            technical : bool,
            interactive : bool,
            vc_joinleave : bool,
            music : bool,
          },
        },
        logging : object {
          main : string <channelid>,
        },
        perms : array [
          object {
            id : string <roleid>,
            perms : int (
              bits:
                0 - normal bot commands
                1 - get bot to join vc
                2 - get bot to leave vc when there are others
                3 - play songs
                4 - play playlists
                5 - voteskip
                6 - forceskip and remove
                7 - mute and tempmute
                8 - kick
                9 - ban
                10 - change prefix
            ),
          },
          ...
        ],
        overrides : object {
          <channelid> : array [
            object {
              id : string <roleid/userid>,
              allows : int,
              denys : int,
            },
            ...
          ],
          ...
        },
        temp : object {
          channeloverrides : object {
            <channelid> : object {
              id : string <roleid/userid>,
              type : string 'role' / 'user',
              allow : int,
              deny : int,
            },
            ...
          },
        },
        [EMPHEMERAL] voice : object {
          channel : null / VoiceChannel,
          connection : null / VoiceConnection,
          dispatcher : null / StreamDispatcher,
          proc : null / child_process (ffmpeg),
          procpipe : null / common.BufferStream,
          proc2 : null / child_process (ffmpeg),
          proc2pipe : null / common.BufferStream,
          mainloop : int 0 (not playing) / 1 (playing) / 2 (skip request) / 3 (terminate song mainloop),
          songslist : array [
            object {
              query : string,
              url : string,
              desc : string,
              expectedLength : int (msec),
            },
            ...
          ],
          volume : null,
          loop : null,
        },
      },
      ...
    },
    users : object {
      'default' / <userid> : object {
        calc_scope : string (math.js calc scope, serialized),
        [EMPHEMERAL] calc_scope_working : object {
          shared : props.saved.users.default.calc_scope,
          ...
        } (math.js calc scope),
      },
      ...
    },
    misc : object {
      dmchannels : array [
        string <channnelid>,
        ...
      ],
      sendmsgid : string <messageid>,
    },
  }
 */
if (!props.saved) {
  props.saved = JSON.parse(fs.readFileSync('props-backup.json').toString(), math.reviver);
  propsSave();
}

Object.defineProperties(props.saved.guilds, {
  'wendys': { configurable: true, enumerable: false, get: () => props.saved.guilds['711668012528304178'] },
  'ryuhub': { configurable: true, enumerable: false, get: () => props.saved.guilds['671477379482517516'] },
  'botcat': { configurable: true, enumerable: false, get: () => props.saved.guilds['688806155530534931'] },
  'pensive': { configurable: true, enumerable: false, get: () => props.saved.guilds['717268211246301236'] },
  'bluetop': { configurable: true, enumerable: false, get: () => props.saved.guilds['475143894074392580'] },
});

Object.defineProperty(props.saved.guilds.default, 'prefix', {
  configurable: true, enumerable: false, get: () => defaultprefix, set: val => defaultprefix = val,
});

// props.saved integrity checks
(() => {
  if (!props.saved.calc_scopes.shared) props.saved.calc_scopes.shared = {};
  if (!('calc' in props.saved.feat)) props.saved.feat.calc = false;
  if (!('audio' in props.saved.feat)) props.saved.feat.audio = 0;
  if (!('lamt' in props.saved.feat)) props.saved.feat.lamt = 0;
  let ks = Object.keys(props.saved.guilds), obj;
  for (var i = 0; i < ks.length; i++) {
    obj = props.saved.guilds[ks[i]];
    if (!obj.modroles) obj.modroles = [];
    if (obj.infochannel === undefined) obj.infochannel = null;
    if (!obj.mutelist) obj.mutelist = [];
    if (!obj.savedperms) obj.savedperms = {};
    if (!obj.prefix) obj.prefix = defaultprefix;
    Object.defineProperty(obj, 'voice', {
      configurable: true,
      enumerable: false,
      writeable: true,
      value: common.clientVCManager.getEmptyVoiceObject(),
    });
  }
  ks = Object.keys(props.saved.calc_scopes);
  for (var i = 0; i < ks.length; i++) {
    obj = props.saved.calc_scopes[ks[i]];
    Object.defineProperty(obj, 'shared', {
      configurable: true,
      enumerable: false,
      get: () => props.saved.calc_scopes.shared,
    });
  }
})();
propsSave();

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
    console.log(`infomsg for ${msg.guild.name}: ${val}`);
    return client.channels.cache.get(channelid).send(val);
  }
};
var logmsg = function (val) {
  console.log(`logmsg ${val}`);
  return client.channels.cache.get('736426551050109010').send(val);
};

Object.assign(global, { https, fs, util, v8, vm, cp, stream, Discord, ytdl, common, math, client, developers, confirmdevelopers, mutelist, badwords, commands, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands, getCommandsCategorized });
Object.defineProperties(global, {
  exitHandled: { configurable: true, enumerable: true, get: () => exitHandled, set: val => exitHandled = val },
  starttime: { configurable: true, enumerable: true, get: () => starttime, set: val => starttime = val },
  loadtime: { configurable: true, enumerable: true, get: () => loadtime, set: val => loadtime = val },
  readytime: { configurable: true, enumerable: true, get: () => readytime, set: val => readytime = val },
  doWorkers: { configurable: true, enumerable: true, get: () => doWorkers, set: val => doWorkers = val },
  defaultprefix: { configurable: true, enumerable: true, get: () => defaultprefix, set: val => defaultprefix = val },
  universalprefix: { configurable: true, enumerable: true, get: () => universalprefix, set: val => universalprefix = val },
  version: { configurable: true, enumerable: true, get: () => version, set: val => version = val },
  messageHandler: { configurable: true, enumerable: true, get: () => handlers.event.message, set: val => handlers.event.message = val },
  messageHandlers: { configurable: true, enumerable: true, get: () => handlers.extra.message, set: val => handlers.extra.message = val },
  voiceStateUpdateHandler: { configurable: true, enumerable: true, get: () => voiceStateUpdateHandler, set: val => voiceStateUpdateHandler = val },
  exitHandler: { configurable: true, enumerable: true, get: () => exitHandler, set: val => exitHandler = val },
});

function addBadWord(word, msgreply) { badwords.push([word.toLowerCase(), msgreply]); }
function removeBadWord(word) { badwords.splice(badwords.map(x => x[0]).indexOf(word), 1); }

function addCommand(cmd, category) {
  if (category)
    commands.push({ category, ...cmd });
  else
    commands.push(cmd);
}
function addCommands(cmds, category) {
  if (category)
    commands.push(...cmds.map(x => ({ category, ...x })));
  else
    commands.push(...cmds);
}
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
function getCommandsCategorized() {
  let commandsList = commands.filter(x => x.public);
  let commandsCategorized = { Uncategorized: [] };
  commandsList.forEach(x =>
    x.category ?
      (commandsCategorized[x.category] ?
        commandsCategorized[x.category].push(x) :
        commandsCategorized[x.category] = [x]
      ) :
      commandsCategorized.uncategorized.push(x)
  );
  if (commandsCategorized.Uncategorized.length == 0) delete commandsCategorized.Uncategorized;
  return [commandsList, commandsCategorized];
}

addCommands(require('./commands/information.js'), 'Information');
addCommands(require('./commands/administrative.js'), 'Administrative');
addCommands(require('./commands/interactive.js'), 'Interactive');
addCommands(require('./commands/vc.js'), 'Voice Channel');
addCommands(require('./commands/music.js'), 'Music');
addCommands(require('./commands/content.js'), 'Content');
addCommands(require('./commands/troll.js'), 'Troll');

global.handlers = common.handlers;

(async () => {
  while (!readytime)
    await new Promise(r => setTimeout(r, 1000));
  console.log('Checking for new messages in send only channel');
  let channel = client.channels.cache.get('738599826765250632'), messages;
  try {
    while (channel.lastMessageID != props.saved.sendmsgid) {
      console.log('New messages detected');
      messages = await channel.messages.fetch({ after: props.saved.sendmsgid });
      console.log('Loaded up to 50 new messages');
      messages = messages.keyArray().map(x => messages.get(x)).sort((a, b) => { a = a.createdTimestamp; b = b.createdTimestamp; if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0; } });
      if (messages.length == 0) {
        props.saved.sendmsgid = channel.lastMessageID;
        break;
      }
      for (var i = 0; i < messages.length; i++) {
        console.log(`message handlering from ${props.saved.sendmsgid}`);
        handlers.extra.message[0](messages[i]);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  } catch (e) {
    console.error(e.toString());
  }
  console.log('All caught up');
  propsSave();
  loadtime = new Date();
  try {
    props.botStatusChannel = await client.channels.fetch('759507043685105757');
    if (props.feat.version == 'normal') {
      props.botStatusMsg = await props.botStatusChannel.messages.fetch('762432760680808479');
    } else if (props.feat.version == 'canary') {
      props.botStatusMsg = { edit: () => Promise.resolve(null) };
    }
  } catch (e) {
    console.error(`couldn't fetch bot status message`);
    console.error(e);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  client.user.setActivity(`${defaultprefix} | ${client.guilds.cache.size} servers | wash your hands kids`);
  
  readytime = new Date();
  
  if (props.feat.loaddms) props.saved.dmchannels.forEach(x => client.channels.fetch(x));
});

client.on('guildCreate', guild => {
  console.log(`Joined a new guild: ${guild.name}`);
  
  client.user.setActivity(`${defaultprefix} | ${client.guilds.cache.size} servers | wash your hands kids`);
});

client.on('guildDelete', guild => {
  console.log(`Left a guild: ${guild.name}`);
  
  client.user.setActivity(`${defaultprefix} | ${client.guilds.cache.size} servers | wash your hands kids`);
});

client.on('reconnecting', () => {
  console.log(`Reconnecting!`);
});

client.on('disconnect', () => {
  console.log(`Disconnect!`);
});

['message', 'voiceStateUpdate'].forEach(evtType => {
  client.on(evtType, (...args) => {
    try {
      if (handlers.event[evtType]) handlers.event[evtType](...args);
    } catch (e) {
      console.error('ERROR, something had happened');
      console.error(e.stack);
    }
  });
});

// botcat tick function called every 60 seconds
var ticks = 0;
var tickFunc = () => {
  props.pCPUUsage = props.cCPUUsage;
  props.pCPUUsageDate = props.cCPUUsageDate;
  props.cCPUUsage = process.cpuUsage();
  props.cCPUUsageDate = new Date();
  var frac = (props.cCPUUsageDate.getTime() - props.pCPUUsageDate.getTime()) / 1000;
  props.CPUUsage = { user: (props.cCPUUsage.user - props.pCPUUsage.user) / (1000000 * frac), system: (props.cCPUUsage.system - props.pCPUUsage.system) / (1000000 * frac) };
  props.memoryUsage = process.memoryUsage();
  
  if (ticks % 10 == 0 && props.botStatusMsg && props.botStatusMsgResolve == null) {
    props.botStatusMsgResolve = props.botStatusMsg
      .edit(common.getBotcatStatusMessage())
      .then(x => props.botStatusMsgResolve = null)
      .catch(e => { console.error(e); props.botStatusMsgResolve = null; });
  }
  
  ticks++;
};
var tickInt = setInterval(() => tickFunc(), 60000);
var tickTimTemp = setTimeout(() => tickFunc(), 5000);

Object.defineProperties(global, {
  ticks: { configurable: true, enumerable: true, get: () => ticks, set: val => ticks = val },
  tickFunc: { configurable: true, enumerable: true, get: () => tickFunc, set: val => tickFunc = val },
  tickInt: { configurable: true, enumerable: true, get: () => tickInt, set: val => tickInt = val },
  tickTimTemp: { configurable: true, enumerable: true, get: () => tickTimTemp, set: val => tickTimTemp = val },
});

process.on('uncaughtException', function (err) {
  console.error('ERROR: an exception was uncaught by an exception handler.  This is very bad and could leave the bot in an unstable state.  If this is seen contact coolguy284 or another developer immediately.');
  console.error(err);
});

process.on('unhandledRejection', function (reason, p) {
  console.error('Unhandled promise rejection from ' + p + ':');
  console.error(reason);
});

function exitHandler() {
  if (exitHandled) return;
  console.log('Shutting down');
  propsSave();
  exitHandled = true;
  process.exit();
}

process.on('exit', exitHandler);

process.on('SIGINT', exitHandler);

if (props.feat.version == 'normal') {
  client.login(process.env.THEBOTCAT_TOKEN);
} else if (props.feat.version == 'canary') {
  client.login(process.env.THEBOTCAT_CANARY_TOKEN);
}


if (props.feat.repl) {
  console.log('To shut down thebotcat press Ctrl+C twice or Ctrl+D to exit the repl, after which a shutdown is performed that cleans up variables.  Just pressing X could lead to data loss if props.saved was modified.');
  (async () => {
    while ((!loadtime || !readytime) && Date.now() < starttime.getTime() + 10000)
      await new Promise(r => setTimeout(r, 5));
    global.replServer = require('repl').start({
      prompt: '> ',
      terminal: true,
      useColors: true,
      useGlobal: true,
      preview: true,
      breakEvalOnSigint: true,
    });
    global.replServer.on('exit', exitHandler);
  })();
} else {
  console.log('To shut down thebotcat press Ctrl+C, which performs a shutdown that cleans up variables.  Just pressing X could lead to data loss if props.saved was modified.');
}
