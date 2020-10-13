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


module.exports = { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod, getPermissions };
