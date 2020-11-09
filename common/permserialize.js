// converts a channel's permission overwrites into an easy to parse and store array
function serializePermissionOverwrites(channel) {
  return channel.permissionOverwrites.keyArray().map(x => channel.permissionOverwrites.get(x))
  .map(x =>
    ({
      id: x.id,
      type: x.type,
      allow: x.allow.bitfield,
      deny: x.deny.bitfield,
    })
  );
}

// takes the array returned by the above function, and applies the permission overwrites it represents
function partialDeserializePermissionOverwrites(channel, perms, reason) {
  channel.overwritePermissions(perms, reason);
}

// like the above function except that channel overwrites are wiped first so the channel ONLY has the permissions that were in the array
function completeDeserializePermissionOverwrites(channel, perms, reason) {
  channel.lockPermissions();
  partialDeserializePermissionOverwrites(channel, perms, reason);
}

// checks if two serialzed permissions arrays are equal
function serializedPermissionsEqual(perms1, perms2) {
  if (perms1.length != perms2.length) return false;
  return perms1.every((x, i) => {
    return x.id == perms2[i].id && x.type == perms2[i].type && x.allow == perms2[i].allow && x.deny == perms2[i].deny;
  });
}

module.exports = { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual };
