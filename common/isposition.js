var commonConstants = require('./constants');

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


function hasBotPermissions(msg, permMask, channel) {
  if (typeof perms == 'string') perms = commonConstants.botRolePermBits[perms];
  else if (Array.isArray(perms)) perms = perms.map(x => commonConstants.botRolePermBits[x]).reduce((a, c) => a + c, 0);

  if (!msg.guild) return 0;

  if (!props.saved.guilds[msg.guild.id]) props.saved.guilds[msg.guild.id] = common.getEmptyGuildObject();

  if (!channel) channel = msg.channel;

  let permGuildIDs = props.saved.guilds[msg.guild.id].perms.map(x => x.id);
  
  var perms = msg.member.roles.cache.array().map(x => x.id).filter(x => permGuildIDs.includes(x)).reduce((a, c) => a | props.saved.guilds[msg.guild.id].perms.filter(x => x.id == c).perms & permMask, 0);

  if (permMask & commonConstants.botRolePermBits.LOCK_CHANNEL &&
    !(perms & commonConstants.botRolePermBits.LOCK_CHANNEL) &&
    channel.permissionsFor(msg.member).has('MANAGE_ROLES'))
    perms |= commonConstants.botRolePermBits.LOCK_CHANNEL;

  if (permMask & commonConstants.botRolePermBits.BYPASS_LOCK &&
    !(perms & commonConstants.botRolePermBits.BYPASS_LOCK) &&
    (channel.permissionsFor(msg.member).has('MANAGE_ROLES') || perms & commonConstants.botRolePermBits.LOCK_CHANNEL))
    perms |= commonConstants.botRolePermBits.BYPASS_LOCK;

  if (permMask & commonConstants.botRolePermBits.MUTE &&
    !(perms & commonConstants.botRolePermBits.MUTE) &&
    msg.member.hasPermission('MANAGE_ROLES') &&
    (props.saved.guilds[msg.guild.id].mutedrole == null || msg.member.roles.highest.position > msg.guild.roles.cache.get(props.saved.guilds[msg.guild.id].mutedrole).position))
    perms |= commonConstants.botRolePermBits.MUTE;

  if (permMask & commonConstants.botRolePermBits.KICK &&
    !(perms & commonConstants.botRolePermBits.KICK) &&
    msg.member.hasPermission('KICK_MEMBERS'))
    perms |= commonConstants.botRolePermBits.KICK;

  if (permMask & commonConstants.botRolePermBits.BAN &&
    !(perms & commonConstants.botRolePermBits.BAN) &&
    msg.member.hasPermission('BAN_MEMBERS'))
    perms |= commonConstants.botRolePermBits.BAN;

  if (permMask & commonConstants.botRolePermBits.MANAGE_BOT &&
    !(perms & commonConstants.botRolePermBits.MANAGE_BOT) &&
    msg.member.hasPermission('ADMINISTRATOR') &&
    msg.member.roles.highest.position > msg.guild.me.roles.highest.position)
    perms |= commonConstants.botRolePermBits.MANAGE_BOT;

  return perms;
}


function getBotPermissions(msg) {
  var perms = hasBotPermissions(msg, commonConstants.botRolePermAll);
  let obj = {};
  Object.keys(commonConstants.botRolePermBits).forEach(x => obj[x] = perms & commonConstants.botRolePermBits[x]);
  return obj;
}


// this function isnt used but it might be handy, pass in a message object and it calls all five of the above functions on them
function getPermissions(msg) {
  return {
    developer: isDeveloper(msg),
    confirmdeveloper: isConfirmDeveloper(msg),
    owner: isOwner(msg),
    admin: isAdmin(msg),
    perms: getBotPermissions(msg),
  };
}


module.exports = { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getPermissions };
