module.exports = [
  {
    name: 'help',
    description: '`!help` to list my commands\n`!help <command>` to print help for command',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      if (args.length == 0 || args[0] == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(args[0] == 'all' ? null : msg.guild ? props.saved.guilds[msg.guild.id] : false);
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
        let cmdobj = commands.filter(x => x.name == argstring)[0];
        if (cmdobj && cmdobj.flags & 2) {
          if (cmdobj.description)
            return msg.channel.send(cmdobj.description);
          else
            return msg.channel.send(`Command ${argstring} has no description.`);
        } else {
          return msg.channel.send(`Command ${argstring} does not exist.`);
        }
      }
    }
  },
  {
    name: 'version',
    description: '`!version` prints the version of my code',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      if (/@everyone|@here|<@(?:!?|&?)[0-9]+>/g.test(version))
        return msg.channel.send({ embed: { title: 'Version', description: `Thebotcat is version ${version}` } });
      else
        return msg.channel.send(`Thebotcat is version ${version}`);
    }
  },
  {
    name: 'uptime',
    description: '`!uptime` to see my uptime',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatUptimeMessage());
    }
  },
  {
    name: 'status',
    description: '`!status` to see my status',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatStatusMessage());
    }
  },
  {
    name: 'fullstatus',
    description: '`!fullstatus` to see my full status',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      msg.channel.send(common.getBotcatFullStatusMessage());
    }
  },
  {
    name: 'ping',
    description: '`!ping` checks my ping in the websocket, to the web, and discord',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
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
    }
  },
  {
    name: 'discord',
    description: '`!discord` for a link to my Discord Server',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my discord support server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      return msg.channel.send(discord);
    }
  },
  {
    name: 'github',
    description: '`!github` for a link to my GitHub repo',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my github repository (its completely open source)!\nhttps://github.com/thebotcat/thebotcat')
        .setFooter('Star our GitHub repo! (If you like the code of course)\n\nAnd when they clicked "make public" they felt an evil leave their presence.');
      return msg.channel.send(discord);
    }
  },
  {
    name: 'invite',
    description: '`!invite` for my invite link',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      var discord = new Discord.MessageEmbed()
        .setTitle('My invite link, to add me to any server!\nhttps://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot');
      return msg.channel.send(discord);
    }
  },
  {
    name: 'avatar',
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    flags: 14,
    async execute(msg, cmdstring, command, argstring, args) {
      let member;
      if (msg.guild) {
        if (args.length) {
          try {
            member = await common.searchMember(msg.guild.members, argstring);
            if (!member) member = msg.member;
          } catch (e) {
            console.error(e);
            member = msg.member;
          }
        } else {
          member = msg.member;
        }
      } else {
        member = { user: msg.author, displayHexColor: '#000000' };
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
    }
  },
  {
    name: 'userinfo',
    description: '`!userinfo`',
    flags: 14,
    async execute(msg, cmdstring, command, argstring, args) {
      let user;
      if (msg.guild && args.length) {
        let member = await common.searchMember(msg.guild.members, argstring);
        if (!member) return msg.channel.send('User not found in guild.');
        user = member.user;
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
          description: `**ID: ${user.id}**`,
          thumbnail: { url: user.displayAvatarURL() + '?size=64' },
          fields: [
            { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
            { name: 'Flags', value: user.flags ? user.flags.toArray().join(' ') : 'None', inline: false },
            { name: 'Avatar', value: avatarStr, inline: false },
          ],
        }
      });
    }
  },
  {
    name: 'memberinfo',
    description: '`!memberinfo`',
    flags: 6,
    async execute(msg, cmdstring, command, argstring, args) {
      let member;
      if (args.length) {
        member = await common.searchMember(msg.guild.members, argstring);
        if (!member) return msg.channel.send('Member not found in guild.');
      } else member = msg.member;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(member.id) >> 22n));
      let joinedDate = new Date(member.joinedAt);
      
      return msg.channel.send({
        embed: {
          title: `Member Info for ${member.user.tag}`,
          description: `**ID: ${member.id}**`,
          thumbnail: { url: member.user.displayAvatarURL() + '?size=64' },
          fields: [
            { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
            { name: 'Joined At', value: `${joinedDate.toISOString()} (${common.msecToHMSs(Date.now() - joinedDate.getTime())} ago)`, inline: false },
            { name: 'Roles', value: member.roles.cache.array().sort((a, b) => a.position > b.position ? -1 : 1).map(x => `<@&${x.id}>`).join(' '), inline: false },
          ],
        }
      });
    }
  },
  {
    name: 'serverinfo',
    description: '`!serverinfo`',
    flags: 6,
    execute(msg, cmdstring, command, argstring, args) {
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
      
      if (args[0] == 'all')
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
    }
  },
  {
    name: 'firstmsg',
    description: '`!firstmsg` for a link to the first message in this channel\n`!firstmsg #channel` for a link to the first message in #channel',
    flags: 14,
    async execute(msg, cmdstring, command, argstring, args) {
      let channel;
      if (args.length == 0) {
        channel = msg.channel;
      } else if (/<#[0-9]+>/.test(args[0])) {
        channel = msg.guild.channels.cache.get(args[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) channel = msg.channel;
      }
      let msgs = (await channel.messages.fetch({ after: 0, limit: 1 })).array();
      if (msgs.length == 1)
        return msg.channel.send(`First message in <#${channel.id}>: https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msgs[0].id}`);
      else
        return msg.channel.send(`<#${channel.id}> has no messages`);
    }
  },
  {
    name: 'dateid',
    description: '`!dateid <id>` to get the UTC date/time of an ID in discord',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      try {
        let id = BigInt(args[0]);
        return msg.channel.send(`Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}`);
      } catch (e) {
        return msg.channel.send('Invalid ID');
      }
    }
  },
  {
    name: 'idinfo',
    description: '`!idinfo <id>` to get the fields of an ID in discord',
    flags: 14,
    execute(msg, cmdstring, command, argstring, args) {
      try {
        let id = BigInt(args[0]);
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
    }
  },
];
