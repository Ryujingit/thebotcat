// some constants
module.exports = {
  // used in youtube video downloader code, dont worry about it
  audioQualities: {
    'AUDIO_QUALITY_LOW': 1,
    'AUDIO_QUALITY_MEDIUM': 2,
    'AUDIO_QUALITY_HIGH': 3,
  },
  
  botRolePermBits: {
    NORMAL:          1 << 0,
    BYPASS_LOCK:     1 << 1,
    JOIN_VC:         1 << 2,
    LEAVE_VC:        1 << 3,
    PLAY_SONG:       1 << 4,
    PLAY_PLAYLIST:   1 << 5,
    VOTESKIP:        1 << 6,
    FORCESKIP:       1 << 7,
    REMOTE_CMDS:     1 << 8,
    DELETE_MESSAGES: 1 << 9,
    LOCK_CHANNEL:    1 << 10,
    MUTE:            1 << 11,
    KICK:            1 << 12,
    BAN:             1 << 13,
    MANAGE_BOT:      1 << 14,
    MANAGE_BOT_FULL: 1 << 15,
    SLOWMODE:        1 << 16,
  },
  botRolePermBitsInv: {},
  botRolePermDef: 0b0000000001110101,
  botRolePermMod: 0b1001111111111111,
  botRolePermAll: 0b1111111111111111,
};

Object.keys(module.exports.botRolePermBits).forEach(x => module.exports.botRolePermBitsInv[module.exports.botRolePermBits[x]] = x);
