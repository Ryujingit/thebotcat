var stream = require('stream');

// a special type of stream that pretends to be empty until the internal buffer is bigger than some size, used as a way to force the input to generate a lot of data in advance
module.exports = class BufferStream extends stream.Duplex {
  constructor(options) {
    if (!options) options = {};
    super(options);
    this.bufferSize = options.bufferSize || 2 ** 20;
    this.chunks = [];
    this.chunkslength = 0;
    this.chunkcb = null;
    this.dopush = true;
  }
  _write(chunk, enc, cb) {
    this.chunks.push(chunk);
    this.chunkslength += chunk.length;
    if (this.chunkslength < this.bufferSize) {
      cb();
      this.performPush();
    } else {
      this.chunkcb = cb;
      this.performPush();
    }
  }
  _final(cb) {
    if (this.chunkcb) setImmediate(this.chunkcb);
    if (this.chunks.length != 0) {
      this.push(Buffer.concat(this.chunks));
    }
    this.push(null);
    cb();
  }
  _destroy(err, cb) {
    if (this.chunkcb) setImmediate(this.chunkcb);
    if (this.chunks.length != 0) {
      this.push(Buffer.concat(this.chunks));
    }
    this.push(null);
    cb();
  }
  _read(size) {
    this.dopush = true;
    this.performPush();
  }
  performPush() {
    if (!this.dopush) return;
    if (this.chunks.length == 0) {
      this.dopush = this.push(Buffer.alloc(0));
      if (this.chunkcb) {
        setImmediate(this.chunkcb);
        this.chunkcb = null;
      }
      return;
    }
    while (this.dopush && this.chunks.length > 0) {
      let buf = this.chunks.splice(0, 1)[0];
      this.dopush = this.push(buf);
      this.chunkslength -= buf.length;
    }
    if (this.chunkcb && this.chunkslength < this.bufferSize) {
      setImmediate(this.chunkcb);
      this.chunkcb = null;
    }
  }
};
