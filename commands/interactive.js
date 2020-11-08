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
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate (<https://mathjs.org/docs/expressions/index.html> for info)\n' +
      'Note: a delete command has been added to delete a property from an object:\n' +
      '  `delete(obj, prop)` to delete `prop` from `obj` or\n' +
      '  `delete(prop)` to delete `prop` from global scope',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();
      let expr = argstring, res;
      console.debug(`calculating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(expr)}`);
      let user = props.saved.user[msg.author.id];
      if (!user)
        user = props.saved.user[msg.author.id] = common.getEmptyUserObject(props.saved.guilds[msg.guild.id]);
      let scope = user.calc_scope_working;
      global.calccontext = scope;
      let promise;
      try {
        if (doWorkers) {
          // shared array buffer is used to access properties of scope, due to the worker-side of the code having to be synchronous
          let buffer = new SharedArrayBuffer(8 + 65536), obj;
          let i32arr = new Int32Array(buffer);
          let doLoop = true;
          let doLoopChecker = () => doLoop;
          let loopFunc = (async () => {
            let obj, action;
            while (doLoop) {
              try { action = await common.receiveObjThruBuffer(buffer, i32arr, doLoopChecker); } catch (e) { if (e instanceof common.BreakError) return; throw e; }
              try {
                switch (action.type) {
                  case 'has':
                    obj = common.arrayGet(scope, action.props);
                    await common.sendObjThruBuffer(buffer, i32arr, action.prop in obj, doLoopChecker);
                    break;
                  case 'get':
                    let parentobj = common.arrayGet(scope, action.props);
                    if (!(action.prop in parentobj)) {
                        await common.sendObjThruBuffer(buffer, i32arr, { object: false }, doLoopChecker);
                    } else {
                      obj = parentobj[action.prop];
                      if (action.prop == 'toString' && typeof obj == 'function')
                        await common.sendObjThruBuffer(buffer, i32arr, { val: parentobj.toString() }, doLoopChecker);
                      else if (typeof obj != 'object' && typeof obj != 'function')
                        await common.sendObjThruBuffer(buffer, i32arr, { val: obj }, doLoopChecker);
                      else if (Object.getPrototypeOf(obj) == Object.prototype)
                        await common.sendObjThruBuffer(buffer, i32arr, { object: true }, doLoopChecker);
                      else
                        await common.sendObjThruBuffer(buffer, i32arr, JSON.stringify(obj, math.replacer), doLoopChecker);
                    }
                    break;
                  case 'set':
                    obj = common.arrayGet(scope, action.props);
                    obj[action.prop] = JSON.parse(action.val, math.reviver);
                    await common.sendObjThruBuffer(buffer, i32arr, null, doLoopChecker);
                    break;
                  case 'delete':
                    obj = common.arrayGet(scope, action.props);
                    await common.sendObjThruBuffer(buffer, i32arr, delete obj[action.prop], doLoopChecker);
                    break;
                  case 'ownKeys':
                    obj = common.arrayGet(scope, action.props);
                    await common.sendObjThruBuffer(buffer, i32arr, Reflect.ownKeys(obj), doLoopChecker);
                    break;
                  case 'stop':
                    doLoop = false;
                    break;
                }
              } catch (e) {
                if (e instanceof common.BreakError) {
                  doLoop = false;
                  Atomics.store(i32arr, 0, 0);
                  return;
                }
                await common.sendObjThruBuffer(buffer, i32arr, e, doLoopChecker);
              }
            }
          })();
          try {
            res = await pool.exec('mathevaluate', [msg.author.id, expr, buffer]);
            doLoop = false;
            await loopFunc;
          } catch (e) {
            if (doLoop) doLoop = false;
            throw e;
          }
          //console.log('monee');
          //console.log(doLoop);
          //console.log(doLoopChecker());
        } else {
          mathVMContext.expr = expr;
          mathVMContext.scope = scope;
          vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, {timeout: common.isDeveloper(msg) ? 1000 : 100});
          res = mathVMContext.res;
          if (res === undefined) res = 'undefined';
          else if (res === null) res = 'null';
          else if (typeof res == 'string') res = util.inspect(res);
          else if (Object.getPrototypeOf(res) == Object.prototype) {
            res = math.matrix([res]).toString();
            res = res.slice(1, res.length - 1);
          } else res = res.toString();
          if (res.length > 1900) res = res.slice(0, 1900) + '...';
          if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
          else res = `Result: ${res}`;
        }
        try {
          console.log(res);
          promise = await msg.channel.send(res);
        } catch (e) {
          promise = await msg.channel.send('Error: result too big to fit in discord message');
        }
      } catch (e) {
        res = e.toString();
        console.error(res);
        if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
          promise = msg.channel.send(`Error: expression timeout after ${res.slice(40, Infinity)}`);
        } else {
          promise = msg.channel.send(res);
        }
      } finally {
        global.calccontext = null;
      }
      let scopeSerialized = JSON.serialize(scope, math.replacer);
      if (scopeSerialized != user.calc_scope) {
        user.calc_scope = scopeSerialized;
        schedulePropsSave();
      }
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
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject(props.saved.guilds[msg.guild.id]);
      console.debug(`calc_scopeview from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let scope = props.saved.calc_scopes[msg.author.id], text;
      let promise;
      if (scope) {
        try {
          text = JSON.stringify(scope, math.replacer);
          if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope', description: text } };
          promise = msg.channel.send(text);
          console.log(text);
        } catch (e) {
          console.error(e);
          try {
            text = `Scope too big to fit in a discord message, variables:\n${Reflect.ownKeys(scope).join(', ')}`
            if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope', description: text } };
            promise = msg.channel.send(text);
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
      if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();
      console.debug(`calc_scopeclear from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}`);
      let user = props.saved.user[msg.author.id];
      if (!user)
        user = props.saved.user[msg.author.id] = common.getEmptyUserObject(props.saved.guilds[msg.guild.id]);
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
  {
    name: 'echoargs',
    full_string: false,
    public: false,
    execute(msg, cmdstring, command, argstring, args) {
      return msg.channel.send(cmdstring.split('').map(x => ((x == '<') ? ('\\' + x) : x)).join(''));
    }
  },
];
