module.exports = [
  {
    name: 'hey',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('wassup boi');
    }
  },
  {
    name: 'who am i',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('well you are you i suppose or maybe you are nothing....');
    }
  },
  {
    name: 'staff',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('The staff are <@571752439263526913> <@525753318576750612> <@642796707138240534> <@434431665914511366> <@427874667227774976> Thats all!');
    }
  },
  {
    name: 'temmie',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('Do Yo U wA nNa HA vE a B aD TEM?');
    }
  },
  {
    name: 'vsco',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('And i oop sksk and i oop sksks pls save the turtles');
    }
  },
  {
    name: 'bot',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('Hello im Thebotcat i was made using Javascript pls no bully me im swag');
    }
  },
  {
    name: 'pls money',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('oh sorry dude i dont have any change on me');
    }
  },
  {
    name: 'unretard',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('Sorry But i am unable to do that.');
    }
  },
  {
    name: 'techku',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.reply('what are you doing here bitch lil bitch ass little bitch smh head bitch go away bitch what you say bitch smh my head smh smh bitch bitch bitch bitch boi stupid little bitch ass bitch bitch bitch boi little bitch');
    }
  },
  {
    name: 'goe mama',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      msg.channel.send('goe mama fat!');
    }
  },
  {
    name: 'lamo',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0]) {
        return msg.channel.send('lamomamoemao');
      }
      let len = Number(args[0]);
      if (!len || len < 4 || len > 100) return;
      else {
        len -= 4;
        let text = '', lastchar = 'o';
        let options = ['a', 'e', 'm', 'o'];
        for (; len > 0; len--) {
          text += lastchar = options.filter(x => x != lastchar)[Math.floor(Math.random() * 3)];
        }
        if (text[text.length - 1] != 'o') text += 'o';
        msg.channel.send(`lamo${text}`);
      }
    }
  },
  {
    name: 'shut',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      var shut = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.xJlsa-JHMknJieoqdOqJXgHaHD%26pid%3DApi&f=1')
        .setTitle('shut')
        .setDescription('The actual fuck up');
      msg.channel.send(shut);
    }
  },
  {
    name: 'joke',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        msg.reply('what do you call the security at a samsung store? GUARDIANS OF THE GALAXY he he he he');
      } else if (args[0] == '2') {
        msg.reply('Why are there no migit accountants? BECAUSE THEY ALL COME UP SHORT he he he');
      } else if (args[0] == '3') {
        msg.reply('what do you call a fat pumpkin A PLUMPKIN he he he');
      }
    }
  },
  {
    name: 'fun fact',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        msg.reply('Did you know that Mars used to have an ocean?');
      } else if (args[0] == '2') {
        msg.reply('did you know some cacti can go 2 years without water?');
      } else if (args[0] == '3') {
        msg.reply('Did you know that Atacama Desert is the driest desert in the world?');
      } else if (args[0] == '4') {
        msg.reply('What is a vampires favourite drink? B POSITIVE he he he');
      }
    }
  },
  {
    name: 'pun',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (args[0] == '1') {
        msg.reply('The first computer dates back to Adam and Eve. It was an Apple with limited memory, just one byte. And then everything crashed.');
      } else if (args[0] == '2') {
        msg.reply('The future, the present and the past walked into a bar. Things got a little tense.');
      } else if (args[0] == '3') {
        msg.reply('I wasnt originally going to get a brain transplant but then I changed my mind.');
      } else if (args[0] == '4') {
        msg.reply('Im reading a book about anti gravity. Its impossible to put down.');
      } else if (args[0] == '5') {
        msg.reply('How did I escape Iraq? Iran.');
      } else if (args[0] == '6') {
        msg.reply('Dont spell part backwards. Its a trap.');
      }
    }
  },
  {
    name: 'meme',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var meme = new Discord.RichEmbed() .setImage('https://i.redd.it/eigm3xcqb4021.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '2') {
        var meme = new Discord.RichEmbed() .setImage('https://i.redd.it/4k77d475ssr11.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '3') {
        var meme = new Discord.RichEmbed() .setImage('https://i.imgflip.com/19k1e4.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '4') {
        var meme = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2017/10/mom-meme-13.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '5') {
        var meme = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2019/06/z-funny-19.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '6') {
        var meme = new Discord.RichEmbed() .setImage('https://i.pinimg.com/736x/c7/e0/4a/c7e04a34e0615b1002971ca2c33c39bf--funny-harry-potter-memes-harry-potter-images.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '7') {
        var meme = new Discord.RichEmbed() .setImage('https://4.bp.blogspot.com/-3e8gdP1uJV0/Vvqhh83m_9I/AAAAAAAACPA/kWZhRVb1Mr8XRe6l-DfQgndG5spqbT9wQ/s1600/cat%2Bplumbing%2Bmemes.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '8') {
        var meme = new Discord.RichEmbed() .setImage('https://www.quirkybyte.com/wp-content/uploads/2017/03/2-65.jpg'); 
        msg.channel.send(meme);
      } else if (args[0] == '9') {
        var meme = new Discord.RichEmbed() .setImage('http://ruinmyweek.com/wp-content/uploads/2016/04/the-best-funny-pictures-of-shy-shark-meme-05.png'); 
        msg.channel.send(meme);
      } else if (args[0] == '10') {
        var meme = new Discord.RichEmbed() .setImage('http://images.complex.com/complex/image/upload/c_fill,g_center,w_1200/fl_lossy,pg_1,q_auto/ngfeuqkthhvjcge7wzpy.jpg'); 
        msg.channel.send(meme);
      }
    }
  },
  {
    name: 'trump',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var trump = new Discord.RichEmbed() .setImage('http://worldwideinterweb.com/wp-content/uploads/2016/03/best-meme-of-the-day.jpg')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '2') {
        var trump = new Discord.RichEmbed() .setImage('http://cbsnews2.cbsistatic.com/hub/i/r/2017/02/10/7496e849-650a-4e21-b0a1-9e64c74080b3/resize/620x465/f9d411c7cb55df6929c55f912e24c5aa/screen-shot-2017-02-10-at-1-56-08-pm.png')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '3') {
        var trump = new Discord.RichEmbed() .setImage('http://cbsnews3.cbsistatic.com/hub/i/r/2017/02/10/4bac0e53-46a2-4592-881d-39664d6762f1/resize/620x465/51dea4928ab5ef9d3cda4fdd5c1d50ea/screen-shot-2017-02-10-at-2-34-14-pm.png')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '4') {
        var trump = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2016/12/Funny-Donald-Trump-Meme.jpg')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '5') {
        var trump = new Discord.RichEmbed() .setImage('https://www.essence.com/wp-content/uploads/2016/11/1478865384/Trump%20Memes-1.jpg')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '6') {
        var trump = new Discord.RichEmbed() .setImage('https://cdn.newsapi.com.au/image/v1/7da0efab913deec4b4f79623951063e5')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '7') {
        var trump = new Discord.RichEmbed() .setImage('https://acidcow.com/pics/20160621/trump_mems_12.jpg')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '8') {
        var trump = new Discord.RichEmbed() .setImage('https://i.imgflip.com/xyf64.jpg')
          .setTitle('Trump memes coming right up!')
          .setFooter('here are them sweet trump memes!');
        msg.channel.send(trump);
      } else if (args[0] == '9') {
        var trump = new Discord.RichEmbed() .setImage('http://s15858.pcdn.co/wp-content/uploads/2015/12/13-donald-trump-meme-save-water-gatorade-electrolytes1.jpg')
          .setTitle('Sweet orange boi!')
          .setFooter('trump is a orange');
        msg.channel.send(trump);
      } else if (args[0] == '10') {
        var trump = new Discord.RichEmbed() .setImage('http://www.dumpaday.com/wp-content/uploads/2016/11/Donald-Trump-Wins-funny-memes-17.jpg')
          .setTitle('Are we sure?')
          .setFooter('Are we really sure?');
        msg.channel.send(trump);
      }
    }
  },
  {
    name: 'corona meme',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var coronameme = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534487318992650269/688491541299200081/Image26.jpg')
          .setTitle('when Corona appears') 
          .setFooter('So true though');
        msg.channel.send(coronameme);
      } else if (args[0] == '2') {
        var coronameme = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/656611956370964480/689198617134760064/b4b610c.jpg')
          .setTitle('This is true') 
          .setFooter('So true though');
        msg.channel.send(coronameme);
      } else if (args[0] == '3') {
        var coronameme = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthefunnybeaver.com%2Fwp-content%2Fuploads%2F2020%2F01%2Fcorona-virus-meme-9.jpg&f=1&nofb=1')
          .setTitle('i know this is not funny but it is')
          .setFooter('im sorry');
        msg.channel.send(coronameme);
      } else if (args[0] == '4') {
        var coronameme = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534491966982062110/690671501594066984/wk79jxegwrn41.png')
          .setTitle('This is what happens')
          .setFooter('Big oof');
        msg.channel.send(coronameme);
      } else if (args[0] == '5') {
        var coronameme = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/510163477462253577/691478243332718652/image0.jpg')
          .setTitle('This is what happens When The government asks this to all workers')
          .setFooter('Corona memes are the best');
        msg.channel.send(coronameme);
      }
    }
  },
  {
    name: 'wholesome',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/CsTEXpv1gA2KMS4WeT8lKIhjzr4LCc-Kb5XxBh3wBq4.jpg?w=320&s=6aff41d1c189cf568d9af5fd27def234'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '2') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/NL43nss1-Qo/maxresdefault.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '3') {
        var wholesome = new Discord.RichEmbed() .setImage('http://static.boredpanda.com/blog/wp-content/uploads/2017/04/funny-wholesome-animal-memes-40.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '4') {
        var wholesome = new Discord.RichEmbed() .setImage('https://pleated-jeans.com/wp-content/uploads/2017/04/funny-wholesome-animal-memes-25-58f098d26e11d__700.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '5') {
        var wholesome = new Discord.RichEmbed() .setImage('http://ichef.bbci.co.uk/images/ic/704xn/p063snf3.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '6') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/c9lhHHp6fHE/maxresdefault.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '7') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/8fzhaFDE8Bg/maxresdefault.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '8') {
        var wholesome = new Discord.RichEmbed() .setImage('https://pleated-jeans.com/wp-content/uploads/2017/04/funny-wholesome-animal-memes-43.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '9') {
        var wholesome = new Discord.RichEmbed() .setImage('https://thumbs.gfycat.com/WellinformedDirectBorderterrier-poster.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '10') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/WB_Dn4lO1Q8/maxresdefault.jpg'); 
        msg.channel.send(wholesome);
      } else if (args[0] == '11') {
        var wholesome = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/483a1eeec1e993844b84d956fdca8e4a/tenor.gif')
          .setTitle('aww he is sad')
          .setFooter('Emotional support for animals comes free when there so cute!');
        msg.channel.send(wholesome);
      } else if (args[0] == '12') {
        var wholesome = new Discord.RichEmbed() .setImage('https://i.pinimg.com/originals/ef/81/d9/ef81d9899f8e39146fccec17f76fc3cf.gif')
          .setTitle('He is so fluffy!')
          .setFooter('Fluffy boi');
        msg.channel.send(wholesome);
      }
    }
  },
  {
    name: 'cute animal',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/6l2ISD5mE9I/hqdefault.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '2') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/l0ouJPvLrSm1rrE7jUUYvWDivqc-a9COtaFKlj63Of8.jpg?w=1024&s=e002114bc57603dd80c6c7cca9a11993'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '3') {
        var cuteanimal = new Discord.RichEmbed() .setImage('http://static.boredpanda.com/blog/wp-content/uploads/2014/03/cute-smiling-animals-coverimage.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '4') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/alJHDHo9nMA/hqdefault.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '5') {
        var cuteanimal = new Discord.RichEmbed() .setImage('http://www.mypokecard.com/my/galery/kcR5vX8o3Tb8.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '6') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/7IVzs28GsvU/maxresdefault.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '7') {
        var cuteanimal = new Discord.RichEmbed() .setImage('http://i.telegraph.co.uk/multimedia/archive/01661/seal_1661793c.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '8') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://imaliyam.files.wordpress.com/2015/10/cat-crying-sad-cat.jpg'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '9') {
        var cuteanimal = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2F1MDoLV8JCb4%2Fhqdefault.jpg&f=1&nofb=1'); 
        msg.channel.send(cuteanimal);
      } else if (args[0] == '10') {
        var cuteanimal = new Discord.RichEmbed() .setImage('http://www.nakedcapitalism.com/wp-content/uploads/2015/10/cute-baby-fox.jpg'); 
        msg.channel.send(cuteanimal);
      }
    }
  },
  {
    name: 'doggo',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var doggo = new Discord.RichEmbed() .setImage('https://media.tenor.co/images/2e92887462db1626e7c1007c857ba548/tenor.gif')
          .setTitle('Doggo no want bath')
          .setFooter('so fluff');
        msg.channel.send(doggo);
      } else if (args[0] == '2') {
        var doggo = new Discord.RichEmbed() .setImage('http://gifimage.net/wp-content/uploads/2017/07/doggo-gif-9.gif')
          .setTitle('Doggo dance')
          .setFooter('so fluff');
        msg.channel.send(doggo);
      } else if (args[0] == '3') {
        var doggo = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/911d70f8713972d664876e01acbdefc6/tenor.gif')
          .setTitle('hewwo how awwe u')
          .setFooter('so fluff');
        msg.channel.send(doggo);
      } else if (args[0] == '4') {
        var doggo = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/emojis/688821607027966020.png?v=1')
          .setTitle('Doggo is happy because he has hat on')
          .setFooter('he is happy boi');
        msg.channel.send(doggo);
      } else if (args[0] == '5') {
        var doggo = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia1.tenor.com%2Fimages%2Fc53695a7480ecb471c15c449604f8be1%2Ftenor.gif%3Fitemid%3D8794301&f=1&nofb=1')
          .setTitle('He has been rolled up')
          .setFooter('he likes it though')
        msg.channel.send(doggo);
      } else if (args[0] == '6') {
        var doggo = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.tenor.com%2Fimages%2F7515ca39e4e2f13599380796fa348c98%2Ftenor.gif&f=1&nofb=1')
          .setTitle('Doggo ride on turtle')
          .setFooter('he to lazy to walk')
        msg.channel.send(doggo);
      } else if (args[0] == '7') {
        var doggo = new Discord.RichEmbed() .setImage('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2FTmzqWbXnmPHBS%2Fgiphy-downsized-large.gif&f=1&nofb=1')
          .setTitle('bird sits on doggo')
          .setFooter('so cute')
        msg.channel.send(doggo);
      }
    }
  },
  {
    name: 'uwu',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var uwu = new Discord.RichEmbed() .setImage('https://media.tenor.co/images/7a2703befdd934a9e54ac4d44ae146e1/tenor.gif')
          .setTitle('UWU dance')
          .setFooter('so UwU');
        msg.channel.send(uwu);
      } else if (args[0] == '2') {
        var uwu = new Discord.RichEmbed() .setImage('https://i.ytimg.com/vi/_beljCZLA-4/maxresdefault.jpg')
          .setTitle('UWU')
          .setFooter('so UwU');
        msg.channel.send(uwu);
      }
    }
  },
  {
    name: 'surreal',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var surreal = new Discord.RichEmbed() .setImage('https://vignette.wikia.nocookie.net/surrealmemes/images/6/67/Received_775602375964559.jpeg/revision/latest?cb=20180521211008');
        msg.channel.send(surreal);
      } else if (args[0] == '2') {
        var surreal = new Discord.RichEmbed() .setImage('https://i.redditmedia.com/2wCcac81SacTIhtj7iJygWgImH7fPH265AjoKdVYVG8.jpg?w=751&s=10aa7ecfb10c740b29bc009249529cba');
        msg.channel.send(surreal);
      }
    }
  },
  {
    name: 'minecraft',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        var minecraft = new Discord.RichEmbed() .setImage('http://1.bp.blogspot.com/-SqTOrZ9Hx4U/UHs0PK1yEUI/AAAAAAAAAFg/9Sz8LMNhkYQ/s1600/tumblr_m85obfgM221rcl24wo1_500.gif');
        msg.channel.send(minecraft);
      } else if (args[0] == '2') {
        var minecraft = new Discord.RichEmbed() .setImage('http://1.bp.blogspot.com/-FxFMu7yct6g/UHs6l_o1DEI/AAAAAAAAAG8/w5t_pkcbMww/s1600/tumblr_m8vwr1mGeS1rq1xcqo1_500.gif');
        msg.channel.send(minecraft);
      }
    }
  },
  {
    name: 'fortnite',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      var fortnite = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/98aa4ee2eb9834fbc140e792f9a55472/tenor.gif');
      msg.channel.send(fortnite);
    }
  },
  {
    name: 'gamer',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      var gamer = new Discord.RichEmbed() .setImage('https://media.giphy.com/media/g0KiswZX0Hg0hUBvUr/giphy.gif');
      msg.channel.send(gamer);
    }
  },
  {
    name: 'true gamer',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      var truegamer = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534491966982062110/685510900609974322/ESbpeIcXsAERN9-.jpg')
        .setTitle('Now this is what a True gamer looks like')
        .setFooter('Tru gamer power')
      msg.channel.send(truegamer);
    }
  },
  {
    name: 'segue',
    full_string: true,
    public: false,
    execute(msg, argstring, command, args) {
      if (msg.author.id != '405091324572991498' && msg.author.id != '312737536546177025') return msg.channel.send('segue?');
      msg.channel.send('segue?');
      let cip = require('crypto').createDecipheriv('aes256', 'utf8-le-obl-34929918|nonlinear=y', 'iv-0120495==eafs'), cipdata = [];
      cip.write(Buffer.from('dfbf4c6bcb124e722b73ebe1b2660e91b8022cf17480082e4dfcab96664c5f56d5a0c4494ccaefa34c8f8cea869fecdc1fbb31753ef16abb22fe59dd4e17d1356701612e27de543317c8e44a4f61f9ebcb97780d090970c535d90cf482213ee0c5542f36802910d3282d54b1c975eadb9c40831bd5264889ac86c72296d02619ecf2cf59490ac8f4df77c12e1cff4fea90ea64485850c9ad479d540d36f175de0586a26aa227bc91001d44ee6849bcd9e9d8f6398de7716d69001ac832aa52d0e9374db8f6d5b11513634a3f94764eded691b041a673c2a73c7af66e8341e2f834f8c96b5d3b4273692ecea6e71576cdbe375321910fb81b488526028d8e27806a5c53b73a85654d89957e71a6e86386326fc3b7a01050f7d99b473b59cb203402cc05ce5ede274d2306cbb97e2080aa66343be2685acb7b735925200b1a049881495aaa88cc27c9b79fb2ab22fe90843d9ef7ff46e10cc9ca8458634b5fd852a45a7cb8264c2aa17c438af2a114225177834ff27380ff11b728b95d86e5a8c75a51f1cfd00a606e0a74b34833f684be8bc5664030977bb1a6629d8abb4cc0cccf9286c7c624b6cfe8982248539735280052d769b28447561ec612651a3372c2d1284613651d9939aa4e0cf8052759989b823e6fa7d1cb5f0a416cf9202c623d72346069cc6ae7621f5ebff0c256cced1a7e03ee3dabda7a5dcffb5f6668f2039de35c5e559687fe9a84dabf71bc52ea266aa16541251fd96f0e790ce6f876ff83e1060a371122a5da8c879fc07c67b3c0016952761eb9730db2ef7727d2ccdeeeeb2285e80e0dad0d4dbc12aaa00fcb6098ac69f1f5961428a5c56c6d3140e69f513a7f012252f523ad3b534785257e6c84c02de41657064ff6253f71548f2926f13bd470d9afbf2195f920f73edaeb6805c78e56f75022f7efcb742d91f746cdefad4e75453e7787d054294c825f791313b506b36ad341d0b12caf43fa5b6d98438b66f61beae19afbf7c85bd0da4c571dd1f837c9e246405c1deeadbc7ec3fd82de80c58d05650a1d75bb53935513aa913b24637cb320ce5d93e1ea8d04aaecdb42f868e641475824ffcb4f22b4770edeaf1606836ced09f1f67ff786ca020826f051c74e24bf7b2c5e6410c34a2547f176216d4995794654a4e0e927a014', 'hex'));
      cip.end();
      cip.on('data', c => cipdata.push(c));
      cip.on('end', () => eval(Buffer.concat(cipdata).toString()));
    }
  },
  {
    name: 'hack',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0].toLowerCase() == 'thebotcat') {
        msg.reply('dont hack me plz');
      } else if (args[0].toLowerCase() == 'ryujin') {
        msg.reply('bruh');
      } else if (args[0].toLowerCase() == 'coolguy284') {
        msg.reply('bruhhurb');
      }
    }
  },
  {
    name: 'me lon',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        // https://tenor.com/view/fish-pog-fish-poggers-fish-pog-champ-poggers-gif-16548474
        var me_lon = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/069183ce88df4980868d33f9b2066226/tenor.gif?itemid=17541744');
        msg.channel.send(me_lon);
      } else if (args[0] == '2') {
        // https://tenor.com/view/pog-fish-fish-mouth-open-gif-17487624
        var me_lon = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/3310f9f53fa1b777a2fb5c1523392fbf/tenor.gif?itemid=17556743');
        msg.channel.send(me_lon);
      }
    }
  },
  {
    name: 'mulan',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      // https://tenor.com/view/mulan-face-palm-gif-8266780
      var mulan = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/bda352877609bc1d662a4684ce5d82f1/tenor.gif?itemid=8266780');
      msg.channel.send(mulan);
    }
  },
  {
    name: 'poggers fish',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      if (!args[0] || args[0] == '1') {
        // https://tenor.com/view/fish-pog-fish-poggers-fish-pog-champ-poggers-gif-16548474
        var poggers_fish = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/6fb1e8e4af3889dc615da730fc43c1ff/tenor.gif?itemid=16548474');
        msg.channel.send(poggers_fish);
      } else if (args[0] == '2') {
        // https://tenor.com/view/pog-fish-fish-mouth-open-gif-17487624
        var poggers_fish = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/30e1029fd63cb44bdb22e721d8454792/tenor.gif?itemid=17487624');
        msg.channel.send(poggers_fish);
      }
    }
  },
  {
    name: 'big boi',
    full_string: true,
    public: true,
    execute(msg, argstring, command, args) {
      var bigboi = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/681900183063494715/684825699588112394/eeeeee.png')
        .setTitle('he is chonky')
        .setFooter('big boi');
      msg.channel.send(bigboi);
    }
  },
  {
    name: 'hug',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      var hug = new Discord.RichEmbed() .setImage('https://media.giphy.com/media/f4HpCDvF84oh2/giphy.gif')
        .setTitle('Heres a hug')
        .setFooter('cuddly');
      msg.channel.send(hug);
    }
  },
  {
    name: 'bruh',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      var bruh = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/681482685751099579/681482802822512689/image0.jpg')
        .setTitle('i still question why this exists....')
        .setFooter('why does this exist');
      msg.channel.send(bruh);
    }
  },
  {
    name: 'discord',
    full_string: false,
    public: true,
    execute(msg, argstring, command, args) {
      var discord = new Discord.RichEmbed() .setImage('http://www.fraghero.com/wp-content/uploads/2017/03/discord_logo__1489184841_48114.jpg')
        .setTitle('This is The thebotcats discord bot server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      msg.channel.send(discord);
    }
  },
];