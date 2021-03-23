module.exports = [
  o => {
    if (o.command != 'lathe' && o.command != 'lathe2' && o.command != 'lathe3' && o.command != 'lathe4') return;
    
    let author = o.interaction.user ? `${o.interaction.user.username}#${o.interaction.user.discriminator} (${o.interaction.user.id})` : `${o.interaction.member.user.username}#${o.interaction.member.user.discriminator} (${o.interaction.member.user.id})`;
    let authorname = o.interaction.user ? o.interaction.user.username : o.interaction.member.user.username;
    let location = `${o.interaction.guild_id && client.guilds.cache.get(o.interaction.guild_id) ? client.guilds.cache.get(o.interaction.guild_id).name : 'dms'}:${o.interaction.channel_id && client.channels.cache.get(o.interaction.channel_id) ? client.channels.cache.get(o.interaction.channel_id).name : 'null'}`;
    
    nonlogmsg(`interaction ${location} ${author} ${util.inspect(o.command)} ${util.inspect(o.args)}`);
  },
];
