// this module contains some code used by all thebotcat's modules, or rather all the other files in this folder do, while this file brings them all together

var constants = require('./constants');

var { msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString } = require('./time'); 

var { getBotcatUptimeMessage, getBotcatStatusMessage } = require('./status');

var { BreakError, arrayGet, sendObjThruBuffer, receiveObjThruBuffer } = require('./workerbuffer');

var { isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod, getPermissions } = require('./isposition');

var { serializePermissionOverwrites, partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites, serializedPermissionsEqual } = require('./permserialize');

var searchCollection = require('./searchcollection');

var { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels } = require('./generalserialize');

var invokeMessageHandler = require('./invokemsg');

var { rps } = require('./misc');

var BufferStream = require('./bufferstream');

var clientVCManager = require('./clientvcmanager');

var handlers = require('./handlers/index');

// module.exports is the default object that a node.js module uses to export functions and such, when you do require(), you get this object
// also an interesting way to make js cleaner is by shortening { e: e } to { e }, and the compiler still understands
module.exports = {
  constants,
  msecToHMS, msecToHMSs, fancyDateStringWD, fancyDateStringMD, fancyDateString,
  getBotcatUptimeMessage, getBotcatStatusMessage,
  arrayGet, BreakError, sendObjThruBuffer, receiveObjThruBuffer,
  isDeveloper, isConfirmDeveloper, isOwner, isAdmin, isMod,
  getPermissions,
  serializePermissionOverwrites,
  partialDeserializePermissionOverwrites, completeDeserializePermissionOverwrites,
  serializedPermissionsEqual,
  searchCollection,
  leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels,
  invokeMessageHandler,
  rps,
  BufferStream,
  clientVCManager,
  handlers,
};
