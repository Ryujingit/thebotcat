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

module.exports = { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual, rps };