var stream = require('stream');

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

function completeDeserializePermissionOverwrites(channel, perms) {
  channel.lockPermissions();
  partialDeserializePermissionOverwrites(channel, perms);
}

function serializedPermissionsEqual(perms1, perms2) {
  if (perms1.length != perms2.length) return false;
  return perms1.every((x, i) => {
    return x.id == perms2[i].id && x.type == perms2[i].type && x.allow == perms2[i].allow && x.deny == perms2[i].deny;
  });
}

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

module.exports = {
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod,
  getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  rps,
  BufferStream,
};
