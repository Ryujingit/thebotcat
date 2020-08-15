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


// the next five functions are self explanatory, although isMod refers to bot moderator role
function isDeveloper(msg) {
  return (!props.erg || msg.channel.id == '724006510576926810' || msg.channel.id == '733760003055288350') && (msg.author.id == '405091324572991498' || msg.author.id == '312737536546177025') || developers.includes(msg.author.id);
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
  return Boolean(msg.member.roles.find(x => props.saved.guilds[msg.guild.id].modroles.includes(x.id)));
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
      deny: x.deny,
      allow: x.allow,
    })
  );
}

// takes the array returned by the above function, and applies the permission overwrites it represents
function partialDeserializePermissionOverwrites(channel, perms) {
  var k = Object.keys(Discord.Permissions.FLAGS), obj;
  for (var i = 0; i < perms.length; i++) {
    obj = {};
    for (var j = 0; j < k.length; j++) {
      if (perms[i].allow & Discord.Permissions.FLAGS[k[j]])
        obj[k[j]] = true;
      else if (perms[i].deny & Discord.Permissions.FLAGS[k[j]])
        obj[k[j]] = false;
      else
        obj[k[j]] = null;
    }
    channel.overwritePermissions(perms[i].id, obj);
  }
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
      if (this.dopush) this._read();
    } else {
      this.chunkcb = cb;
      if (this.dopush) this._read();
    }
  }
  _read(size) {
    this.dopush = true;
    while (this.dopush && this.chunks.length > 0) {
      let buf = this.chunks.splice(0, 1)[0];
      this.dopush = this.push(buf);
      this.chunkslength -= buf.length;
      if (this.chunkcb && this.chunkslength < this.bufferSize) {
        this.chunkcb();
        this.chunkcb = null;
      }
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
    voice.channel = channel;
    voice.connection = await channel.join();
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
    let videoinfo;
    try {
      videoinfo = await ytdl.getBasicInfo(query);
    } catch (e) {
      throw new Error('invalid url');
    }
    let songslist = voice.songslist;
    let latestobj = {
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
    if (!/^https?:\/\/[a-z0-9.\-]+\/[A-Za-z0-9?&=\-_%.]+$/.test(latestobj.url)) return msg.channel.send('Invalid url');
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
        voice.dispatcher = voice.connection.playArbitraryInput(voice.procpipe, { volume: voice.volume });
        while (voice.dispatcher && !voice.dispatcher.destroyed) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.songslist.length > 1 && !voice.proc2) {
            voice.proc2 = cp.spawn('ffmpeg', ['-f', 'webm', '-i', voice.songslist[1].url, '-f', 'mp3', 'pipe:1']);
            voice.proc2pipe = new common.BufferStream();
            voice.proc2.stdout.pipe(voice.proc2pipe);
            //voice.proc2.stderr.pipe(process.stderr);
          }
          if (voice.mainloop == 2) {
            voice.dispatcher.destroy();
            voice.mainloop = 1;
          }
        }
        if (voice.dispatcher && voice.dispatcher.time < voice.songslist[0].expectedLength - 5000) msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (!voice.loop) voice.songslist.splice(0, 1);
        try { voice.proc.kill(); } catch (e) {}
        voice.proc = null;
        voice.procpipe = null;
        voice.dispatcher = null;
      }
    } catch (e) {
      console.error(e);
    } finally {
      voice.mainloop = 0;
    }
  },
};

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants,
  msecToHMS,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod,
  getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  rps,
  BufferStream,
  clientVCManager,
};
