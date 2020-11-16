// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { recursiveReaddir } = require('./convenience');

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString } = require('./time'); 

var { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage } = require('./status');

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./workerbuffer');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions } = require('./isposition');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./permserialize');

var { searchRoles, searchMembers, searchRole, searchMember } = require('./searchcollection');

var { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./generalserialize');

var invokeMessageHandler = require('./invokemsg');

var { rps } = require('./misc');

var BufferStream = require('./bufferstream');

var clientVCManager = require('./clientvcmanager');

var handlers = require('./handlers/index');

var { isId, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject } = require('./propssavedverif');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants, recursiveReaddir,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString,
  getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage,
  arrayGet, BreakError, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, hasBotPermissions, getBotPermissions, getBotPermissionsArray, getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  searchRoles, searchMembers, searchRole, searchMember,
  leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels,
  invokeMessageHandler,
  rps,
  BufferStream,
  clientVCManager,
  handlers,
  isId, propsSavedCreateVerifiedCopy, getEmptyGuildObject, getEmptyUserObject,
};
