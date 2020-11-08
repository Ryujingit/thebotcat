// purely for formatting, result is not a valid id string
function leftPadID(id) {
  return id.padStart(19, ' ');
}

/* returns a string with contents:
{id of guild} {name of guild} {member count of guild}
...
*/
function getFancyGuilds() {
  var guilds = client.guilds.cache.keyArray().map(x => client.guilds.cache.get(x));
  var maxGuildNameLen = guilds.reduce((a, c) => Math.max(a, c.name.length), 0);
  return guilds.map(x => x.id + ' ' + x.name.padEnd(maxGuildNameLen, ' ') + ' ' + x.memberCount).join('\n');
}

/* returns:
  {
    uncategorized: [ array of uncategorized channels ]
    categorized: [
      {
        channel: category channel,
        children: [ array of channels inside category ]
      }
    ]
  }
  (everything is sorted in the order that a discord client would show them)
*/
function getSortedChannels(guild) {
  var channels = guild.channels.cache.keyArray().map(x => guild.channels.cache.get(x));
  var categoryChannels = [];
  var unCategorizedChannels = [];
  var nonCategoryChannels = {};
  var channel, id;
  for (var i = 0; i < channels.length; i++) {
    channel = channels[i];
    if (channel.type == 'category') categoryChannels.push(channel);
    else {
      id = channel.parent != null ? channel.parent.id : 'uncategorized';
      if (id == 'uncategorized') {
        unCategorizedChannels.push(channel);
      } else {
        if (id in nonCategoryChannels) nonCategoryChannels[id].push(channel);
        else nonCategoryChannels[id] = [ channel ];
      }
      
    }
  }
  return {
    uncategorized: unCategorizedChannels,
    categorized: categoryChannels
      .sort((a, b) => a.rawPosition > b.rawPosition ? 1 : a.rawPosition < b.rawPosition ? -1 : 0)
      .map(x => ({
        channel: x,
        children: nonCategoryChannels[x.id].sort((a, b) => a.rawPosition > b.rawPosition ? 1 : a.rawPosition < b.rawPosition ? -1 : 0),
      })),
  }
}

/* returns a string with contents:
uncategorized:
  {id of 1st uncategorized channel} {1 letter type of ...} {name of ...} {is visible} {is nsfw}
  ...
{id of 1st category channel} {name of ...} {is visible}:
  {id of 1st channel in category} {1 letter type of ...} {name of ...} {is visible} {is nsfw}
  ...
...
*/
function getFancyChannels(guild) {
  var sorted = getSortedChannels(guild);
  var maxChanNameLen = 14;
  maxChanNameLen = sorted.uncategorized.reduce((a, c) => Math.max(5 + c.id.length + c.name.length, a), maxChanNameLen);
  maxChanNameLen = sorted.categorized.reduce(
    (a, c) => Math.max(
      3 + c.channel.id.length + c.channel.name.length,
      c.children.reduce((a2, c2) => Math.max(5 + c2.id.length + c2.name.length, a2), 0),
      a
    ),
    maxChanNameLen
  );
  return 'uncategorized:\n' +
    (sorted.uncategorized.length > 0 ?
      sorted.uncategorized.map(x => ('  ' + x.id + ' ' + x.type[0] + ' ' + x.name).padEnd(maxChanNameLen, ' ') + ' ' + (''+x.viewable).padEnd(5, ' ') + ' ' + (x.nsfw != null ? x.nsfw : null)).join('\n') + '\n' : '') +
    sorted.categorized.map(x =>
      (x.channel.id + ' ' + x.channel.name + ':').padEnd(maxChanNameLen, ' ') + ' ' + (''+x.channel.viewable).padEnd(5, ' ') + ' ' + (x.channel.nsfw != null ? x.channel.nsfw : null) + '\n' +
      x.children.map(y => ('  ' + y.id + ' ' + y.type[0] + ' ' + y.name).padEnd(maxChanNameLen, ' ') + ' ' + (''+y.viewable).padEnd(5, ' ') + ' ' + (y.nsfw != null ? y.nsfw : null)).join('\n')
    ).join('\n');
}

module.exports = { leftPadID, getFancyGuilds, getSortedChannels, getFancyChannels };
