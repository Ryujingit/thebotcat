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
  },
  
  leave: function leave(voice) {
    try { if (voice.connection) voice.connection.disconnect(); } catch (e) {}
    voice.channel = null;
    voice.connection = null;
    voice.dispatcher = null;
    voice.mainloop = 0;
    voice.songslist.splice(0, Infinity);
    voice.volume = null;
    voice.loop = null;
  },
  
  getVolume: function getVolume(voice) {
    return voice.volume;
  },
  
  setVolume: function setVolume(voice, wantedvolume) {
    if (voice.dispatcher) voice.dispatcher.setVolume(wantedvolume);
    voice.volume = wantedvolume;
  },
  
  getLoop: function getLoop(voice) {
    return voice.loop;
  },
  
  toggleLoop: function toggleLoop(voice) {
    voice.loop = !voice.loop;
  },
  
  pause: function pause(voice) {
    voice.dispatcher.pause();
  },
  
  resume: function pause(voice) {
    voice.dispatcher.resume();
  },
  
  addSong: async function addSong(voice, url) {
    if (!/^https?:\/\/(?:www.)?youtube.com\/[A-Za-z0-9?&=\-_%.]+$/.test(url)) throw new Error('invalid url');
    let latestObj = {
      url: url,
      desc: null,
      expectedLength: null,
      stream: null,
    };
    voice.songslist.push(latestObj);
    return latestObj;
  },
  
  forceSkip: function (voice) {
    if (voice.mainloop) voice.mainloop = 2;
  },
  
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    voice.mainloop = 1;
    try {
      while (voice.songslist.length > 0) {
        let stream = voice.songslist[0].stream = ytdl(voice.songslist[0].url);
        stream.on('info', (info, format) => {
          console.log(infof = info);
          latestObj.desc = `${info.videoDetails.title} by ${info.videoDetails.author.name}`;
          latestObj.expectedLength = info.length_seconds * 1000;
        });
        voice.dispatcher = voice.connection.play(stream, { volume: voice.volume });
        while (voice.dispatcher && !voice.dispatcher.destroyed) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.dispatcher && voice.dispatcher.streamTime > voice.songslist[0].expectedLength - 2) voice.mainloop = 2;
          if (voice.mainloop == 2) {
            voice.dispatcher.destroy();
          } else if (voice.mainloop == 3) {
            voice.dispatcher.destroy();
            voice.songslist.length = 0;
          }
        }
        if (voice.mainloop != 2 && voice.mainloop != 3 && voice.dispatcher && voice.dispatcher.streamTime < voice.songslist[0].expectedLength - 5000)
          msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (voice.mainloop == 2 || voice.mainloop == 3) voice.mainloop = 1;
        if (!voice.loop) voice.songslist.splice(0, 1);
        voice.dispatcher = null;
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
