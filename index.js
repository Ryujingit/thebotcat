var starttime = new Date(), loadtime, readytime;

var exitHandled = 0;

var doWorkers = true;

var https = require('https');
var fs = require('fs');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');
var cp = require('child_process');
var stream = require('stream');
var Discord = require('discord.js');
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
    console.log('doWorkers set to true but workerpool not available so doWorkers ignored');
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
/* format for addlbotperms:
  addlbotperms : object {
    <userid> : int (perms) (
        bits:
          0 - say
          1 - say remote
          2 - getting list of, getting channel for botcat's dms
          3 - global mute and unmute (only for special guilds)
      ),
    ...
  }
*/
var addlbotperms = {};

var mutelist = [];


var version = '1.5.6f.1';
global.updateStatus = async () => {
  let newStatus = props.feat.status ? props.feat.status.replace('{prefix}', defaultprefix).replace('{guilds}', client.guilds.cache.size) : null;
  let currentStatus;
  try {
    currentStatus = client.user.presence.activities[0].name;
  } catch (e) {}
  let now = new Date();
  if (currentStatus != newStatus || !props.statusUpdatedAt || now.getTime() > props.statusUpdatedAt.getTime() + 24 * 60 * 60 * 1000) {
    try {
      await client.user.setActivity(newStatus);
      props.statusUpdatedAt = now;
    } catch (e) {
      console.error(e);
    }
  }
};

var commands = [], commandCategories = ['Information', 'Administrative', 'Interactive', 'Voice Channel', 'Music', 'Content', 'Troll'];

var procs = [];

var props = {
  feat: {
    version: 'canary', // either 'normal' or 'canary'
    repl: true,
    savedms: true,
    loaddms: false,
    status: '{prefix} | {guilds} servers | biden won 2020',
  },
  saved: null,
  savedstringify: null,
  savescheduled: false,
  statusUpdatedAt: null,
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

try {
  var persGuildData = (() => {
    let obj = JSON.parse(process.env.PERSISTENT_GUILDDATA);
    if (typeof obj != 'object') return { special_guilds: [], propssaved_alias: {} };
    return {
      special_guilds: Array.isArray(obj.special_guilds) ? obj.special_guilds.filter(x => common.isId(x)) : [],
      propssaved_alias: typeof obj.propssaved_alias == 'object' ? (() => {
        let newObj = {};
        Object.keys(obj.propssaved_alias).forEach(x => common.isId(obj.propssaved_alias[x]) ? newObj[x] = obj.propssaved_alias[x] : null);
        return newObj;
      })() : {},
    };
  })();
} catch (e) {
  console.error(e);
  var persGuildData = { special_guilds: [], propssaved_alias: {} };
}

if (fs.existsSync('props.json')) {
  try {
    props.saved = JSON.parse(props.savedstringify = fs.readFileSync('props.json').toString());
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

if (!props.saved) {
  props.saved = JSON.parse(fs.readFileSync('props-backup.json').toString());
  propsSave();
}

Object.keys(persGuildData.propssaved_alias).forEach(x => {
  let alias = persGuildData.propssaved_alias[x];
  Object.defineProperty(props.saved.guilds, x, {
    configurable: true,
    enumerable: false,
    get: () => props.saved.guilds[alias],
  });
});

Object.defineProperty(props.saved.guilds.default, 'prefix', {
  configurable: true, enumerable: false, get: () => defaultprefix, set: val => defaultprefix = val,
});

global.cleanPropsSaved = () => {
  props.saved = common.propsSavedCreateVerifiedCopy(props.saved);
  propsSave();
};

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


var indexeval = val => eval(val);
var infomsg = function (msg, val) {
  let guildinfo, channelid;
  if ((guildinfo = msg.guild ? props.saved.guilds[msg.guild.id] : undefined) && (channelid = guildinfo.logging.main) ||
    (guildinfo = props.saved.guilds['default']) && (channelid = guildinfo.logging.main)) {
    console.log(`[${new Date().toISOString()}] infomsg for ${msg.guild.name}: ${val}`);
    return client.channels.cache.get(channelid).send(val);
  }
};
var logmsg = function (val) {
  console.log(`[${new Date().toISOString()}] logmsg ${val}`);
  return client.channels.cache.get('736426551050109010').send(val);
};
var nonlogmsg = function (val) {
  console.log(`[${new Date().toISOString()}] ${val}`);
};

Object.assign(global, { https, fs, util, v8, vm, cp, stream, Discord, ytdl, common, math, client, developers, confirmdevelopers, addlbotperms, mutelist, commands, commandCategories, persGuildData, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, nonlogmsg, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands, getCommandsCategorized });
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
function getCommandsCategorized(guilddata) {
  let commandsList;
  if (guilddata == null) {
    commandsList = commands.filter(x => x.flags & 2);
  } else if (!guilddata) {
    commandsList = commands.filter(x => (x.flags & 10) == 10);
  } else {
    commandsList = commands.filter(x =>
      x.flags & 2 && !(x.name != 'settings' &&
        (!guilddata.enabled_commands.global ||
        !guilddata.enabled_commands.categories[x.category] ||
        !guilddata.enabled_commands.commands[x.name])));
  }
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
addCommands(require('./commands/administrative-other.js'), 'Administrative');
addCommands(require('./commands/administrative-settings.js'), 'Administrative');
addCommands(require('./commands/administrative-main.js'), 'Administrative');
addCommands(require('./commands/interactive.js'), 'Interactive');
addCommands(require('./commands/vc.js'), 'Voice Channel');
addCommands(require('./commands/music.js'), 'Music');
addCommands(require('./commands/content.js'), 'Content');
addCommands(require('./commands/troll.js'), 'Troll');


cleanPropsSaved();


global.handlers = common.handlers;


(async () => {
  while (!readytime)
    await new Promise(r => setTimeout(r, 1000));
  if (props.feat.version == 'normal') {
    console.log('Checking for new messages in send only channel');
    let channel = client.channels.cache.get('738599826765250632'), messages;
    try {
      while (channel.lastMessageID != props.saved.misc.sendmsgid) {
        console.log('New messages detected');
        messages = await channel.messages.fetch({ after: props.saved.misc.sendmsgid });
        console.log('Loaded up to 50 new messages');
        messages = messages.array().sort((a, b) => { a = a.createdTimestamp; b = b.createdTimestamp; if (a > b) { return 1; } else if (a < b) { return -1; } else { return 0; } });
        if (messages.length == 0) {
          props.saved.misc.sendmsgid = channel.lastMessageID;
          break;
        }
        for (var i = 0; i < messages.length; i++) {
          console.log(`message handlering from ${props.saved.misc.sendmsgid}`);
          handlers.extra.message[0](messages[i]);
          await new Promise(r => setTimeout(r, 500));
        }
      }
    } catch (e) {
      console.error(e.toString());
    }
    console.log('All caught up');
    cleanPropsSaved();
  }
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
  
  updateStatus();
  
  readytime = new Date();
  
  if (props.feat.loaddms) props.saved.misc.dmchannels.forEach(x => client.channels.fetch(x));
});

client.on('guildCreate', guild => {
  console.log(`Joined a new guild: ${guild.name}`);
  
  updateStatus();
});

client.on('guildDelete', guild => {
  console.log(`Left a guild: ${guild.name}`);
  
  updateStatus();
});

client.on('reconnecting', () => {
  console.log(`Reconnecting!`);
});

client.on('disconnect', () => {
  console.log(`Disconnect!`);
});

['message', 'voiceStateUpdate'].forEach(evtType => {
  client.on(evtType, async (...args) => {
    try {
      if (handlers.event[evtType]) {
        if (handlers.event[evtType].constructor == Function) handlers.event[evtType](...args);
        else await handlers.event[evtType](...args);
      }
    } catch (e) {
      console.error('ERROR, something bad happened');
      console.error(e.stack);
    }
  });
});


// botcat tick function called every 60 seconds
var ticks = 0;
var tickFuncs = [];
var tickFunc = () => {
  updateStatus();
  
  props.pCPUUsage = props.cCPUUsage;
  props.pCPUUsageDate = props.cCPUUsageDate;
  props.cCPUUsage = process.cpuUsage();
  props.cCPUUsageDate = new Date();
  var frac = (props.cCPUUsageDate.getTime() - props.pCPUUsageDate.getTime()) / 1000;
  props.CPUUsage = { user: (props.cCPUUsage.user - props.pCPUUsage.user) / (1000000 * frac), system: (props.cCPUUsage.system - props.pCPUUsage.system) / (1000000 * frac) };
  props.memoryUsage = process.memoryUsage();
  
  if (ticks % 10 == 0 && props.botStatusMsg && props.botStatusMsgResolve == null) {
    props.botStatusMsgResolve = props.botStatusMsg
      .edit(common.getBotcatFullStatusMessage())
      .then(x => props.botStatusMsgResolve = null)
      .catch(e => { console.error(e); props.botStatusMsgResolve = null; });
  }
  
  for (var i = 0; i < tickFuncs.length; i++) {
    tickFuncs[i]();
  }
  
  ticks++;
};
var tickInt = setInterval(() => tickFunc(), 60000);
var tickTimTemp = setTimeout(() => tickFunc(), 5000);

Object.defineProperties(global, {
  ticks: { configurable: true, enumerable: true, get: () => ticks, set: val => ticks = val },
  tickFuncs: { configurable: true, enumerable: true, get: () => tickFuncs, set: val => tickFuncs = val },
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

global.startRepl = function startRepl() {
  global.replServer = require('repl').start({
    prompt: '> ',
    terminal: true,
    useColors: true,
    useGlobal: true,
    preview: true,
    breakEvalOnSigint: true,
  });
  global.replServer.on('exit', exitHandler);
};

function exitHandler(...args) {
  if (props.feat.version == 'normal') {
    exitHandled++;
    switch (exitHandled - 1) {
      case 0:
        console.log('Are you sure you want to shut down thebotcat? Press Ctrl+C if yes.');
        setTimeout(() => { exitHandled = 0; startRepl(); }, 5000);
        break;
      case 1:
        console.log('Shutting down');
        propsSave();
        process.exit();
        break;
    }
  } else {
    if (exitHandled) return;
    exitHandled++;
    console.log('Shutting down');
    propsSave();
    process.exit();
  }
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
    startRepl();
  })();
} else {
  console.log('To shut down thebotcat press Ctrl+C, which performs a shutdown that cleans up variables.  Just pressing X could lead to data loss if props.saved was modified.');
}
