// object with utility functions to manage the joining of vcs and playing of songs
var clientVCManager = {
  // returns the inital state of a guild's voice state object
  getEmptyVoiceObject: function getEmptyVoiceObject() {
    return {
      channel: null,
      connection: null,
      dispatcher: null,
      proc: null,
      procpipe: null,
      proc2: null,
      proc2pipe: null,
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
    try { voice.proc.kill(); } catch (e) {}
    try { voice.proc2.kill(); } catch (e) {}
    try { if (voice.connection) voice.connection.disconnect(); } catch (e) {}
    voice.channel = null;
    voice.connection = null;
    voice.dispatcher = null;
    voice.proc = null;
    voice.procpipe = null;
    voice.proc2 = null;
    voice.proc2pipe = null;
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
  addSong: async function addSong(voice, query) {
    if (!/^https?:\/\/(?:www.)?youtube.com\/[A-Za-z0-9?&=\-_%.]+$/.test(query)) throw new Error('invalid url');
    let videoinfo;
    try {
      videoinfo = await ytdl.getBasicInfo(query);
    } catch (e) {
      throw new Error('invalid url');
    }
    let songslist = voice.songslist;
    let latestobj = {
      query: query,
      url: null,
      desc: `${videoinfo.videoDetails.title} by ${videoinfo.videoDetails.author.name}`,
      expectedLength: null,
    };
    let filteredFormats = videoinfo.formats.filter(x => x.mimeType.startsWith('audio/webm')).sort((a, b) => {
      let aq = common.constants.audioQualities[a.audioQuality], bq = common.constants.audioQualities[b.audioQuality];
      return aq > bq ? -1 : aq < bq ? 1 : a.bitrate > b.bitrate ? -1 : a.bitrate < b.bitrate ? 1 : 0;
    });
    latestobj.url = filteredFormats[0].url;
    latestobj.expectedLength = Number(filteredFormats[0].approxDurationMs) || 0;
    if (!/^https?:\/\/[a-z0-9.\-]+\/[A-Za-z0-9?&=\-_%.]+$/.test(latestobj.url)) throw new Error('invalid url');
    songslist.push(latestobj);
    return latestobj;
  },
  forceSkip: function (voice) {
    if (voice.mainloop) voice.mainloop = 2;
  },
  startMainLoop: async function startMainLoop(voice, msgchannel) {
    if (voice.mainloop) return;
    voice.mainloop = 1;
    try {
      while (voice.songslist.length > 0) {
        if (voice.proc2) {
          voice.proc = voice.proc2;
          voice.procpipe = voice.proc2pipe;
          voice.proc2 = null;
          voice.proc2pipe = null;
        } else {
          voice.proc = cp.spawn('ffmpeg', ['-f', 'webm', '-i', voice.songslist[0].url, '-f', 'mp3', 'pipe:1']);
          voice.procpipe = new common.BufferStream();
          voice.proc.stdout.pipe(voice.procpipe);
          //voice.proc.stderr.pipe(process.stderr);
        }
        //voice.dispatcher = voice.connection.play(voice.songslist[0].query, { volume: voice.volume });
        voice.dispatcher = voice.connection.play(voice.procpipe, { volume: voice.volume });
        while (voice.dispatcher && !voice.dispatcher.destroyed) {
          await new Promise(r => setTimeout(r, 15));
          if (voice.songslist.length > 1 && !voice.proc2) {
            voice.proc2 = cp.spawn('ffmpeg', ['-f', 'webm', '-i', voice.songslist[1].url, '-f', 'mp3', 'pipe:1']);
            voice.proc2pipe = new common.BufferStream();
            voice.proc2.stdout.pipe(voice.proc2pipe);
            //voice.proc2.stderr.pipe(process.stderr);
          }
          if (voice.dispatcher && voice.dispatcher.streamTime > voice.songslist[0].expectedLength - 2) voice.mainloop = 2;
          if (voice.mainloop == 2) {
            voice.dispatcher.destroy();
          }
        }
        if (voice.mainloop != 2 && voice.dispatcher && voice.dispatcher.streamTime < voice.songslist[0].expectedLength - 5000) msgchannel.send(`Error: something broke when playing ${voice.songslist[0].desc}`);
        if (voice.mainloop == 2) voice.mainloop = 1;
        if (!voice.loop) voice.songslist.splice(0, 1);
        try { voice.proc.kill(); } catch (e) {}
        voice.proc = null;
        voice.procpipe = null;
        voice.dispatcher = null;
      }
    } catch (e) {
      console.error(e);
    }
    voice.mainloop = 0;
  },
};

module.exports = clientVCManager;
