// this module contains some code used by all thebotcat's modules

var stream = require('stream');

// some constants
var constants = {
  // used in youtube video downloader code, dont worry about it
  audioQualities: {
    'AUDIO_QUALITY_LOW': 1,
    'AUDIO_QUALITY_MEDIUM': 2,
    'AUDIO_QUALITY_HIGH': 3,
  },
};


// converts a time in milliseconds to M:SS.LLL or H:MM:SS.LLL
function msecToHMS(ms) {
  if (typeof ms != 'number' || ms < 0 || ms > 1e33) return '-:--.---';
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
  else
    return `${Math.floor(ms / 3600000)}:${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
}

// converts a time in milliseconds to h m s ms
function msecToHMSs(ms) {
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else if (ms < 86400000)
    return `${Math.floor(ms / 3600000)}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else
    return `${Math.floor(ms / 86400000)}d ${('' + Math.floor(ms / 3600000) % 24).padStart(2, '0')}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
}


function getBotcatStatusMessage() {
  return {
    embed: {
      title: 'Thebotcat Status',
      fields: [
        { name: 'Uptime', value: common.msecToHMSs(client.uptime), inline: false }
      ],
    }
  };
}


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


// the next five functions are self explanatory, although isMod refers to bot moderator role
function isDeveloper(msg) {
  return (!props.erg || msg.channel.id == '724006510576926810' || msg.channel.id == '733760003055288350') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025' || msg.author.id == '342384766378573834') || developers.includes(msg.author.id);
}

function isConfirmDeveloper(msg) {
  return confirmdevelopers.includes(msg.author.id);
}

function isOwner(msg) {
  if (!msg.guild) return false;
  return msg.guild.ownerID == msg.author.id;
}

function isAdmin(msg) {
  if (!msg.guild) return false;
  return msg.member.hasPermission('ADMINISTRATOR');
}

function isMod(msg) {
  if (!msg.guild) return false;
  if (!props.saved.guilds[msg.guild.id]) return false;
  return Boolean(msg.member.roles.cache.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)));
}


// this function isnt used but it might be handy, pass in a message object and it calls all five of the above functions on them
function getPermissions(msg) {
  if (!msg.guild)
    return {
      developer: isDeveloper(msg),
      confirmdeveloper: isConfirmDeveloper(msg),
      owner: false,
      admin: false,
      mod: false,
    };
  else
    return {
      developer: isDeveloper(msg),
      confirmdeveloper: isConfirmDeveloper(msg),
      owner: isOwner(msg),
      admin: isAdmin(msg),
      mod: isMod(msg),
    };
}


// converts a channel's permission overwrites into an easy to parse and store array
function serializePermissionOverwrites(channel) {
  return channel.permissionOverwrites.keyArray().map(x => channel.permissionOverwrites.get(x))
  .map(x =>
    ({
      id: x.id,
      type: x.type,
      deny: x.deny.bitfield,
      allow: x.allow.bitfield,
    })
  );
}

// takes the array returned by the above function, and applies the permission overwrites it represents
function partialDeserializePermissionOverwrites(channel, perms) {
  channel.overwritePermissions(perms);
}

// like the above function except that channel overwrites are wiped first so the channel ONLY has the permissions that were in the array
function completeDeserializePermissionOverwrites(channel, perms) {
  channel.lockPermissions();
  partialDeserializePermissionOverwrites(channel, perms);
}

// checks if two serialzed permissions arrays are equal
function serializedPermissionsEqual(perms1, perms2) {
  if (perms1.length != perms2.length) return false;
  return perms1.every((x, i) => {
    return x.id == perms2[i].id && x.type == perms2[i].type && x.allow == perms2[i].allow && x.deny == perms2[i].deny;
  });
}


// used to artifically run a command
function invokeMessageHandler(obj, options) {
  if (typeof obj == 'string') {
    obj = {
      content: obj,
      author: { id: '312737536546177025', tag: 'coolguy284#5720' },
      channel: { id: '688806772382761040', name: 'private-testing', send: options && options.sendcb ? options.sendcb : () => {} },
      guild: { id: '688806155530534931', name: 'Thebotcat Support' },
      member: { hasPermission: () => true, roles: { cache: { find: () => true } } },
    };
  } else if (typeof obj == 'object') {
    if (!('content' in obj)) obj.content = '';
    if (!('author' in obj)) obj.author = { id: '312737536546177025', tag: 'coolguy284#5720' };
    else if (typeof obj.author == 'string') obj.author = client.users.cache.get(obj.author);
    if (!('channel' in obj)) obj.channel = { id: '688806772382761040', name: 'private-testing', send: options && options.sendcb ? options.sendcb : () => {} };
    else if (typeof obj.channel == 'string') obj.channel = client.channels.cache.get(obj.author);
    if (!('guild' in obj)) obj.guild = { id: '688806155530534931', name: 'Thebotcat Support' };
    else if (typeof obj.guild == 'string') obj.guild = client.guilds.cache.get(obj.guild);
    if (obj.guild) {
      if (!('member' in obj)) {
        if (obj.author && obj.author.id) {
          obj.member = obj.guild.members ? obj.guild.members.cache.get(obj.author.id) : { hasPermission: () => true, roles: { cache: { find: () => true } } };
        } else obj.member = { hasPermission: () => true, roles: { cache: { find: () => true } } };
      } else if (typeof obj.member == 'string') obj.member = obj.guild.members.cache.get(obj.guild);
    }
  } else return;
  return messageHandler(obj);
}


// normal rps, where p1 and p2 are either 'rock', 'paper', or 'scissors', and the return value is 1 if p2 wins, -1 if p1 wins, and 0 if its a tie
function rps(p1, p2) {
  if (p1 == p2) return 0;
  switch (p1) {
    case 'rock':
      if (p2 == 'paper') return 1;
      else return -1;
      break;
    case 'scissors':
      if (p2 == 'rock') return 1;
      else return -1;
      break;
    case 'paper':
      if (p2 == 'scissors') return 1;
      else return -1;
      break;
  }
}


// a special type of stream that pretends to be empty until the internal buffer is bigger than some size, used as a way to force the input to generate a lot of data in advance
class BufferStream extends stream.Duplex {
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
}


// object with utility functions to manage the joining of vcs and playing of songs
var clientVCManager = {
  // returns the inital state of a guild's voice state object
  getEmptyVoiceObject: function getEmptyVoiceObject() {
    return {
      channel: null,
      connection: null,
      dispatcher: null,
      proc: null,
      procpipe: null,
      proc2: null,
      proc2pipe: null,
      mainloop: 0,
      songslist: [],
      volume: null,
      loop: null,
    };
  },
  // all of these functions have self explanatory names, and the first parameter of each function is the guild's voice state object
  join: async function join(voice, channel) {
    if (voice.channel) clientVCManager.leave(voice);
    voice.channel = channel;
    try {
      voice.connection = await channel.join();
    } catch (e) {
      voice.channel = null;
      throw e;
    }
    voice.volume = 1;
    voice.loop = false;
  },
  leave: function leave(voice) {
    try { voice.proc.kill(); } catch (e) {}
    try { voice.proc2.kill(); } catch (e) {}
    try { if (voice.connection) voice.connection.disconnect(); } catch (e) {}
    voice.channel = null;
    voice.connection = null;
    voice.dispatcher = null;
    voice.proc = null;
    voice.procpipe = null;
    voice.proc2 = null;
    voice.proc2pipe = null;
    voice.mainloop = 0;
    voice.songslist.splice(0, Infinity);
    voice.volume = null;
    voice.loop = null;
  },
  getVolume: function getVolume(voice) {
    return voice.volume;
  },
  setVolume: function setVolume(voice, wantedvolume) {
    if (voice.dispatcher) voice.dispatcher.setVolume(wantedvolume);
    voice.volume = wantedvolume;
  },
  getLoop: function getLoop(voice) {
    return voice.loop;
  },
  toggleLoop: function toggleLoop(voice) {
    voice.loop = !voice.loop;
  },
  pause: function pause(voice) {
    voice.dispatcher.pause();
  },
  resume: function pause(voice) {
    voice.dispatcher.resume();
  },
  addSong: async function addSong(voice, query) {
    if (!/^https?:\/\/(?:www.)?youtube.com\/[A-Za-z0-9?&=\-_%.]+$/.test(query)) throw new Error('invalid url');
    let videoinfo;
    try {
      videoinfo = await ytdl.getBasicInfo(query);
    } catch (e) {
      throw new Error('invalid url');
    }
    let songslist = voice.songslist;
    let latestobj = {
      query: query,
      url: null,
      desc: `${videoinfo.videoDetails.title} by ${videoinfo.videoDetails.author.name}`,
      expectedLength: null,
    };
    let filteredFormats = videoinfo.formats.filter(x => x.mimeType.startsWith('audio/webm')).sort((a, b) => {
      let aq = common.constants.audioQualities[a.audioQuality], bq = common.constants.audioQualities[b.audioQuality];
      return aq > bq ? -1 : aq < bq ? 1 : a.bitrate > b.bitrate ? -1 : a.bitrate < b.bitrate ? 1 : 0;
    });
    latestobj.url = filteredFormats[0].url;
    latestobj.expectedLength = Number(filteredFormats[0].approxDurationMs) || 0;
    if (!/^https?:\/\/[a-z0-9.\-]+\/[A-Za-z0-9?&=\-_%.]+$/.test(latestobj.url)) throw new Error('invalid url');
    songslist.push(latestobj);
    return latestobj;
  },
  forceSkip: function (voice) {
    if (voice.mainloop) voice.mainloop = 2;
  },
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    voice.mainloop = 1;
    try {
      while (voice.songslist.length > 0) {
        if (voice.proc2) {
          voice.proc = voice.proc2;
          voice.procpipe = voice.proc2pipe;
          voice.proc2 = null;
          voice.proc2pipe = null;
        } else {
          voice.proc = cp.spawn('ffmpeg', ['-f', 'webm', '-i', voice.songslist[0].url, '-f', 'mp3', 'pipe:1']);
          voice.procpipe = new common.BufferStream();
          voice.proc.stdout.pipe(voice.procpipe);
          //voice.proc.stderr.pipe(process.stderr);
        }
        //voice.dispatcher = voice.connection.play(voice.songslist[0].query, { volume: voice.volume });
        voice.dispatcher = voice.connection.play(voice.procpipe, { volume: voice.volume });
        while (voice.dispatcher && !voice.dispatcher.destroyed) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.songslist.length > 1 && !voice.proc2) {
            voice.proc2 = cp.spawn('ffmpeg', ['-f', 'webm', '-i', voice.songslist[1].url, '-f', 'mp3', 'pipe:1']);
            voice.proc2pipe = new common.BufferStream();
            voice.proc2.stdout.pipe(voice.proc2pipe);
            //voice.proc2.stderr.pipe(process.stderr);
          }
          if (voice.dispatcher && voice.dispatcher.streamTime > voice.songslist[0].expectedLength - 2) voice.mainloop = 2;
          if (voice.mainloop == 2) {
            voice.dispatcher.destroy();
          }
        }
        if (voice.mainloop != 2 && voice.dispatcher && voice.dispatcher.streamTime < voice.songslist[0].expectedLength - 5000) msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (voice.mainloop == 2) voice.mainloop = 1;
        if (!voice.loop) voice.songslist.splice(0, 1);
        try { voice.proc.kill(); } catch (e) {}
        voice.proc = null;
        voice.procpipe = null;
        voice.dispatcher = null;
      }
    } catch (e) {
      console.error(e);
    }
    voice.mainloop = 0;
  },
};

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants,
  msecToHMS, msecToHMSs, getBotcatStatusMessage, arrayGet, BreakError, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod,
  getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  invokeMessageHandler,
  rps,
  BufferStream,
  clientVCManager,
};
