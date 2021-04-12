// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { recursiveReaddir } = require('./convenience');

var randomModule = require('./random');
var { randBytes, randFloat, randInt } = randomModule;

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString } = require('./time'); 

var formatPlaybackBar = (frac, numElems) => {
  if (!Number.isFinite(frac)) frac = 0;
  if (frac < 0 || frac > 1) frac = Math.min(Math.max(frac, 0), 1);
  if (!Number.isSafeInteger(numElems) || numElems < 0) numElems = 30;
  var dotElem = Math.floor(frac * numElems);
  return '-'.repeat(Math.max(dotElem, 0)) + '•' + '-'.repeat(Math.max(numElems - dotElem - 1, 0));
};

var { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage } = require('./status');

var explainChannel = (channel, full) => {
  if (full)
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms with ${channel.recipient.tag} (id ${channel.recipient.id})`;
  else
    return channel.guild ? `${channel.guild.name}:${channel.name}` : `dms`;
};

var stringToBoolean = str => {
  switch (str) {
    case 'true':
    case 'yes':
      return true;
    
    case 'false':
    case 'no':
      return false;
    
    default:
      return null;
  }
};

var removePings = str => {
  return str.replace(/@/g, '@\u200b');
};

var onMsgOneArgHelper = function onMsgOneArgHelper(o) {
  let oneArg = o.argstring[0] == '"' || o.argstring[0] == '\'' ? o.rawArgs[0] : o.argstring;
  
  Object.defineProperty(o, 'asOneArg', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: oneArg,
  });
  
  return oneArg;
};

var slashCmdResp = function slashCmdResp(interaction, emphemeral, content) {
  if (typeof content == 'object') {
    return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
      type: 4,
      data: { embeds: [content], flags: emphemeral ? 64 : 0 },
    } });
  } else {
    return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
      type: 4,
      data: { content, flags: emphemeral ? 64 : 0, allowed_mentions: { parse: [] } },
    } });
  }
};

class BotError extends Error {}

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./workerbuffer');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions } = require('./isposition');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./permserialize');

var { parseArgs } = require('./parsecommand');

var { searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser } = require('./searchcollection');

var { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./generalserialize');

var invokeMessageHandler = require('./invokemsg');

var { rps } = require('./misc');

var BufferStream = require('./bufferstream');

var clientVCManager = require('./clientvcmanager');

var handlers = require('./handlers/index');

var { isId, isObject, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject } = require('./propssavedverif');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants, recursiveReaddir,
  get randomBytes() { return randomModule.randomBytes }, set randomBytes(val) { randomModule.randomBytes = val; },
  get randomOffset() { return randomModule.randomOffset }, set randomOffset(val) { randomModule.randomOffset = val; },
  randBytes, randFloat, randInt,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString, formatPlaybackBar,
  getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage,
  explainChannel, stringToBoolean, removePings, onMsgOneArgHelper, slashCmdResp,
  BotError,
  BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  parseArgs,
  searchRoles, searchMembers, searchUsers, searchRole, searchMember, searchUser,
  leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels,
  invokeMessageHandler,
  rps,
  BufferStream,
  clientVCManager,
  handlers,
  isId, isObject, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject,
};
