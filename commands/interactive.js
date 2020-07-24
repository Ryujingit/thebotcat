module.exports = [
  {
    name: 'avatar',
    full_string: false,
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    public: true,
    execute(msg, argstring, command, args) {
      let targetMember;
      if (!msg.mentions.members.first()) {
        targetMember = msg.guild.members.get(msg.author.id);
      } else {
        targetMember = msg.mentions.members.first();
      }
      
      let avatarEmbed = new Discord.RichEmbed()
        .setImage(targetMember.user.displayAvatarURL)
        .setColor(targetMember.displayHexColor);
      msg.channel.send(avatarEmbed);
    }
  },
  {
    name: 'coinflip',
    full_string: false,
    description: '`!coinflip` returns tails or heads with 50% probability each',
    public: true,
    execute(msg, argstring, command, args) {
      if (Math.random() < 0.5) {
        msg.channel.send('I\'m flipping a coin, and the result is...: tails!');
      } else {
        msg.channel.send('I\'m flipping a coin, and the result is...: heads!');
      }
    }
  },
  {
    name: 'rps',
    full_string: false,
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    public: true,
    execute(msg, argstring, command, args) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = args[0];
      if (!uReply) return msg.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return msg.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = Math.floor(Math.random() * replies.length);
      
      if (replies[result] == uReply) {
        console.log(replies[result]);
        return msg.channel.send('It\'s a tie! We had the same choice.');
      } else if (uReply == 'rock') {
        console.log(replies[result]);
        if (replies[result] == 'paper') return msg.channel.send('I won!');
        else return msg.channel.send('You won!');
      } else if (uReply == 'scissors') {
        console.log(replies[result]);
        if (replies[result] == 'rock') return msg.channel.send('I won!');
        else return msg.channel.send('You won!');
      } else if (uReply == 'paper') {
        console.log(replies[result]);
        if (replies[result] == 'scissors') return msg.channel.send('I won!');
        else return msg.channel.send('You won!');
      }
    }
  },
];