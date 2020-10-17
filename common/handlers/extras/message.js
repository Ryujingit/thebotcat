module.exports = [
  msg => {
    if (msg.channel.id == '738599826765250632') {
      msg.delete();
      client.channels.cache.get('738593863958003756').send(`${msg.author.tag}: ${msg.content}`);
      props.saved.sendmsgid = msg.id;
      schedulePropsSave();
    }
    if (msg.channel.id == '738602247549616170' && (props.saved.lastnum == null || props.saved.lastnum < 5000)) {
      if (msg.embeds.length || props.saved.lastnum != null && Number(msg.content) != props.saved.lastnum + 1) { msg.delete(); console.log(`[${new Date().toISOString()}] count to 5000, deleted ${msg.author.tag}: ${msg.content}`); }
      else props.saved.lastnum = Number(msg.content);
      if (props.saved.lastnum >= 5000)
        msg.channel.send('The goal of 5000 has been reached, this channel has now been freed.');
      props.saved.lastnumid = msg.id;
      schedulePropsSave();
    }
    if ((msg.channel.id == '732083047649771604' || msg.channel.id == '732082491611152443') && msg.author.id == '159985870458322944') {
      msg.publish();
    }
    if (msg.content == 'pp' && msg.channel.id == '711745085984866344') msg.reply('fuck you');
  },
];
