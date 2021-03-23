module.exports = [
  {
    name: 'help',
    description: '`!help` to list my commands\n`!help <command>` to print help for command',
    description_slash: 'help on commands',
    options: [ { type: 3, name: 'command', description: 'the command' } ],
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      if (rawArgs.length == 0 || rawArgs[0] == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(rawArgs[0] == 'all' ? null : msg.guild ? props.saved.guilds[msg.guild.id] : false);
        return msg.channel.send({
          embed: {
            title: `Commands (${commandsList.length})`,
            description: 'Run `!help <command>` for help on a specific command.',
            fields: Object.keys(commandsCategorized).map(
              x => ({ name: `${x} (${commandsCategorized[x].length})`, value: commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None', inline: false })
            ),
          }
        });
      } else {
        let name = o.asOneArg;
        let cmdobj = commands.filter(x => x.name == name)[0];
        if (cmdobj && cmdobj.flags & 2) {
          if (cmdobj.description)
            return msg.channel.send(cmdobj.description);
          else
            return msg.channel.send(`Command ${name} has no description.`);
        } else {
          return msg.channel.send(`Command ${name} does not exist.`);
        }
      }
    },
    execute_slash(o, interaction, command, args) {
      if (args.length == 0 || args[0].value == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(args[0] && args[0].value == 'all' ? null : o.guild ? props.saved.guilds[o.guild.id] : false);
        return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: 3,
            data: {
              embeds: [{
                title: `Commands (${commandsList.length})`,
                description: 'Run `!help <command>` for help on a specific command.',
                fields: Object.keys(commandsCategorized).map(
                  x => ({ name: `${x} (${commandsCategorized[x].length})`, value: commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None', inline: false })
                ),
              }],
              flags: 64,
              allowed_mentions: { parse: [] },
            },
          } });
      } else {
        let name = args[0].value;
        let cmdobj = commands.filter(x => x.name == name)[0];
        if (cmdobj && cmdobj.flags & 2) {
          if (cmdobj.description)
            return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
              type: 3,
              data: { content: cmdobj.description, flags: 64, allowed_mentions: { parse: [] } },
            } });
          else
            return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
              type: 3,
              data: { content: `Command ${name} has no description.`, flags: 64, allowed_mentions: { parse: [] } },
            } });
        } else {
          return client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
            type: 3,
            data: { content: `Command ${name} does not exist.`, flags: 64, allowed_mentions: { parse: [] } },
          } });
        }
      }
    },
  },
  {
    name: 'version',
    description: '`!version` prints the version of my code',
    description_slash: 'prints my version',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      return msg.channel.send(`Thebotcat is version ${version}`, { allowedMentions: { parse: [] } });
    },
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { content: `Thebotcat is version ${version}`, flags: 64, allowed_mentions: { parse: [] } },
      } });
    },
  },
  {
    name: 'uptime',
    description: '`!uptime` to see my uptime',
    description_slash: 'prints my uptime',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatUptimeMessage());
    },
    execute_slash(o, interaction, command, args) {
      client.api.interactions(interaction.id, interaction.token).callback.post({ data: {
        type: 3,
        data: { embeds: [common.getBotcatUptimeMessage().embed], flags: 64 },
      } });
    },
  },
  {
    name: 'status',
    description: '`!status` to see my status',
    description_slash: 'prints my status',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatStatusMessage());
    },
  },
  {
    name: 'fullstatus',
    description: '`!fullstatus` to see my full status',
    description_slash: 'prints my fullstatus',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatFullStatusMessage());
    },
  },
  {
    name: 'ping',
    description: '`!ping` checks my ping in the websocket, to the web, and discord',
    description_slash: 'prints my ping',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      return new Promise((resolve, reject) => {
        msg.channel.send('Checking Ping').then(m => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = m.createdTimestamp - msg.createdTimestamp;
            var wsPing = client.ws.ping;
            
            resolve(m.edit(`*Bot Ping:* **${botPing}**ms\n*WS Ping:* **${wsPing}**ms\n*API Ping:* **${apiPing}**ms`));
          });
        });
      });
    },
  },
  {
    name: 'discord',
    description: '`!discord` for a link to my Discord Server',
    description_slash: 'sends a link to my support server',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my discord support server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      return msg.channel.send(discord);
    },
  },
  {
    name: 'github',
    description: '`!github` for a link to my GitHub repo',
    description_slash: 'sends a link to my github repo url',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my github repository (its completely open source)!\nhttps://github.com/thebotcat/thebotcat')
        .setFooter('Star our GitHub repo! (If you like the code of course)\n\nAnd when they clicked "make public" they felt an evil leave their presence.');
      return msg.channel.send(discord);
    },
  },
  {
    name: 'invite',
    description: '`!invite` for my invite link',
    description_slash: 'sends my server invite link',
    flags: 0b111110,
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('My invite link, to add me to any server!\nhttps://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot');
      return msg.channel.send(discord);
    },
  },
  {
    name: 'avatar',
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    description_slash: 'displays someone\'s avatar or yours if a user isn\'t provided',
    flags: 0b111110,
    options: [ { type: 6, name: 'user', description: 'a user to display the avatar of' } ],
    async execute(o, msg, rawArgs) {
      let member;
      if (rawArgs.length) {
        if (msg.guild) {
          let potentialMember = await common.searchMember(msg.guild.members, o.asOneArg);
          if (potentialMember) member = potentialMember;
          else {
            let user = await common.searchUser(o.asOneArg);
            if (user) member = { user, displayHexColor: '#000000' };
            else return msg.channel.send('User not found.');
          }
        } else {
          let user = await common.searchUser(o.asOneArg);
          if (user) member = { user: user, displayHexColor: '#000000' };
          else return msg.channel.send('User not found.');
        }
      } else {
        if (msg.guild) member = msg.member;
        else member = { user: msg.author, displayHexColor: '#000000' };
      }
      
      let avatarURL = member.user.displayAvatarURL({ dynamic: true });
      let animated = member.user.avatar && member.user.avatar.startsWith('a_'), avatarEmbed;
      if (member.user.avatar == null) {
        let url = member.user.defaultAvatarURL;
        avatarEmbed = new Discord.MessageEmbed()
          .setTitle(`Avatar for ${member.user.tag}`)
          .setDescription(
            `userid: ${member.user.id}\n` +
            `links: [default](${avatarURL}) (avatar is default)`
            )
          .setImage(url)
          .setColor(member.displayHexColor);
      } else {
        let baseurl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`;
        if (animated)
          avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`Avatar for ${member.user.tag}`)
            .setDescription(
              `userid: ${member.user.id}\n` +
              `links: [default](${avatarURL}), ` +
              `[normal\xa0png](${baseurl}.png), ` +
              `[normal\xa0webp](${baseurl}.webp), ` +
              `[normal\xa0gif](${baseurl}.gif)\n` +
              `big links: [big png](${baseurl}.png?size=4096), ` +
              `[big\xa0webp](${baseurl}.webp?size=4096), ` +
              `[big\xa0gif](${baseurl}.gif?size=4096)`
              )
            .setImage(`${baseurl}.gif?size=4096`)
            .setColor(member.displayHexColor);
        else
          avatarEmbed = new Discord.MessageEmbed()
            .setTitle(`Avatar for ${member.user.tag}`)
            .setDescription(
              `userid: ${member.user.id}\n` +
              `links: [default](${avatarURL}), ` +
              `[normal\xa0png](${baseurl}.png), ` +
              `[normal\xa0webp](${baseurl}.webp), ` +
              `[big\xa0png](${baseurl}.png?size=4096), ` +
              `[big\xa0webp](${baseurl}.webp?size=4096)`
              )
            .setImage(`${baseurl}.png?size=4096`)
            .setColor(member.displayHexColor);
      }
      
      return msg.channel.send(avatarEmbed);
    },
  },
  {
    name: 'userinfo',
    description: '`!userinfo [@someone]` to display information about a user',
    description_slash: 'displays information about a user or you if a user isn\'t provided',
    flags: 0b111110,
    options: [ { type: 6, name: 'user', description: 'a user to display information about' } ],
    async execute(o, msg, rawArgs) {
      let user;
      if (rawArgs.length) {
        if (msg.guild) {
          let member = await common.searchMember(msg.guild.members, o.asOneArg);
          if (member) user = member.user;
          else {
            let potentialUser = await common.searchUser(o.asOneArg);
            if (potentialUser) user = potentialUser;
            else return msg.channel.send('User not found.');
          }
        } else {
          let potentialUser = await common.searchUser(o.asOneArg);
          if (potentialUser) user = potentialUser;
          else return msg.channel.send('User not found.');
        }
      } else user = msg.author;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(user.id) >> 22n));
      let avatarURL = user.displayAvatarURL({ dynamic: true });
      let animated = user.avatar && user.avatar.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
      let avatarStr = user.avatar == null ? `[default](${avatarURL}) (avatar is default)` :
        (animated ?
        `[default](${avatarURL}), ` +
        `[normal\xa0png](${baseurl}.png), ` +
        `[normal\xa0webp](${baseurl}.webp), ` +
        `[normal\xa0gif](${baseurl}.gif), ` +
        `[big\xa0png](${baseurl}.png?size=4096), ` +
        `[big\xa0webp](${baseurl}.webp?size=4096), ` +
        `[big\xa0gif](${baseurl}.gif?size=4096)` :
        `[default](${avatarURL}), ` +
        `[normal\xa0png](${baseurl}.png), ` +
        `[normal\xa0webp](${baseurl}.webp), ` +
        `[big\xa0png](${baseurl}.png?size=4096), ` +
        `[big\xa0webp](${baseurl}.webp?size=4096)`);
      
      return msg.channel.send({
        embed: {
          title: `User Info for ${user.tag}`,
          description: `**ID: ${user.id}, Bot: ${user.bot ? 'Yes' : 'No'}**`,
          thumbnail: { url: user.displayAvatarURL() + '?size=64' },
          fields: [
            { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
            { name: 'Flags', value: user.flags && user.flags.toArray().length ? user.flags.toArray().join(' ') : 'None', inline: false },
            { name: 'Avatar', value: avatarStr, inline: false },
          ],
        }
      });
    },
  },
  {
    name: 'memberinfo',
    description: '`!memberinfo [@someone]` to display information about a user',
    description_slash: 'displays information about a member or you if a member isn\'t provided',
    flags: 0b110110,
    options: [ { type: 6, name: 'member', description: 'a member to display information about' } ],
    async execute(o, msg, rawArgs) {
      let member;
      if (rawArgs.length) {
        member = await common.searchMember(msg.guild.members, o.asOneArg);
        if (!member) return msg.channel.send('Member not found in guild.');
      } else member = msg.member;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(member.id) >> 22n));
      let joinedDate = new Date(member.joinedAt);
      
      return msg.channel.send({
        embed: {
          title: `Member Info for ${member.user.tag}`,
          description: `**ID: ${member.id}**`,
          color: member.displayColor,
          thumbnail: { url: member.user.displayAvatarURL() + '?size=64' },
          fields: [
            { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
            { name: 'Joined At', value: `${joinedDate.toISOString()} (${common.msecToHMSs(Date.now() - joinedDate.getTime())} ago)`, inline: false },
            { name: 'Roles', value: member.roles.cache.array().sort((a, b) => a.position > b.position ? -1 : 1).map(x => `<@&${x.id}>`).join(' '), inline: false },
          ],
        }
      });
    },
  },
  {
    name: 'serverinfo',
    description: '`!serverinfo` to view information about the current server',
    description_slash: 'displays information about the current server',
    flags: 0b110110,
    execute(o, msg, rawArgs) {
      let guild = msg.guild;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(guild.id) >> 22n));
      let iconURL = guild.iconURL();
      let animated = guild.icon && guild.icon.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
      let iconStr = guild.icon == null ? `Server icon is default` :
        (animated ?
        `[default](${iconURL}), ` +
        `[normal\xa0png](${baseurl}.png), ` +
        `[normal\xa0webp](${baseurl}.webp), ` +
        `[normal\xa0gif](${baseurl}.gif), ` +
        `[big\xa0png](${baseurl}.png?size=4096), ` +
        `[big\xa0webp](${baseurl}.webp?size=4096), ` +
        `[big\xa0gif](${baseurl}.gif?size=4096)` :
        `[default](${iconURL}), ` +
        `[normal\xa0png](${baseurl}.png), ` +
        `[normal\xa0webp](${baseurl}.webp), ` +
        `[big\xa0png](${baseurl}.png?size=4096), ` +
        `[big\xa0webp](${baseurl}.webp?size=4096)`);
      
      if (rawArgs[0] == 'all')
        return msg.channel.send({
          embed: {
            title: `Information for ${guild.name}`,
            description: `**ID: ${guild.id}**`,
            thumbnail: { url: guild.iconURL() + '?size=64' },
            fields: [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Icon', value: iconStr, inline: false },
              { name: 'Members', value: guild.memberCount, inline: true },
              { name: 'Member Cap', value: guild.maximumMembers, inline: true },
            ],
          }
        });
      else
        return msg.channel.send({
          embed: {
            title: `Information for ${guild.name}`,
            description: `**ID: ${guild.id}**`,
            thumbnail: { url: guild.iconURL() + '?size=64' },
            fields: [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Icon', value: iconStr, inline: false },
              { name: 'Members', value: guild.memberCount, inline: true },
            ],
          }
        });
    },
  },
  {
    name: 'firstmsg',
    description: '`!firstmsg` for a link to the first message in this channel\n`!firstmsg #channel` for a link to the first message in #channel',
    description_slash: 'sends a link to the first message in this channel or a certain channel',
    flags: 0b111110,
    options: [ { type: 7, name: 'channel', description: 'the channel' } ],
    async execute(o, msg, rawArgs) {
      let channel;
      if (rawArgs.length == 0) {
        channel = msg.channel;
      } else if (/<#[0-9]+>/.test(rawArgs[0])) {
        channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) channel = msg.channel;
      }
      let msgs = (await channel.messages.fetch({ after: 0, limit: 1 })).array();
      if (msgs.length == 1)
        return msg.channel.send(`First message in <#${channel.id}>: https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msgs[0].id}`);
      else
        return msg.channel.send(`<#${channel.id}> has no messages`);
    },
  },
  {
    name: 'dateid',
    description: '`!dateid <id>` to get the UTC date and time of an ID in discord',
    description_slash: 'prints the UTC date and time of an ID in discord',
    flags: 0b111110,
    options: [ { type: 3, name: 'id', description: 'the id', required: true } ],
    execute(o, msg, rawArgs) {
      try {
        let id = BigInt(rawArgs[0]);
        return msg.channel.send(`Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}`);
      } catch (e) {
        return msg.channel.send('Invalid ID');
      }
    },
  },
  {
    name: 'idinfo',
    description: '`!idinfo <id>` to get the fields of an ID in discord',
    description_slash: 'prints the fields of an ID in discord',
    flags: 0b111110,
    options: [ { type: 3, name: 'id', description: 'the id', required: true } ],
    execute(o, msg, rawArgs) {
      try {
        let id = BigInt(rawArgs[0]);
        return msg.channel.send({
          embed: {
            title: 'ID Info',
            description: `**ID: ${id}**`,
            fields: [
              { name: 'Date', value: new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString(), inline: false },
              { name: 'Worker ID', value: String((id & 0x3E0000n) >> 17n), inline: true },
              { name: 'Process ID', value: String((id & 0x1F000n) >> 12n), inline: true },
              { name: 'Increment', value: String(id & 0xFFFn), inline: true },
            ],
          }
        });
      } catch (e) {
        return msg.channel.send('Invalid ID');
      }
    },
  },
];
