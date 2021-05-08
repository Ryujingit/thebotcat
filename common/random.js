var crypto = require('crypto');

function fastIntLog2(num) {
  if (typeof num != 'number' && typeof num != 'bigint') throw new Error('log2 must be num or bigint');
  if (num != num) throw new Error('log2 of nan');
  if (num <= 0) throw new Error('log2 of negative number or zero');
  
  if (num > 2 ** 31 && typeof num != 'bigint') num = BigInt(num);
  
  let res = 0;
  
  if (typeof num == 'number')
    while (num >>= 1) res++;
  else
    while (num >>= 1n) res++;
  
  return res;
}

var randomBytes = null, randomOffset = null;

function randBytes(amt) {
  if (typeof amt != 'number' || amt != amt) throw new Error('nan');
  
  if (amt <= 0) return Buffer.alloc(0);
  if (amt > 30 * 1024) return crypto.randomBytes(amt);
  
  if (!randomBytes) { randomBytes = crypto.randomBytes(100 * 1024); randomOffset = 0; }
  
  let result = Buffer.alloc(amt);
  
  if (randomOffset + amt > randomBytes.length) {
    let bytesCopied = randomBytes.copy(result, 0, randomOffset);
    randomBytes = crypto.randomBytes(100 * 1024); randomOffset = 0;
    randomBytes.copy(result, bytesCopied, randomOffset, randomOffset + amt - bytesCopied);
    randomOffset += amt - bytesCopied;
  } else {
    randomBytes.copy(result, 0, randomOffset, randomOffset + amt);
    randomOffset += amt;
  }
  
  return result;
}

function randFloat() {
  let bytes = randBytes(7);
  return (bytes.readUintBE(0, 6) * 256 + bytes[6]) / 2 ** 56;
}

// inclusive min, exclusive max
function randInt(min, max) {
  if (typeof min != 'number' && typeof min != 'bigint' || min != min) throw new Error('min must be int or bigint and not nan');
  if (typeof max != 'number' && typeof max != 'bigint' || max != max) throw new Error('max must be int or bigint and not nan');
  if (max < min) [max, min] = [min, max];
  
  let range = max - min;
  
  if (range <= 1) return min;
  
  let rangeLog = fastIntLog2(typeof range == 'number' ? range - 1 : range - 1n), res;
  
  if (typeof range == 'number') {
    if (range <= 256) {
      do {
        res = randBytes(1)[0] >> (7 - rangeLog);
      } while (res >= range)
    } else if (range <= 2 ** 48) {
      do {
        let exp = Math.floor(rangeLog / 8);
        let bytes = randBytes(1 + exp);
        res = (bytes[0] >> (7 - rangeLog % 8)) << (exp * 8);
        for (var i = 1; i <= exp; i++) res += bytes[i] << ((exp - i) * 8);
      } while (res >= range)
    } else {
      do {
        let exp = Math.floor(rangeLog / 8);
        let bytes = randBytes(1 + exp);
        res = (bytes[0] >> (7 - rangeLog % 8)) * 256 ** exp;
        for (var i = 1; i <= exp; i++) res += bytes[i] * 256 ** (exp - i);
      } while (res >= range)
    }
  } else {
    if (range <= 256) {
      do {
        res = randBytes(1)[0] >> (7 - rangeLog);
      } while (res >= range)
      res = BigInt(res);
    } else {
      do {
        let exp = Math.floor(rangeLog / 8);
        let bytes = randBytes(1 + exp);
        exp = BigInt(exp);
        res = (BigInt(bytes[0]) >> (7n - BigInt(rangeLog) % 8n)) << (exp * 8n);
        for (var i = 1n; i <= exp; i++) res += BigInt(bytes[i]) << ((exp - i) * 8n);
      } while (res >= range)
    }
  }
  
  return min + res;
}

function randInts(min, max, amt) {
  if (!amt || amt < 0) return [];
  if (typeof min != 'number' && typeof min != 'bigint' || min != min) throw new Error('min must be int or bigint and not nan');
  if (typeof max != 'number' && typeof max != 'bigint' || max != max) throw new Error('max must be int or bigint and not nan');
  if (max < min) [max, min] = [min, max];
  
  let range = max - min;
  
  if (range <= 1) return new Array(amt).fill(min);
  
  let array = [], subAmt, bigRandInt;
  
  if (typeof range == 'number') {
    range = BigInt(range);
    for (; amt > 0; amt -= 128) {
      subAmt = Math.min(amt, 128);
      bigRandInt = randInt(0n, range ** BigInt(subAmt));
      for (var i = 0; i < subAmt; i++) {
        array.push(min + Number(bigRandInt % range));
        bigRandInt /= range;
      }
    }
  } else {
    for (; amt > 0; amt -= 128) {
      subAmt = Math.min(amt, 128);
      bigRandInt = randInt(0n, range ** BigInt(subAmt));
      for (var i = 0; i < subAmt; i++) {
        array.push(min + bigRandInt % range);
        bigRandInt /= range;
      }
    }
  }
  
  return array;
}

module.exports = {
  fastIntLog2,
  get randomBytes() { return randomBytes }, set randomBytes(val) { randomBytes = val; },
  get randomOffset() { return randomOffset }, set randomOffset(val) { randomOffset = val; },
  randBytes, randFloat, randInt, randInts,
};
