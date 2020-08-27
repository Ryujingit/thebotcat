var worker = require('worker_threads');
var workerpool = require('workerpool');
var util = require('util');
var v8 = require('v8');
var vm = require('vm');
var math = require('./math.min.js');

math.config({ number: 'BigNumber' });
math.oldimport = math.import.bind(math);
math.oldcreateUnit = math.createUnit.bind(math);
math.import({
  'import':     function (...args) { throw new Error('Function import is disabled'); },
  'createUnit': function (...args) { throw new Error('Function createUnit is disabled'); },
  /*'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') },*/
  'delete':     function (...args) {
    if (args.length == 2) {
      return delete args[0][args[1]];
    } else if (args.length == 1) {
      if (calccontext) return delete calccontext[args[0]];
      else return delete args[0];
    } else throw new Error('Invalid arguments');
  },
}, { override: true });

var mathVMContext = vm.createContext({ math });

function sendObjThruBufferSync(buffer, i32arr, obj) {
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'sending', obj);
  let i32v = Atomics.load(i32arr, 0);
  if (i32v != 0) while (Atomics.load(i32arr, 0) == i32v) Atomics.wait(i32arr, 0, i32v, 1);
  obj = v8.serialize(obj);
  if (obj.length > 65536) throw new Error('tcp meltdown');
  let buffobj = Buffer.from(buffer);
  Atomics.store(i32arr, 1, obj.length);
  obj.copy(buffobj, 8, 0, 65536);
  Atomics.store(i32arr, 0, 1);
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'sending2');
  while (Atomics.load(i32arr, 0) == 1) Atomics.wait(i32arr, 0, 1, 1);
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'sending3', Atomics.load(i32arr, 0));
  Atomics.store(i32arr, 0, 0);
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'sending4');
  /*for (var loc = 0; loc < obj.length; loc += 65536) {
    Atomics.store(i32arr, 1, obj.length - loc);
    obj.copy(buffobj, 8, loc, loc + 65536);
    Atomics.store(i32arr, 0, 1);
    console.log('sending2', [buffer, Atomics.load(i32arr, 0)]);
    while (Atomics.load(i32arr, 0) == 1) {
      console.log('sending brec', Atomics.load(i32arr, 0));
      Atomics.wait(i32arr, 0, 1, 5);
      console.log('sending brec2', Atomics.load(i32arr, 0));
    }
    if (Atomics.load(i32arr, 0) == 0) return console.log('sending stopped');
    console.log('wait done');
  }
  console.log('sending done');
  Atomics.store(i32arr, 0, 0);*/
}

function receiveObjThruBufferSync(buffer, i32arr) {
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'receiving');
  while (Atomics.load(i32arr, 0) == 0) Atomics.wait(i32arr, 0, 0, 1);
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'receiving2');
  if (Atomics.load(i32arr, 0) == 0) throw new Error('receiving stopped');
  let amt = Atomics.load(i32arr, 1);
  let obj = Buffer.alloc(amt);
  Buffer.from(buffer).copy(obj, 0, 8, 8 + 65536);
  Atomics.store(i32arr, 0, 4);
  while (Atomics.load(i32arr, 0) == 4) Atomics.wait(i32arr, 0, 4, 1);
  //console.log(process.hrtime()[1].toString().padStart(9, '0'), 'receiving3', v8.deserialize(obj));
  return v8.deserialize(obj);
  /*console.log('receiving', Atomics.load(i32arr, 0));
  let obj = [];
  while (Atomics.load(i32arr, 0) == 0) {
    console.log('receiving brec', Atomics.load(i32arr, 0));
    Atomics.wait(i32arr, 0, 0, 5);
    console.log('receiving brec2', Atomics.load(i32arr, 0));
  }
  if (Atomics.load(i32arr, 0) == 0) return console.log('receiving stopped');
  console.log('wait complete', Atomics.load(i32arr, 0));
  let amt, objappend;
  while ((amt = Atomics.load(i32arr, 1)) > 0) {
    objappend = Buffer.alloc(Math.min(65536, amt));
    Buffer.from(buffer).copy(objappend, 0, 8, 8 + objappend.length);
    console.log('recieving2', [amt, objappend]);
    obj.push(objappend);
    Atomics.store(i32arr, 0, 4);
    while (Atomics.load(i32arr, 0) == 4) Atomics.wait(i32arr, 0, 4);
    if (amt > 65536) {
      if (Atomics.load(i32arr, 0) == 0) return console.log('receiving stopped');
      console.log('wait2 complete');
    } else break;
  }
  return v8.deserialize(Buffer.concat(obj));*/
}

function sendRecieve(buffer, i32arr, obj) {
  sendObjThruBufferSync(buffer, i32arr, obj);
  obj = receiveObjThruBufferSync(buffer, i32arr);
  if (obj instanceof Error)
    throw obj;
  else
    return obj;
}

function mathObjectProxy(buffer, i32arr, props) {
  if (!props) props = [];
  let promisefuncs = {
    resolve: null,
    reject: null,
  };
  return new Proxy({}, {
    has(_, nam) {
      //console.log('has', nam);
      let v = sendRecieve(buffer, i32arr, { type: 'has', props, prop: nam });
      //console.log('hasval', v);
      return v;
    },
    get(_, nam) {
      //console.log('get', nam);
      if (nam == 'constructor') return Object;
      let val = sendRecieve(buffer, i32arr, { type: 'get', props, prop: nam });
      if (nam == 'toString' && typeof val == 'object' && 'val' in val)
        return () => val.val;
      //console.log('reccc', val);
      if (typeof val == 'object') {
        if ('val' in val)
          return val.val;
        else
          return mathObjectProxy(buffer, i32arr, [ ...props, nam ]);
      } else {
        //console.log('json', util.inspect(val));
        return JSON.parse(val, math.reviver);
      }
    },
    set(_, nam, val) {
      //console.log('set', nam, val);
      sendRecieve(buffer, i32arr, { type: 'set', props, prop: nam, val: JSON.stringify(val, math.replacer) });
    },
    deleteProperty(_, nam) {
      //console.log('del', nam);
      return sendRecieve(buffer, i32arr, { type: 'delete', props, prop: nam });
    },
    ownKeys(_) {
      //console.log('ownkeys');
      let v = sendRecieve(buffer, i32arr, { type: 'ownKeys', props });
      //console.log('ownkeysres', v);
      return v;
    },
  });
}

workerpool.worker({
  mathevaluate: function (authorid, expr, buffer) {
    let i32arr = new Int32Array(buffer);
    Atomics.wait(i32arr, 0, 1, 500);
    //console.log('ytaome', buffer);
    mathVMContext.expr = expr;
    mathVMContext.scope = mathObjectProxy(buffer, i32arr);
    vm.runInContext('res = math.evaluate(expr, scope)', mathVMContext, {timeout: 5000});
    res = mathVMContext.res;
    if (res === undefined) res = 'undefined';
    else if (res === null) res = 'null';
    else if (typeof res == 'string') res = util.inspect(res);
    else if (Object.getPrototypeOf(res) == Object.prototype) {
      res = math.matrix([res]).toString();
      res = res.slice(1, res.length - 1);
    } else res = res.toString();
    if (res.length > 1900) res = res.slice(0, 1900) + '...';
    if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(res.replace(new RegExp(`<@!?${authorid}>`, 'g'), ''))) res = { embed: { title: 'Result', description: res } };
    else res = `Result: ${res}`;
    return res;
  },
  eval: eval,
});