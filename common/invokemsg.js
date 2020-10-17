// used to artifically run a command
module.exports = function invokeMessageHandler(obj, options) {
  if (typeof obj == 'string') {
    obj = {
      content: obj,
      author: { id: '312737536546177025', tag: 'coolguy284#5720' },
      channel: { id: '688806772382761040', name: 'private-testing', send: options && options.sendcb ? options.sendcb : () => {} },
      guild: { id: '688806155530534931', name: 'Thebotcat Support' },
      member: { hasPermission: () => true, roles: { cache: { find: () => true } } },
    };
  } else if (typeof obj == 'object') {
    if (!('content' in obj)) obj.content = '';
    if (!('author' in obj)) obj.author = { id: '312737536546177025', tag: 'coolguy284#5720' };
    else if (typeof obj.author == 'string') obj.author = client.users.cache.get(obj.author);
    if (!('channel' in obj)) obj.channel = { id: '688806772382761040', name: 'private-testing', send: options && options.sendcb ? options.sendcb : () => {} };
    else if (typeof obj.channel == 'string') obj.channel = client.channels.cache.get(obj.author);
    if (!('guild' in obj)) obj.guild = { id: '688806155530534931', name: 'Thebotcat Support' };
    else if (typeof obj.guild == 'string') obj.guild = client.guilds.cache.get(obj.guild);
    if (obj.guild) {
      if (!('member' in obj)) {
        if (obj.author && obj.author.id) {
          obj.member = obj.guild.members ? obj.guild.members.cache.get(obj.author.id) : { hasPermission: () => true, roles: { cache: { find: () => true } } };
        } else obj.member = { hasPermission: () => true, roles: { cache: { find: () => true } } };
      } else if (typeof obj.member == 'string') obj.member = obj.guild.members.cache.get(obj.guild);
    }
  } else return;
  return handlers.event.message(obj);
};
