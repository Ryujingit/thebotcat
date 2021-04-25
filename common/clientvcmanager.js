// object with utility functions to manage the joining of vcs and playing of songs
var clientVCManager = {
  // returns the inital state of a guild's voice state object
  getEmptyVoiceObject: function getEmptyVoiceObject() {
    return {
      channel: null,
      connection: null,
      dispatcher: null,
      mainloop: 0,
      songslist: [],
      volume: null,
      loop: null,
      queueloop: null,
      voteskip: [],
    };
  },
  
  // all of these functions have self explanatory names, and the first parameter of each function is the guild's voice state object
  join: async function join(voice, channel) {
    if (voice.channel) clientVCManager.leave(voice);
    voice.channel = channel;
    try {
      voice.connection = await channel.join();
    } catch (e) {
      voice.channel = null;
      throw e;
    }
    voice.volume = 1;
    voice.loop = false;
    voice.queueloop = false;
  },
  
  leave: function leave(voice) {
    try { if (voice.connection) voice.connection.disconnect(); } catch (e) {}
    voice.channel = null;
    voice.connection = null;
    voice.dispatcher = null;
    voice.mainloop = 0;
    voice.songslist.length = 0;
    voice.volume = null;
    voice.loop = null;
    voice.queueloop = null;
    voice.voteskip.length = 0;
  },
  
  toggleSelfMute: function toggleSelfMute(voice) {
    voice.connection.voice.setSelfMute(!voice.connection.voice.selfMute);
  },
  
  toggleSelfDeaf: function toggleSelfDeaf(voice) {
    voice.connection.voice.setSelfDeaf(!voice.connection.voice.selfDeaf);
  },
  
  getVolume: function getVolume(voice) {
    return voice.volume;
  },
  
  setVolume: function setVolume(voice, wantedvolume) {
    if (voice.dispatcher) voice.dispatcher.setVolume(wantedvolume);
    voice.volume = wantedvolume;
  },
  
  toggleLoop: function toggleLoop(voice) {
    voice.loop = !voice.loop;
  },
  
  toggleQueueLoop: function toggleQueueLoop(voice) {
    voice.queueloop = !voice.queueloop;
  },
  
  pause: function pause(voice) {
    voice.dispatcher.pause();
  },
  
  resume: function pause(voice) {
    voice.dispatcher.resume();
  },
  
  addSong: async function addSong(voice, url, userid) {
    if (!/^https?:\/\/(?:www.)?youtube.com\/[A-Za-z0-9?&=\-_%.]+$/.test(url)) throw new common.BotError('Invalid URL Format');
    let info;
    try {
      info = await ytdl.getBasicInfo(url);
    } catch (e) {
      throw new common.BotError('Invalid URL');
    }
    let latestObj = {
      url: url,
      desc: `${info.videoDetails.title} by ${info.videoDetails.author.name}`,
      expectedLength: info.videoDetails.lengthSeconds * 1000,
      stream: null,
      userid: common.isId(userid) ? userid : null,
    };
    voice.songslist.push(latestObj);
    return latestObj;
  },
  
  voteSkip: function (voice, userid) {
    var voiceIndex = voice.voteskip.indexOf(userid);
    if (voiceIndex > -1) voice.voteskip.splice(voiceIndex, 1);
    else voice.voteskip.push(userid);
    if (voice.mainloop && voice.voteskip.length / voice.channel.members.array().filter(x => !x.user.bot).length >= 0.5) {
      voice.mainloop = 2;
      return 1;
    } else return voiceIndex > -1 ? 3 : 2;
  },
  
  forceSkip: function (voice) {
    if (voice.mainloop) voice.mainloop = 2;
  },
  
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    voice.mainloop = 1;
    try {
      while (voice.songslist.length > 0) {
        let latestObj = voice.songslist[0];
        let stream = latestObj.stream = await ytdl(latestObj.url);
        voice.dispatcher = voice.connection.play(stream, { type: 'opus', volume: voice.volume });
        while (voice.dispatcher && !voice.dispatcher.destroyed) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.dispatcher && voice.dispatcher.streamTime > voice.songslist[0].expectedLength - 2 && voice.mainloop != 3) voice.mainloop = 2;
          if (voice.mainloop == 2) {
            voice.dispatcher.destroy();
            voice.voteskip.length = 0;
          } else if (voice.mainloop == 3) {
            voice.dispatcher.destroy();
            voice.songslist.length = 0;
            voice.voteskip.length = 0;
          }
        }
        if (voice.mainloop != 2 && voice.mainloop != 3 && voice.dispatcher && voice.dispatcher.streamTime < latestObj.expectedLength - 1700)
          msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (voice.mainloop == 2 || voice.mainloop == 3) {
          voice.mainloop = 1;
          if (voice.songslist.length) voice.songslist.splice(0, 1);
        } else if (!voice.loop && voice.songslist.length) {
          if (voice.queueloop) voice.songslist.push(voice.songslist.splice(0, 1)[0]);
          else voice.songslist.splice(0, 1);
        }
        voice.dispatcher = null;
        if (!voice.loop) voice.voteskip.length = 0;
      }
    } catch (e) {
      console.error(e);
    }
    voice.mainloop = 0;
  },
  
  stopMainLoop: function stopMainLoop(voice) {
    if (voice.mainloop == 0) return;
    voice.mainloop = 3;
    return new Promise(resolve => {
      voice.dispatcher.on('destroy', resolve);
    });
  },
};

module.exports = clientVCManager;
