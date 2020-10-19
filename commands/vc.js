module.exports = [
  {
    name: 'join',
    full_string: false,
    description: '`!join` for me to join the voice channel you are in\n`!join <channel>` for me to join a voice channel',
    public: true,
    async execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Join/leave features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot join voice channel, guild not in database');
      let channel;
      if (args.length == 0) {
        if (!msg.member.voice.channelID) return msg.channel.send('You are not in a voice channel.');
        channel = client.channels.cache.get(msg.member.voice.channelID);
      } else if (args.length == 1) {
        if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg)))
          return msg.channel.send('Only admins and mods can get me to remotely join a voice channel.');
        let channelid;
        if (/^<#[0-9]+>$/.test(args[0])) channelid = args[0].slice(2, args[0].length - 1);
        channel = msg.guild.channels.cache.get(channelid);
        if (!channel) return msg.channel.send('Invalid channel mention.');
      }
      if (guilddata.voice.channel && guilddata.voice.channel.id == channel.id) return msg.channel.send(`Already joined channel <#${channel.id}>`);
      let channelPerms = channel.permissionsFor(msg.member);
      let requiresMod = channel.full || guilddata.voice.channel && guilddata.voice.channel.members.keyArray().length == 1 && guilddata.voice.songslist.length == 0;
      if (requiresMod && !(
        common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.has('MOVE_MEMBERS')
      ) || !requiresMod && !(
        common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.has('MOVE_MEMBERS') || channelPerms.has('CONNECT')
      )) return msg.channel.send('You do not have permission to get me to join the voice channel you are in.');
      try {
        await common.clientVCManager.join(guilddata.voice, channel);
        return msg.channel.send(`Joined channel <#${channel.id}>`);
      } catch (e) {
        console.error(e);
        return msg.channel.send(`Error in joining channel <#${channel.id}>`);
      }
    }
  },
  {
    name: 'leave',
    full_string: false,
    description: '`!leave` for me to leave the voice channel I am in',
    public: true,
    execute(msg, cmdstring, command, argstring, args) {
      if (!(props.saved.feat.audio & 1)) return msg.channel.send('Join/leave features are disabled');
      let guilddata;
      if (!(guilddata = props.saved.guilds[msg.guild.id])) return msg.channel.send('Error: cannot join voice channel, guild not in database');
      let channel;
      if (!(channel = guilddata.voice.channel)) return msg.channel.send('I\'m not in a voice channel');
      let vcmembers = channel.members.keyArray();
      if (!(common.isDeveloper(msg) || common.isAdmin(msg) || common.isMod(msg) || channelPerms.has('MOVE_MEMBERS') || channelPerms.has('DISCONNECT') || vcmembers.length == 2 && vcmembers.includes(msg.author.id) || vcmembers.length == 1 && guilddata.voice.songslist.length == 0))
        return msg.channel.send('You do not have permission to get me to leave the voice channel.');
      common.clientVCManager.leave(guilddata.voice);
      return msg.channel.send(`Left channel <#${channel.id}>`);
    }
  },
];
