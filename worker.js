var worker = require('worker_threads');
var workerpool = require('workerpool');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');
var common = require('./common/random');
var math = require('./math.min.js');

math.config({ number: 'BigNumber' });
math.oldimport = math.import.bind(math);
math.oldcreateUnit = math.createUnit.bind(math);
math.import({
  'import': function (...args) { throw new Error('Function import is disabled'); },
  createUnit: function (...args) { throw new Error('Function createUnit is disabled'); },
  /*evaluate: function () { throw new Error('Function evaluate is disabled') },
  parse: function () { throw new Error('Function parse is disabled') },
  simplify: function () { throw new Error('Function simplify is disabled') },
  derivative: function () { throw new Error('Function derivative is disabled') },*/
  'delete': function (...args) {
    if (args.length == 2) {
      return delete args[0][args[1]];
    } else if (args.length == 1) {
      return delete mathVMContext.scope[args[0]];
    } else throw new Error('Invalid arguments');
  },
  cryptRandom: function (...args) {
    args = args.map(x => Number(x.valueOf()));
    if (!args.length)
      return math.bignumber(common.randFloat());
    else if (args.length == 1)
      return math.bignumber(common.randFloat() * args[0]);
    else if (args.length == 2)
      return math.bignumber(args[0] + common.randFloat() * (args[1] - args[0]));
  },
  cryptRandomInt: function (...args) {
    args = args.map(x => BigInt(x.valueOf()));
    if (!args.length)
      return math.bignumber(0);
    else if (args.length == 1)
      return math.bignumber(String(common.randInt(0n, args[0])));
    else if (args.length == 2)
      return math.bignumber(String(common.randInt(args[0], args[1])));
  },
  cryptRandomBig: function (...args) {
    args = args.map(x => Number(x.valueOf()));
    if (!args.length)
      return math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64'));
    else if (args.length == 1)
      return math.multiply(math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64')), args[0]);
    else if (args.length == 2)
      return math.add(args[0], math.multiply(math.divide(math.bignumber(String(common.randInt(0n, 10n ** 64n))), math.bignumber('1e64')), math.subtract(args[1], args[0])));
  },
}, { override: true });

var mathVMContext = vm.createContext({ math, expr: null, scope: null, res: null });

workerpool.worker({
  mathevaluate: function (expr, scopeString, sharedScopeString, timeout) {
    mathVMContext.expr = expr;
    mathVMContext.scope = JSON.parse(scopeString, math.reviver);
    Object.defineProperty(mathVMContext.scope, 'shared', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: JSON.parse(sharedScopeString, math.reviver),
    });
    vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, { timeout: timeout || 5000 });
    res = mathVMContext.res;
    if (res === undefined) res = 'undefined';
    else if (res === null) res = 'null';
    else if (typeof res == 'string') res = util.inspect(res);
    else if (Object.getPrototypeOf(res) == Object.prototype) {
      res = math.matrix([res]).toString();
      res = res.slice(1, res.length - 1);
    } else res = res.toString();
    if (res.length > 1950) res = res.slice(0, 1950) + '...';
    let scopeStringNew = JSON.stringify(mathVMContext.scope, math.replacer);
    let sharedScopeStringNew = JSON.stringify(mathVMContext.scope.shared, math.replacer);
    return [ res, scopeString != scopeStringNew ? scopeStringNew : null, sharedScopeString != sharedScopeStringNew ? sharedScopeStringNew : null ];
  },
  eval: eval,
});
