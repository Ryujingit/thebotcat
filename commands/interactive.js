module.exports = [
  {
    name: 'coinflip',
    description: '`!coinflip` returns heads or tails with 50% probability each',
    description_slash: 'returns heads or tails with 50% probability each',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      return msg.channel.send(`I\'m flipping a coin, and the result is...: ${Math.random() >= 0.5 ? 'heads' : 'tails'}!`);
    },
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: `I\'m flipping a coin, and the result is...: ${Math.random() >= 0.5 ? 'heads' : 'tails'}!`, flags: 64 },
      } });
    },
  },
  {
    name: 'roll',
    description: '`!roll # x # | #d#` rolls a dice with the given number of sides, the given number of times (for the first form the number of times is last while for the second form the number of times is first), and adds the results together',
    description_slash: 'rolls a dice with the given number of sides (defaulting to 6), the given number of times',
    flags: 0b111110,
    options: [
      { type: 4, name: 'sides', description: 'the number of sides of the die' },
      { type: 4, name: 'times', description: 'the number of times to roll' },
    ],
    execute(o, msg, rawArgs) {
      let sides, times;
      if (/-?[0-9.e]+ [0-9.e]+/.test(o.argstring)) {
        sides = Number(rawArgs[0].replace(/[^0-9.e-]/g, '')) || 6;
        times = Math.min(Math.max(Math.floor(Number(rawArgs[1].replace(/[^0-9.e-]/g, ''))) || 1, 0), 100);
      } else if (/[0-9.e]+d-?[0-9.e]+/.test(o.argstring)) {
        let split = rawArgs[0].split('d');
        sides = Number(split[1].replace(/[^0-9.e-]/g, '')) || 6;
        times = Math.min(Math.max(Math.floor(Number(split[0].replace(/[^0-9.e-]/g, ''))) || 1, 0), 100);
      } else return msg.channel.send('Invalid arguments.');
      let result = 0;
      for (var i = 0; i < times; i++)
        result += 1 + Math.floor(Math.random() * sides);
      return msg.channel.send(`Result of rolling a ${times}d${sides}: ${result}`);
    },
    execute_slash(o, interaction, command, args) {
      let sides = (args[0] ? args[0].value : 0) || 6, times = Math.min(Math.max((args[1] ? args[1].value : 0) || 1, 0), 100);
      let result = 0;
      for (var i = 0; i < times; i++)
        result += 1 + Math.floor(Math.random() * sides);
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: `Result of rolling a ${times}d${sides}: ${result}`, flags: 64 },
      } });
    },
  },
  {
    name: 'randint',
    description: '`!randint <min> <max>` returns a random integer between min and max (inclusive)',
    description_slash: 'returns a random integer between min and max (inclusive)',
    flags: 0b111110,
    options: [
      { type: 4, name: 'min', description: 'the minimum number that can be returned' },
      { type: 4, name: 'max', description: 'the maximum number that can be returned' },
    ],
    execute(o, msg, rawArgs) {
      let min = Math.floor(Number(rawArgs[0])) || 0, max = Math.floor(Number(rawArgs[1])) || 1;
      return msg.channel.send(`Random integer between ${min} and ${max}: ${min + Math.floor(Math.random() * (max - min + 1))}`);
    },
    execute_slash(o, interaction, command, args) {
      let min = args[0] && args[0].value || 0, max = args[1] && args[1].value || 1;
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: `Random integer between ${min} and ${max}: ${min + Math.floor(Math.random() * (max - min + 1))}`, flags: 64 },
      } });
    },
  },
  {
    name: 'randfloat',
    description: '`!randfloat <min> <max>` returns a random real number between min and max (inclusive lower bound)',
    description_slash: 'returns a random real number between min and max (inclusive lower bound)',
    flags: 0b111110,
    options: [
      { type: 4, name: 'min', description: 'the minimum number that can be returned' },
      { type: 4, name: 'max', description: 'the maximum number that can be returned' },
    ],
    execute(o, msg, rawArgs) {
      let min = Number(rawArgs[0]) || 0, max = Number(rawArgs[1]) || 1;
      return msg.channel.send(`Random real number between ${min} and ${max}: ${min + Math.random() * (max - min)}`);
    },
    execute_slash(o, interaction, command, args) {
      let min = args[0] && args[0].value || 0, max = args[1] && args[1].value || 1;
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: `Random real number between ${min} and ${max}: ${min + Math.random() * (max - min)}`, flags: 64 },
      } });
    },
  },
  {
    name: 'choice',
    description: '`!choice <choice1> [<choice2> ...]` picks a random option from the choices given',
    flags: 0b011110,
    execute(o, msg, rawArgs) {
      let choice = Math.floor(Math.random() * rawArgs.length);
      choice = rawArgs[choice];
      return msg.channel.send(`Random choice: ${choice}`, { allowedMentions: { parse: [] } });
    },
  },
  {
    name: 'rps',
    description: '`!rps rock|paper|scissors` plays a game of rock paper scissors with me, where I pick one randomly',
    description_slash: 'plays a game of rock paper scissors with me, where I pick one randomly',
    flags: 0b111110,
    options: [
      {
        type: 3, name: 'choice', description: 'your choice', required: true,
        choices: [ { name: 'rock', value: 'rock' }, { name: 'paper', value: 'paper' }, { name: 'scissors', value: 'scissors' } ],
      }
    ],
    execute(o, msg, rawArgs) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = rawArgs[0];
      if (!uReply) return msg.channel.send(`Please play with one of these responses: \`${replies.join(', ')}\``);
      if (!replies.includes(uReply)) return msg.channel.send(`Only these responses are accepted: \`${replies.join(', ')}\``);
      
      let result = replies[Math.floor(Math.random() * replies.length)];
      
      let status = common.rps(uReply, result);
      
      if (status == 0) {
        return msg.channel.send(`It's a tie! We had the same choice. (${result})`);
      } else if (status == 1) {
        return msg.channel.send(`I chose ${result}, I won!`);
      } else if (status == -1) {
        return msg.channel.send(`I chose ${result}, you won!`);
      }
    },
    execute_slash(o, interaction, command, args) {
      let replies = ['rock', 'paper', 'scissors'];
      
      let uReply = args[0].value;
      
      let result = replies[Math.floor(Math.random() * replies.length)];
      
      let status = common.rps(uReply, result);
      
      if (status == 0) {
        client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
          type: 3,
          data: { content: `It's a tie! We had the same choice. (${result})`, flags: 64 },
        } });
      } else if (status == 1) {
        client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
          type: 3,
          data: { content: `I chose ${result}, I won!`, flags: 64 },
        } });
      } else if (status == -1) {
        client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
          type: 3,
          data: { content: `I chose ${result}, you won!`, flags: 64 },
        } });
      }
    },
  },
  {
    name: 'spoilerbubblewrap',
    description: '`!spoilerbubblewrap <text>` to produce text that can be copy pasted that contains the original text wrapped in spoilers for every character',
    description_slash: 'returns text to copy paste that contains the original text wrapped in spoilers for every character',
    flags: 0b111110,
    options: [ { type: 3, name: 'text', description: 'the text' } ],
    execute(o, msg, rawArgs) {
      return msg.channel.send('wrapped: ' + o.asOneArg.split('').map(x => `\\||${x}\\||`).join(''));
    },
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: 'wrapped: ' + args[0].value.split('').map(x => `\\||${x}\\||`).join(''), flags: 64 },
      } });
    },
  },
  {
    name: 'calc',
    description: '`!calc <expression>` calculates the result of a mathematical expression using math.js evaluate (<https://mathjs.org/docs/expressions/index.html> for info)\n' +
      'Note: a delete function has been added to delete a property from an object:\n' +
      '  `delete(obj, prop)` to delete `prop` from `obj` or\n' +
      '  `delete(prop)` to delete `prop` from global scope\n' +
      '`!calc :view` to print out serialized JSON of your calc scope\n' +
      '`!calc :clear` to clear your calc scope',
    description_slash: 'calculates an expression using math.js evaluate, do `help calc` for more information',
    flags: 0b111110,
    async execute(o, msg, rawArgs) {
      if (!props.saved.feat.calc) return msg.channel.send('Calculation features are disabled');
      let expr = o.argstring, res;
      nonlogmsg(`calculating from ${msg.author.tag} (id ${msg.author.id}) in ${common.explainChannel(msg.channel)}: ${util.inspect(expr)}`);
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
          console.log(text = user.calc_scope);
          return msg.channel.send(text, { allowedMentions: { parse: [] } });
        } else {
          let scopeVars = Reflect.ownKeys(JSON.parse(user.calc_scope)).join(', ');
          if (scopeVars.length <= 1950) {
            console.log(text = `Scope too big to fit in a discord message, variables:\n${scopeVars}`);
            return msg.channel.send(text, { allowedMentions: { parse: [] } });
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
                res = `Result: ${res}`;
              } catch (e) { throw e; }
              finally {
                user.calc_scope_running = false;
              }
            } else {
              [ res, calc_scope_new, shared_calc_scope_new ] = await pool.exec('mathevaluate', [expr, user.calc_scope, props.saved.users.default ? props.saved.users.default.calc_scope : '{}', 5]);
              if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
              if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
              res = `Result: ${res}`;
            }
            promise = msg.channel.send(res, { allowedMentions: { parse: [] } });
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
              promise = msg.channel.send(res, { allowedMentions: { parse: [] } });
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
            res = `Result: ${res}`;
            calc_scope_new = JSON.stringify(scope, math.replacer);
            shared_calc_scope_new = JSON.stringify(scope.shared, math.replacer);
            calc_scope_new = user.calc_scope != calc_scope_new ? calc_scope_new : null;
            shared_calc_scope_new = (props.saved.users.default ? props.saved.users.default.calc_scope : '{}') != shared_calc_scope_new ? shared_calc_scope_new : null;
            if (calc_scope_new && calc_scope_new.length > 2 ** 20) throw new Error('Calc scope size too large');
            if (shared_calc_scope_new && shared_calc_scope_new.length > 2 ** 20) throw new Error('Shared calc scope size too large');
            promise = msg.channel.send(res, { allowedMentions: { parse: [] } });
            if (calc_scope_new) user.calc_scope = calc_scope_new;
            if (shared_calc_scope_new && props.saved.users.default) props.saved.users.default.calc_scope = shared_calc_scope_new;
            if (calc_scope_new || shared_calc_scope_new) schedulePropsSave();
          } catch (e) {
            res = e.toString();
            console.error(res);
            if (/^Error: Script execution timed out after [0-9]+ms$/.test(res)) {
              promise = msg.channel.send(`Error: expression timeout after ${res.slice(40, Infinity)}`);
            } else {
              promise = msg.channel.send(res, { allowedMentions: { parse: [] } });
            }
          } finally {
            global.calccontext = null;
          }
        }
        return promise;
      }
    },
  },
  {
    name: 'echoargs',
    description: '`!echoargs [arguments]` prints out the parsed version of the arguments sent to the command',
    flags: 0b011110,
    execute(o, msg, rawArgs) {
      return msg.channel.send('rawArgs: ' + JSON.stringify(rawArgs).replace(/@/g, '@\u200b').replace(/(<)/g, '\\$1'), { allowedMentions: { parse: [] } });
    },
  },
  {
    name: 'lathe',
    description: 'lathe strategies',
    flags: 0b111110,
    options: [ { type: 3, name: 'goe', description: 'mama' } ],
    execute(o, msg, rawArgs) {
      return msg.channel.send(Array.isArray(args) && typeof args[0] == 'object' && typeof args[0].value == 'string' ? 'val: ' + args[0].value : 'no val', { allowedMentions: { parse: [] } });
    },
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 4,
        data: { content: Array.isArray(args) && typeof args[0] == 'object' && typeof args[0].value == 'string' ? 'val: ' + args[0].value : 'no val', allowed_mentions: { parse: [] } },
      } });
    },
  },
  {
    name: 'lathe2',
    description: 'this one doesnt send a message in the channel so nobody knows you ran it oOo',
    flags: 0b101110,
    options: [ { type: 3, name: 'goe', description: 'mama' } ],
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: Array.isArray(args) && typeof args[0] == 'object' && typeof args[0].value == 'string' ? 'val: ' + args[0].value : 'no val', flags: 64 }
      } });
    },
  },
  {
    name: 'lathe3',
    description: 'lathe but no arguments',
    flags: 0b101110,
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: 'no val', flags: 64 }
      } });
    },
  },
  {
    name: 'lathe4',
    description: 'deferred ack version',
    flags: 0b101110,
    options: [ { type: 3, name: 'goe', description: 'mama' } ],
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 5 } });
      setTimeout(() => {
        client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({ data: {
          type: 4,
          data: { content: Array.isArray(args) && typeof args[0] == 'object' && typeof args[0].value == 'string' ? 'val: ' + args[0].value : 'no val', flags: 64 }
        } });
      }, 5000);
    },
  },
];
