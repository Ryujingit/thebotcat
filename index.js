var starttime = new Date(), loadtime, readytime;

var fs = require('fs');

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

var exitHandled = 0;

var doWorkers = true;

var https = require('https');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');
var cp = require('child_process');
var stream = require('stream');
var Discord = require('discord.js');
var ytdl;
try { ytdl = require('ytdl-core-discord'); } catch (e) { ytdl = null; }
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
  var pool = workerpool.pool(__dirname + '/worker.js', { workerType: 'process', maxWorkers: 3, forkOpts: { execArgv: ['--max_old_space_size=50'] } });
  Object.assign(global, { worker, workerpool, pool });
} else {
  var mathVMContext = vm.createContext({ math });
  Object.assign(global, { mathVMContext });
}

try { var developers = JSON.parse(process.env.DEVELOPERS); } catch (e) { var developers = ['405091324572991498','312737536546177025']; }
try { var confirmdevelopers = JSON.parse(process.env.CONFIRMDEVELOPERS); } catch (e) { var confirmdevelopers = []; }
try { var addlbotperms = JSON.parse(process.env.ADDLBOTPERMS); } catch (e) { var addlbotperms = {}; }

var mutelist = [];


var version = require('./package.json').version;
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

var commands = [], commandColl = new Discord.Collection(), commandCategories = ['Information', 'Administrative', 'Interactive', 'Voice Channel', 'Music', 'Content', 'Troll'];

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
  var persGuildData = (() => {
    let obj = JSON.parse(process.env.PERSISTENT_GUILDDATA);
    if (typeof obj != 'object') return { special_guilds: [], special_guilds_set: new Set(), propssaved_alias: {} };
    obj = {
      special_guilds: Array.isArray(obj.special_guilds) ? obj.special_guilds.filter(x => common.isId(x)) : [],
      special_guilds_set: null,
      propssaved_alias: typeof obj.propssaved_alias == 'object' ? (() => {
        let newObj = {};
        Object.keys(obj.propssaved_alias).forEach(x => common.isId(obj.propssaved_alias[x]) ? newObj[x] = obj.propssaved_alias[x] : null);
        return newObj;
      })() : {},
    };
    obj.special_guilds_set = new Set(obj.special_guilds);
    return obj;
  })();
} catch (e) {
  console.error(e);
  var persGuildData = { special_guilds: [], special_guilds_set: new Set(), propssaved_alias: {} };
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
  let guildinfo = msg.guild ? props.saved.guilds[msg.guild.id] : undefined, channelid;
  if (guildinfo && (channelid = guildinfo.logging.main)) {
    if (persGuildData.special_guilds_set.has(msg.guild.id))
      nonlogmsg(`infomsg for ${msg.guild.name}: ${val}`);
    return client.channels.cache.get(channelid).send(common.removePings(val));
  }
};
var logmsg = function (val) {
  nonlogmsg(`logmsg ${val}`);
  return client.channels.cache.get('736426551050109010').send(common.removePings(val));
};
var nonlogmsg = function (val) {
  console.log(`[${new Date().toISOString()}] ${val}`);
};

Object.assign(global, { https, fs, util, v8, vm, cp, stream, Discord, ytdl, common, math, client, developers, confirmdevelopers, addlbotperms, mutelist, commands, commandColl, commandCategories, persGuildData, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, nonlogmsg, addCommand, addCommands, removeCommand, removeCommands, getCommandsCategorized, updateSlashCommands, deleteSlashCommands });
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


function addCommand(cmd, category) {
  if (category) {
    cmd = { category, ...cmd };
    commands.push(cmd);
    commandColl.set(cmd.name, cmd);
  } else {
    commands.push(cmd);
    commandColl.set(cmd.name, cmd);
  }
}
function addCommands(cmds, category) {
  cmds.forEach(x => addCommand(x, category));
}
function removeCommand(cmd) {
  var index;
  while ((index = commands.indexOf(cmd)) != -1)
    commands.splice(index, 1);
  commandColl.delete(cmd.name);
}
function removeCommands(cmds) {
  var index, cmd;
  cmds.forEach(x => removeCommand(x));
}
function getCommandsCategorized(guilddata, slashContext) {
  let commandsList;
  if (guilddata == null) {
    commandsList = commands.filter(x => x.flags & 0b000010);
  } else if (!guilddata) {
    if (slashContext)
      commandsList = commands.filter(x => (x.flags & 0b100010) == 0b100010);
    else
      commandsList = commands.filter(x => (x.flags & 0b011010) == 0b011010);
  } else {
    if (slashContext)
      commandsList = commands.filter(x =>
        (x.flags & 0b100010) == 0b100010 && !(x.name != 'settings' &&
          (!guilddata.enabled_commands.global ||
          guilddata.enabled_commands.categories[x.category] == false ||
          guilddata.enabled_commands.commands[x.name] == false)));
    else
      commandsList = commands.filter(x =>
        (x.flags & 0b010110) == 0b010110 && !(x.name != 'settings' &&
          (!guilddata.enabled_commands.global ||
          guilddata.enabled_commands.categories[x.category] == false ||
          guilddata.enabled_commands.commands[x.name] == false)));
  }
  let commandsCategorized = { Uncategorized: [] };
  commandsList.forEach(x =>
    x.category ?
      (commandsCategorized[x.category] ?
        commandsCategorized[x.category].push(x) :
        commandsCategorized[x.category] = [x]
      ) :
      commandsCategorized.Uncategorized.push(x)
  );
  if (commandsCategorized.Uncategorized.length == 0) delete commandsCategorized.Uncategorized;
  return [commandsList, commandsCategorized];
}

async function updateSlashCommands(endpoint) {
  nonlogmsg(`Updating slash commands`);
  
  var currCmds = await endpoint.get();
  var currCmdsObj = {};
  currCmds.forEach(x => currCmdsObj[x.name] = x);
  
  var commandsToDelete = currCmds.map(x => x.name).filter(x => !commandColl.has(x) || (commandColl.get(x).flags & 0b100010) != 0b100010);
  var commandsToUpdate = currCmds.map(x => x.name).filter(x => {
    if (!commandColl.has(x) || (commandColl.get(x).flags & 0b100010) ^ 0b100010) return false;
    let obj = commandColl.get(x);
    obj = {
      description: obj.description_slash || obj.description,
      options: obj.options,
    };
    return currCmdsObj[x].description != obj.description ||
      (currCmdsObj[x].options || []).length < (obj.options || []).length ||
      (currCmdsObj[x].options || []).some((y, i) => {
        return y.type != obj.options[i].type ||
          y.name != obj.options[i].name ||
          y.description != obj.options[i].description ||
          y.required != obj.options[i].required;
      });
  });
  var commandsToAdd = commands.map(x => x.name).filter(x => !(x in currCmdsObj) && (commandColl.get(x).flags & 0b100010) == 0b100010);
  
  var commandsToUpsert = [ ...commandsToUpdate, ...commandsToAdd ];
  
  for (var i = 0; i < commandsToDelete.length; i++) {
    nonlogmsg(`Deleting ${commandsToDelete[i]}`);
    await endpoint(currCmdsObj[commandsToDelete[i]].id).delete();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  for (var i = 0; i < commandsToUpsert.length; i++) {
    nonlogmsg(`Upserting ${commandsToUpsert[i]}`);
    let obj = commandColl.get(commandsToUpsert[i]);
    obj = {
      name: obj.name,
      description: obj.description_slash || obj.description,
      options: obj.options,
    };
    await endpoint.post({ data: obj });
    await new Promise(r => setTimeout(r, 1000));
  }
  
  nonlogmsg(`Done updating slash commands`);
}
async function deleteSlashCommands(endpoint) {
  nonlogmsg(`Deleting slash commands`);
  
  var currCmds = await endpoint.get();
  
  for (var i = 0; i < currCmds.length; i++) {
    nonlogmsg(`Deleting ${currCmds[i].name}`);
    await endpoint(currCmds[i].id).delete();
    await new Promise(r => setTimeout(r, 1000));
  }
  
  nonlogmsg(`Done deleting slash commands`);
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
  nonlogmsg(`Logged in as ${client.user.tag}!`);
  
  updateStatus();
  
  /*deleteSlashCommands(client.api.applications(client.user.id).guilds('688806155530534931').commands)
    .then(_ => updateSlashCommands(client.api.applications(client.user.id).commands);*/
  //deleteSlashCommands(client.api.applications(client.user.id).guilds('688806155530534931').commands);
  updateSlashCommands(client.api.applications(client.user.id).commands);
  
  readytime = new Date();
  
  if (props.feat.loaddms) props.saved.misc.dmchannels.forEach(x => client.channels.fetch(x));
});

client.on('guildCreate', guild => {
  nonlogmsg(`Joined a new guild: ${guild.name}`);
  
  updateStatus();
});

client.on('guildDelete', guild => {
  nonlogmsg(`Left a guild: ${guild.name}`);
  
  updateStatus();
});

client.on('reconnecting', () => {
  nonlogmsg(`Reconnecting!`);
});

client.on('disconnect', () => {
  nonlogmsg(`Disconnect!`);
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

client.ws.on('INTERACTION_CREATE', async (...args) => {
  try {
    if (handlers.event['INTERACTION_CREATE']) {
      if (handlers.event['INTERACTION_CREATE'].constructor == Function) handlers.event['INTERACTION_CREATE'](...args);
      else await handlers.event['INTERACTION_CREATE'](...args);
    }
  } catch (e) {
    console.error('ERROR, something bad happened');
    console.error(e.stack);
  }
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
