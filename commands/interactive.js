module.exports = [
  {
    name: 'avatar',
    full_string: false,
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      let targetMember;
      if (!msg.mentions.members.first())
        targetMember = msg.member;
      else
        targetMember = msg.mentions.members.first();
      
      let avatarEmbed = new Discord.MessageEmbed()
        .setTitle(`Avatar for ${targetMember.user.tag}`)
        .setImage(targetMember.user.displayAvatarURL())
        .setColor(targetMember.displayHexColor);
      return msg.channel.send(avatarEmbed);
    }
  },
  {
    name: 'coinflip',
    full_string: false,
    description: '`!coinflip` returns tails or heads with 50% probability each',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (Math.random() < 0.5) {
        return msg.channel.send('I\'m flipping a coin, and the result is...: tails!');
      } else {
        return msg.channel.send('I\'m flipping a coin, and the result is...: heads!');
      }
    }
  },
  {
    name: 'rps',
    full_string: false,
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = args[0];
      if (!uReply) return msg.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return msg.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = replies[Math.floor(Math.random() * replies.length)];
      
      let status = common.rps(uReply, result);
      
      let logbegin = `rock/paper/scissors requested by ${msg.author.tag}, they chose ${uReply}, i chose ${result}, `;
      if (status == 0) {
        logmsg(logbegin + 'tie');
        return msg.channel.send('It\'s a tie! We had the same choice.');
      } else if (status == 1) {
        logmsg(logbegin + 'i won');
        return msg.channel.send('I won!');
      } else if (status == -1) {
        logmsg(logbegin + 'they won');
        return msg.channel.send('You won!');
      }
    }
  },
  {
    name: 'calc',
    full_string: false,
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      let expr = argstring, res, text;
      console.debug(`calculating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(expr)}`);
      let scope;
      if (!(scope = props.saved.calc_scopes[msg.author.id])) {
        scope = props.saved.calc_scopes[msg.author.id] = {};
      }
      global.safecontext = false;
      let promise;
      try {
        res = math.evaluate(expr, scope);
        promise = msg.channel.send(text = `Result: ${res}`);
        console.log(text);
      } catch (e) {
        promise =  msg.channel.send(text = e.toString());
        console.error(text);
      } finally {
        global.safecontext = true;
      }
      schedulePropsSave();
      return promise;
    }
  },
  {
    name: 'calc_scopeview',
    full_string: false,
    description: '`!calc_scopeview` returns JSON of your variable scope',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      console.debug(`calc_scopeview from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let scope = props.saved.calc_scopes[msg.author.id], text;
      let promise;
      if (scope) {
        try {
          promise = msg.channel.send(text = JSON.stringify(scope, math.replacer));
          console.log(text);
        } catch (e) {
          console.error(e);
          try {
            promise = msg.channel.send(text = `Scope too big to fit in a discord message, variables:\n${Reflect.ownKeys(scope).join(', ')}`);
            console.log(text);
          } catch (e) {
            console.error(e);
            promise = msg.channel.send(text = `Scope variables too big to fit in a discord message, use \`!calc_scopeclear\` to wipe`);
            console.log(text);
          }
        }
      } else {
        promise = msg.channel.send(text = `You do not have a scope created yet, one is created when \`!calc\` is run`);
        console.log(text);
      }
      return promise;
    }
  },
  {
    name: 'calc_scopeclear',
    full_string: false,
    description: '`!calc_scopeclear` wipes your scope for the `!calc` command clean',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      console.debug(`calc_scopeclear from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let scope = props.saved.calc_scopes[msg.author.id], text;
      let promise;
      if (scope) {
        delete props.saved.calc_scopes[msg.author.id];
        promise = msg.channel.send(text = `Cleared scope successfully`);
        console.log(text);
        schedulePropsSave();
      } else {
        promise = msg.channel.send(text = `You do not have a scope created yet`);
        console.log(text);
      }
      return promise;
    }
  },
];
