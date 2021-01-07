module.exports = [
  {
    name: 'coinflip',
    description: '`!coinflip` returns tails or heads with 50% probability each',
    flags: 14,
    execute(o, msg, rawArgs) {
      return msg.channel.send(`I\'m flipping a coin, and the result is...: ${Math.random() >= 0.5 ? 'heads' : 'tails'}!`);
    }
  },
  {
    name: 'roll',
    description: '`!roll d#|#` rolls a dice with the given number of sides',
    flags: 14,
    execute(o, msg, rawArgs) {
      let sides = (rawArgs[0] ? Number(rawArgs[0].replace(/[^0-9.e-]/g, '')) : 0) || 6;
      return msg.channel.send(`Result of rolling a d${sides}: ${1 + Math.floor(Math.random() * sides)}`);
    }
  },
  {
    name: 'randint',
    description: '`!randint <min> <max>` returns a random integer between min and max (inclusive)',
    flags: 14,
    execute(o, msg, rawArgs) {
      let min = Math.floor(Number(rawArgs[0])) || 0, max = Math.floor(Number(rawArgs[1])) || 1;
      return msg.channel.send(`Random integer between ${min} and ${max}: ${min + Math.floor(Math.random() * (max - min + 1))}`);
    }
  },
  {
    name: 'randfloat',
    description: '`!randfloat <min> <max>` returns a random real number between min and max (inclusive lower bound)',
    flags: 14,
    execute(o, msg, rawArgs) {
      let min = Number(rawArgs[0]) || 0, max = Number(rawArgs[1]) || 1;
      return msg.channel.send(`Random real number between ${min} and ${max}: ${min + Math.random() * (max - min)}`);
    }
  },
  {
    name: 'choice',
    description: '`!choice <choice1> [<choice2> ...]` picks a random option from the choices given',
    flags: 14,
    execute(o, msg, rawArgs) {
      let choice = Math.floor(Math.random() * rawArgs.length);
      choice = rawArgs[choice];
      if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(choice.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) {
        return msg.channel.send({ embed: { title: 'Random Choice', description: choice } });
      } else {
        return msg.channel.send(`Random choice: ${choice}`);
      }
    }
  },
  {
    name: 'rps',
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    flags: 14,
    execute(o, msg, rawArgs) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = rawArgs[0];
      if (!uReply) return msg.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return msg.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = replies[Math.floor(Math.random() * replies.length)];
      
      let status = common.rps(uReply, result);
      
      if (status == 0) {
        return msg.channel.send('It\'s a tie! We had the same choice.');
      } else if (status == 1) {
        return msg.channel.send(`I chose ${result}, I won!`);
      } else if (status == -1) {
        return msg.channel.send(`I chose ${result}, you won!`);
      }
    }
  },
  {
    name: 'calc',
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate (<https://mathjs.org/docs/expressions/index.html> for info)\n' +
      'Note: a delete command has been added to delete a property from an object:\n' +
      '  `delete(obj, prop)` to delete `prop` from `obj` or\n' +
      '  `delete(prop)` to delete `prop` from global scope\n' +
      '`!calc :view` to print out serialized JSON of your calc scope\n' +
      '`!calc :clear` to clear your calc scope',
    flags: 14,
    async execute(o, msg, rawArgs) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      let expr = o.argstring, res;
      console.debug(`calculating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(expr)}`);
      let user = props.saved.users[msg.author.id];
      if (!user) {
        user = props.saved.users[msg.author.id] = common.getEmptyUserObject(props.saved.guilds[msg.guild.id]);
        schedulePropsSave();
      }
      
      if (rawArgs[0] == ':view') {
        let scope = user.calc_scope_working, text;
        if (scope) {
          try {
            text = user.calc_scope;
            if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope', description: text } };
            console.log(text);
            return msg.channel.send(text);
          } catch (e) {
            console.error(e);
            try {
              text = `Scope too big to fit in a discord message, variables:\n${Reflect.ownKeys(scope).join(', ')}`
              if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope Variables', description: text } };
              console.log(text);
              return msg.channel.send(text);
            } catch (e) {
              console.error(e);
              console.log(text = `Scope variables too big to fit in a discord message, use \`!calc_scopeclear\` to wipe`);
              return msg.channel.send(text);
            }
          }
        } else {
          console.log(text = `You do not have a scope created yet, one is created when \`!calc\` is run`);
          return msg.channel.send(text);
        }
      } else if (rawArgs[0] == ':clear') {
        let text;
        if (user.calc_scope) {
          user.calc_scope = '{}';
          Reflect.ownKeys(user.calc_scope_working).forEach(x => delete user.calc_scope_working[x]);
          schedulePropsSave();
          console.log(text = `Cleared scope successfully`);
          return msg.channel.send(text);
        } else {
          console.log(text = `You do not have a scope created yet`);
          return msg.channel.send(text);
        }
      } else {
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
                      await common.sendObjThruBuffer(buffer, i32arr, true, doLoopChecker);
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
              if (!user.calc_scope_running) {
                try {
                  user.calc_scope_running = true;
                  res = await pool.exec('mathevaluate', [expr, buffer]);
                  if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
                  else res = `Result: ${res}`;
                  doLoop = false;
                  await loopFunc;
                } catch (e) { throw e; }
                finally {
                  user.calc_scope_running = false;
                }
              } else {
                res = await pool.exec('mathevaluate', [expr, buffer, 5]);
                if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
                else res = `Result: ${res}`;
                doLoop = false;
                await loopFunc;
              }
            } catch (e) {
              if (doLoop) doLoop = false;
              throw e;
            }
          } else {
            mathVMContext.expr = expr;
            mathVMContext.scope = scope;
            vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, {timeout: common.isDeveloper(msg) ? 1000 : 5});
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
            if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result (Error)', description: res } };
            promise = msg.channel.send(res);
          }
        } finally {
          global.calccontext = null;
        }
        let scopeSerialized = JSON.stringify(scope, math.replacer);
        if (scopeSerialized != user.calc_scope) {
          user.calc_scope = scopeSerialized;
          schedulePropsSave();
        }
        scopeSerialized = JSON.stringify(props.saved.users.default.calc_scope_working, math.replacer);
        if (scopeSerialized != props.saved.users.default.calc_scope) {
          props.saved.users.default.calc_scope = scopeSerialized;
          schedulePropsSave();
        }
        return promise;
      }
    }
  },
  {
    name: 'echoargs',
    flags: 12,
    execute(o, msg, rawArgs) {
      return msg.channel.send('rawArgs: ' + JSON.stringify(rawArgs).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    }
  },
];
