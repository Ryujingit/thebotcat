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
      'Note: a delete function has been added to delete a property from an object:\n' +
      '  `delete(obj, prop)` to delete `prop` from `obj` or\n' +
      '  `delete(prop)` to delete `prop` from global scope\n' +
      '`!calc :view` to print out serialized JSON of your calc scope\n' +
      '`!calc :clear` to clear your calc scope',
    flags: 14,
    async execute(o, msg, rawArgs) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      let expr = o.argstring, res;
      nonlogmsg(`calculating from ${msg.author.tag} in ${msg.guild?msg.guild.name+':'+msg.channel.name:'dms'}: ${util.inspect(expr)}`);
      let user = props.saved.users[msg.author.id];
      if (!user) {
        if (rawArgs[0] == ':view' || rawArgs[1] == ':clear') return msg.channel.send('User object not created yet');
        else {
          user = props.saved.users[msg.author.id] = common.getEmptyUserObject(props.saved.guilds[msg.guild.id]);
          schedulePropsSave();
        }
      }
      
      if (rawArgs[0] == ':view') {
        let text;
        if (user.calc_scope.length <= 2000) {
          text = user.calc_scope;
          if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope', description: text } };
          console.log(text);
          return msg.channel.send(text);
        } else {
          let scopeVars = Reflect.ownKeys(JSON.parse(user.calc_scope)).join(', ');
          if (scopeVars.length <= 1950) {
            text = `Scope too big to fit in a discord message, variables:\n${scopeVars}`
            if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(text.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) text = { embed: { title: 'Scope Variables', description: text } };
            console.log(text);
            return msg.channel.send(text);
          } else {
            console.log(text = `Scope variables too big to fit in a discord message, use \`!calc :clear\` to wipe`);
            return msg.channel.send(text);
          }
        }
      } else if (rawArgs[0] == ':clear') {
        let text;
        if (user.calc_scope) {
          user.calc_scope = '{}';
          schedulePropsSave();
          console.log(text = `Cleared scope successfully`);
          return msg.channel.send(text);
        } else {
          console.log(text = `You do not have a scope created yet`);
          return msg.channel.send(text);
        }
      } else {
        let promise, res, calc_scope_new, shared_calc_scope_new;
        if (doWorkers) {
          if (calccontext == null) calccontext = 1;
          else calccontext++;
          try {
            if (!user.calc_scope_running) {
              try {
                user.calc_scope_running = true;
                [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}']);
                if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
                if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
                if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
                else res = `Result: ${res}`;
              } catch (e) { throw e; }
              finally {
                user.calc_scope_running = false;
              }
            } else {
              [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}', 5]);
              if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
              if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
              if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
              else res = `Result: ${res}`;
            }
            promise = msg.channel.send(res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = msg.channel.send(`Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else if (/^Error: Workerpool Worker terminated Unexpectedly/.test(res)) {
              promise = msg.channel.send(`Error: Workerpool Worker Terminated Unexpectedly (possibly an out of memory error)`);
            } else {
              if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${msg.author.id}>`, 'g'), ''))) res = { embed: { title: 'Result (Error)', description: res } };
              promise = msg.channel.send(res);
            }
          } finally {
            calccontext--;
            if (calccontext <= 0) global.calccontext = null;
          }
        } else {
          let scope = JSON.parse(user.calc_scope, math.reviver);
          Object.defineProperty(scope, 'shared', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: JSON.parse(props.saved.users.default ? props.saved.users.default.calc_scope : '{}', math.reviver),
          });
          global.calccontext = scope;
          try {
            mathVMContext.expr = expr;
            mathVMContext.scope = scope;
            vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, { timeout: common.isDeveloper(msg) ? 1000 : 5 });
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
            calc_scope_new = JSON.stringify(scope, math.replacer);
            shared_calc_scope_new = JSON.stringify(scope.shared, math.replacer);
            calc_scope_new = user.calc_scope != calc_scope_new ? calc_scope_new : null;
            shared_calc_scope_new = (props.saved.users.default ? props.saved.users.default.calc_scope : '{}') != shared_calc_scope_new ? shared_calc_scope_new : null;
            if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
            if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
            promise = msg.channel.send(res);
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
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
        }
        return promise;
      }
    }
  },
  {
    name: 'echoargs',
    description: '`!echoargs [arguments]` prints out the parsed version of the arguments sent to the command',
    flags: 14,
    execute(o, msg, rawArgs) {
      return msg.channel.send('rawArgs: ' + JSON.stringify(rawArgs).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'));
    }
  },
];
