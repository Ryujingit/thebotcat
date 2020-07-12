module.exports = [
  {
    name: 'hey',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('wassup boi');
    }
  },
  {
    name: 'Ameyyuu',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('Ameyyuu is who made me thanks for asking!');
    }
  },
  {
    name: 'commit die',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('well just commit die?');
    }
  },
  {
    name: 'do i suck',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('I mean i suppose so but idk ask someone else im only a robot');
    }
  },
  {
    name: 'who am i',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('well you are you i suppose or maybe you are nothing....');
    }
  },
  {
    name: 'staff',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('The staff are <@571752439263526913> <@525753318576750612> <@642796707138240534> <@434431665914511366> <@427874667227774976> Thats all!');
    }
  },
  {
    name: 'temmie',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('Do Yo U wA nNa HA vE a B aD TEM?');
    }
  },
  {
    name: 'vsco',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('And i oop sksk and i oop sksks pls save the turtles');
    }
  },
  {
    name: 'reee',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
    }
  },
  {
    name: 'why am i stupid',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('i dont know why are you stupid?');
    }
  },
  {
    name: 'ur mom gay',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('well yeah she is...');
    }
  },
  {
    name: 'bot',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('Hello im Thebotcat i was made using Javascript pls no bully me im swag');
    }
  },
  {
    name: 'goose',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('Honk');
    }
  },
  {
    name: 'system 32',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('uninstall system 32 and you will get free vouchers');
    }
  },
  {
    name: 'pls money',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('oh sorry dude i dont have any change on me');
    }
  },
  {
    name: 'bitcoin',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('I have hacked all your devices if you do not give 1000000 bitcoin then you will never get them back');
    }
  },
  {
    name: 'unretard',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('Sorry But i am unable to do that.');
    }
  },
  {
    name: 'techku',
    full_string: true,
    execute(msg, argstring, command, args) {
      msg.reply('what are you doing here bitch lil bitch ass little bitch smh head bitch go away bitch what you say bitch smh my head smh smh bitch bitch bitch bitch boi stupid little bitch ass bitch bitch bitch boi little bitch');
    }
  },
  {
    name: 'shut',
    full_string: true,
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
    name: 'fun_fact',
    full_string: false,
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
    name: 'corona_meme',
    full_string: false,
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
    name: 'cute_animal',
    full_string: false,
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
    execute(msg, argstring, command, args) {
      var fortnite = new Discord.RichEmbed() .setImage('https://media.tenor.com/images/98aa4ee2eb9834fbc140e792f9a55472/tenor.gif');
      msg.channel.send(fortnite);
    }
  },
  {
    name: 'gamer',
    full_string: false,
    execute(msg, argstring, command, args) {
      var gamer = new Discord.RichEmbed() .setImage('https://media.giphy.com/media/g0KiswZX0Hg0hUBvUr/giphy.gif');
      msg.channel.send(gamer);
    }
  },
  {
    name: 'true gamer',
    full_string: true,
    execute(msg, argstring, command, args) {
      var truegamer = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/534491966982062110/685510900609974322/ESbpeIcXsAERN9-.jpg')
        .setTitle('Now this is what a True gamer looks like')
        .setFooter('Tru gamer power')
      msg.channel.send(truegamer);
    }
  },
  {
    name: 'monkaS',
    full_string: true,
    execute(msg, argstring, command, args) {
      var monkas = new Discord.RichEmbed() .setImage('https://media1.tenor.com/images/6c5e42878a150c038925bb3ff63077c5/tenor.gif?itemid=12246365')
        .setTitle('MonkaS')
        .setFooter('MonkaSS');
      msg.channel.send(monkas);
    }
  },
  {
    name: 'big boi',
    full_string: true,
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
    execute(msg, argstring, command, args) {
      var bruh = new Discord.RichEmbed() .setImage('https://cdn.discordapp.com/attachments/681482685751099579/681482802822512689/image0.jpg')
        .setTitle('i still question why this exists....')
        .setFooter('why does this exist');
      msg.channel.send(bruh);
    }
  },
  {
    name: 'patreon',
    full_string: false,
    execute(msg, argstring, command, args) {
      var patreon = new Discord.RichEmbed() .setImage('https://pmcvariety.files.wordpress.com/2017/05/patreon-logo-e1495085041531.jpg?w=700&h=393&crop=1')
        .setTitle('if you would like too support me in bettering my bot or other things support me here! https://www.patreon.com/user?u=19323140&fan_landing=true ')
        .setFooter('Thebotcats patreon');
      msg.channel.send(patreon);
    }
  },
  {
    name: 'discord',
    full_string: false,
    execute(msg, argstring, command, args) {
      var discord = new Discord.RichEmbed() .setImage('http://www.fraghero.com/wp-content/uploads/2017/03/discord_logo__1489184841_48114.jpg')
        .setTitle('This is The thebotcats discord bot server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      msg.channel.send(discord);
    }
  },
];