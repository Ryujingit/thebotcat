class BreakError extends Error {}

// starts with an object and accesses properties of it based on the given array
function arrayGet(obj, props) {
  for (var i = 0; i < props.length; i++) {
    obj = obj[props[i]];
  }
  return obj;
}

/* i32arr[0] values:
  0 = nothing
  1 = receiving buffer
  2 = receiving buffer ack
  3 = sending buffer
  4 = sending buffer ack
*/
async function sendObjThruBuffer(buffer, i32arr, obj, checkcancelflag) {
  let i32v = Atomics.load(i32arr, 0);
  if (i32v != 0)
    while (Atomics.load(i32arr, 0) == i32v && (checkcancelflag ? (checkcancelflag() ? true : (() => { throw new BreakError(); })()) : true))
      await new Promise(r => setTimeout(r, 5));
  obj = v8.serialize(obj);
  while (Atomics.load(i32arr, 0) == 2 && (checkcancelflag ? (checkcancelflag() ? true : (() => { throw new BreakError(); })()) : true))
    await new Promise(r => setTimeout(r, 5));
  let buffobj = Buffer.from(buffer);
  for (var loc = 0; loc < obj.length; loc += 65536) {
    Atomics.store(i32arr, 1, obj.length - loc);
    Atomics.store(i32arr, 0, 3);
    obj.copy(buffobj, 8, loc, loc + 65536);
    while (Atomics.load(i32arr, 0) == 3 && (checkcancelflag ? (checkcancelflag() ? true : (() => { throw new BreakError(); })()) : true))
      await new Promise(r => setTimeout(r, 5));
  }
  Atomics.store(i32arr, 0, 0);
}

async function receiveObjThruBuffer(buffer, i32arr, checkcancelflag) {
  let obj = [];
  while (Atomics.load(i32arr, 0) == 0 && (checkcancelflag ? (checkcancelflag() ? true : (() => { throw new BreakError(); })()) : true))
    await new Promise(r => setTimeout(r, 5));
  let amt, objappend;
  while ((amt = Atomics.load(i32arr, 1)) > 0) {
    objappend = Buffer.alloc(Math.min(65536, amt));
    Buffer.from(buffer).copy(objappend, 0, 8, 8 + objappend.length);
    obj.push(objappend);
    Atomics.store(i32arr, 0, 2);
    while (Atomics.load(i32arr, 0) == 2 && (checkcancelflag ? (checkcancelflag() ? true : (() => { throw new BreakError(); })()) : true))
      await new Promise(r => setTimeout(r, 5));
    if (amt <= 65536) break;
  }
  return v8.deserialize(Buffer.concat(obj));
}

module.exports = { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer };
