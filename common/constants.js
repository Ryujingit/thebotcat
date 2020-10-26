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
    DELETE_MESSAGES: 1 << 8,
    LOCK_CHANNEL:    1 << 9,
    MUTE:            1 << 10,
    KICK:            1 << 11,
    BAN:             1 << 12,
    MANAGE_BOT:      1 << 13,
  },
  botRolePermDef: 0b00000001110101,
  botRolePermMod: 0b00111111111111,
  botRolePermAll: 0b11111111111111,
};
