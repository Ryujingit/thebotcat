module.exports = [
  {
    name: 'help',
    description: '`!help` to list my commands\n`!help <command>` to print help for command',
    description_slash: 'help on commands',
    options: [
      { type: 3, name: 'command', description: 'the command' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
            return msg.channel.send(`Command \`${name}\` has no description.`);
        } else {
          return msg.channel.send(`Command \`${name}\` does not exist.`);
        }
      }
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      if (!args[0] || args[0].value == 'all') {
        let [commandsList, commandsCategorized] = getCommandsCategorized(args[0] && args[0].value == 'all' ? null : o.guild ? props.saved.guilds[o.guild.id] : false, true);
        return common.slashCmdResp(interaction, emphemeral,
          `Commands (${commandsList.length})\n` +
          'Run `!help <command>` for help on a specific command.\n\n' +
          Object.keys(commandsCategorized).map(
            x => (`${x} (${commandsCategorized[x].length})\n` +
              commandsCategorized[x].map(y => `\`${y.name}\``).join(', ') || 'None')
          ).join('\n\n'));
      } else {
        let name = args[0].value;
        let cmdobj = commands.filter(x => x.name == name)[0];
        if (cmdobj && cmdobj.flags & 2) {
          if (cmdobj.description)
            return common.slashCmdResp(interaction, emphemeral, cmdobj.description);
          else
            return common.slashCmdResp(interaction, emphemeral, `Command \`${name}\` has no description.`);
        } else {
          return common.slashCmdResp(interaction, emphemeral, `Command \`${name}\` does not exist.`);
        }
      }
    },
  },
  {
    name: 'version',
    description: '`!version` prints the version of my code',
    description_slash: 'prints my version',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      return msg.channel.send(`Thebotcat is version ${version}`, { allowedMentions: { parse: [] } });
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      return common.slashCmdResp(interaction, emphemeral, `Thebotcat is version ${version}`);
    },
  },
  {
    name: 'uptime',
    description: '`!uptime` to see my uptime',
    description_slash: 'prints my uptime',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatUptimeMessage());
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, common.getBotcatUptimeMessage(false));
    },
  },
  {
    name: 'status',
    description: '`!status` to see my status',
    description_slash: 'prints my status',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatStatusMessage());
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, common.getBotcatStatusMessage(false));
    },
  },
  {
    name: 'fullstatus',
    description: '`!fullstatus` to see my full status',
    description_slash: 'prints my fullstatus',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      msg.channel.send(common.getBotcatFullStatusMessage());
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, common.getBotcatFullStatusMessage(false));
    },
  },
  {
    name: 'ping',
    description: '`!ping` checks my ping in the websocket, to the web, and discord',
    description_slash: 'checks my ping in the websocket, to the web, and discord',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
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
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      return new Promise((resolve, reject) => {
        common.slashCmdResp(interaction, emphemeral, 'Checking Ping').then(v => {
          let beforerequest = Date.now(), afterrequest;
          https.get('https://example.com', res => {
            afterrequest = Date.now();
            res.socket.destroy();
            
            var botPing = afterrequest - beforerequest;
            var apiPing = BigInt(beforerequest) - (BigInt(interaction.id) >> 22n) - BigInt(new Date('2015').getTime());
            var wsPing = client.ws.ping;
            
            resolve(client.api.webhooks(client.user.id, interaction.token).messages['@original'].patch({ data: { content: `*Bot Ping:* **${botPing}**ms\n*WS Ping:* **${wsPing}**ms\n*API Ping:* **${apiPing}**ms (inaccurate for slash commands)` } }));
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
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my discord support server if you wanna join click the link! https://discord.gg/NamrBZc')
        .setFooter('Server for thebotcat discord bot come along and say hi!');
      return msg.channel.send(discord);
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, 'Support server: https://discord.gg/NamrBZc');
    },
  },
  {
    name: 'github',
    description: '`!github` for a link to my GitHub repo',
    description_slash: 'sends a link to my github repo url',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('This is my github repository (its completely open source)!\nhttps://github.com/thebotcat/thebotcat')
        .setFooter('Star our GitHub repo! (If you like the code of course)\n\nAnd when they clicked "make public" they felt an evil leave their presence.');
      return msg.channel.send(discord);
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, 'Github Repository: https://github.com/thebotcat/thebotcat');
    },
  },
  {
    name: 'invite',
    description: '`!invite` for my invite link',
    description_slash: 'sends my server invite link',
    flags: 0b111110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      var discord = new Discord.MessageEmbed()
        .setTitle('My invite link, to add me to any server!\nhttps://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot+applications.commands');
      return msg.channel.send(discord);
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      common.slashCmdResp(interaction, emphemeral, 'Bot Invite Link: <https://discord.com/api/oauth2/authorize?client_id=682719630967439378&permissions=1379265775&scope=bot+applications.commands>');
    },
  },
  {
    name: 'avatar',
    description: '`!avatar` displays your avatar\n`!avatar @someone` displays someone\'s avatar',
    description_slash: 'displays someone\'s avatar or yours if a user isn\'t provided',
    flags: 0b111110,
    options: [
      { type: 6, name: 'user', description: 'a user to display the avatar of' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
      let animated = member.user.avatar && member.user.avatar.startsWith('a_');
      if (member.user.avatar == null) {
        return msg.channel.send(new Discord.MessageEmbed()
          .setTitle(`Avatar for ${member.user.tag}`)
          .setDescription(
            `userid: ${member.user.id}\n` +
            `links: [default](${avatarURL}) (avatar is default)`
            )
          .setImage(avatarURL)
          .setColor(member.displayHexColor));
      } else {
        let baseurl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`;
        if (animated)
          return msg.channel.send(new Discord.MessageEmbed()
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
            .setColor(member.displayHexColor));
        else
          return msg.channel.send(new Discord.MessageEmbed()
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
            .setColor(member.displayHexColor));
      }
    },
    async execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      
      let member;
      if (args[0]) {
        if (o.guild) {
          try {
            let potentialMember = await o.guild.members.fetch(args[0].value);
            member = potentialMember;
          } catch (e) {
            let user = await client.users.fetch(args[0].value);
            if (user) member = { user, displayHexColor: '#000000' };
            else return common.slashCmdResp(interaction, emphemeral, 'User not found.');
          }
        } else {
          let user = await client.users.fetch(args[0].value);
          if (user) member = { user: user, displayHexColor: '#000000' };
          else return common.slashCmdResp(interaction, emphemeral, 'User not found.');
        }
      } else {
        if (o.guild) member = o.member;
        else member = { user: o.author, displayHexColor: '#000000' };
      }
      
      let avatarURL = member.user.displayAvatarURL({ dynamic: true });
      let animated = member.user.avatar && member.user.avatar.startsWith('a_'), avatarEmbed;
      if (member.user.avatar == null) {
        return common.slashCmdResp(interaction, emphemeral,
          `**Avatar for ${member.user.tag}**\n` +
          `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
          `links: [default](<${avatarURL}>) (avatar is default)\n` +
          `[\[for\xa0embed\]]( ${avatarURL} )`);
      } else {
        let baseurl = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}`;
        if (animated)
          return common.slashCmdResp(interaction, emphemeral,
            `**Avatar for ${member.user.tag}**\n` +
            `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
            `links: [default](<${avatarURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[normal\xa0gif](<${baseurl}.gif>)\n` +
            `big links: [big png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
            `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
            `[\[for\xa0embed\]]( ${baseurl}.gif?size=4096 )`);
        else
          return common.slashCmdResp(interaction, emphemeral,
            `**Avatar for ${member.user.tag}**\n` +
            `userid: ${member.user.id}, color: ${member.displayHexColor}\n` +
            `links: [default](<${avatarURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[big\xa0png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
            `[\[for\xa0embed\]]( ${baseurl}.png?size=4096 )`);
      }
    },
  },
  {
    name: 'icon',
    description: '`!icon` to view the server\'s icon',
    description_slash: 'displays the server\'s icon',
    flags: 0b110110,
    options: [ { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' } ],
    execute(o, msg, rawArgs) {
      let guild = msg.guild;
      
      let iconURL = guild.iconURL({ dynamic: true });
      let animated = guild.icon && guild.icon.startsWith('a_');
      if (guild.icon == null) {
        return msg.channel.send(new Discord.MessageEmbed()
          .setTitle(`Icon for ${guild.name}`)
          .setDescription(
            `serverid: ${guild.id}\n` +
            `Server icon is default`
            ));
      } else {
        let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
        if (animated)
          return msg.channel.send(new Discord.MessageEmbed()
            .setTitle(`Icon for ${guild.name}`)
            .setDescription(
              `serverid: ${guild.id}\n` +
              `links: [default](${iconURL}), ` +
              `[normal\xa0png](${baseurl}.png), ` +
              `[normal\xa0webp](${baseurl}.webp), ` +
              `[normal\xa0gif](${baseurl}.gif)\n` +
              `big links: [big png](${baseurl}.png?size=4096), ` +
              `[big\xa0webp](${baseurl}.webp?size=4096), ` +
              `[big\xa0gif](${baseurl}.gif?size=4096)`
              )
            .setImage(`${baseurl}.gif?size=4096`));
        else
          return msg.channel.send(new Discord.MessageEmbed()
            .setTitle(`Icon for ${guild.name}`)
            .setDescription(
              `serverid: ${guild.id}\n` +
              `links: [default](${iconURL}), ` +
              `[normal\xa0png](${baseurl}.png), ` +
              `[normal\xa0webp](${baseurl}.webp), ` +
              `[big\xa0png](${baseurl}.png?size=4096), ` +
              `[big\xa0webp](${baseurl}.webp?size=4096)`
              )
            .setImage(`${baseurl}.png?size=4096`));
      }
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[0] ? (args[0].value ? true : false) : true;
      
      let guild = o.guild;
      
      let iconURL = guild.iconURL({ dynamic: true });
      let animated = guild.icon && guild.icon.startsWith('a_');
      if (guild.icon == null) {
        return common.slashCmdResp(interaction, emphemeral,
          `**Icon for ${guild.name}**\n` +
          `serverid: ${guild.id}\n` +
          `Server icon is default`);
      } else {
        let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
        if (animated)
          return common.slashCmdResp(interaction, emphemeral,
            `**Icon for ${guild.name}**\n` +
            `serverid: ${guild.id}\n` +
            `links: [default](<${iconURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[normal\xa0gif](<${baseurl}.gif>)\n` +
            `big links: [big png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
            `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
            `[\[for\xa0embed\]]( ${baseurl}.gif?size=4096 )`);
        else
          return common.slashCmdResp(interaction, emphemeral,
            `**Icon for ${guild.name}**\n` +
            `serverid: ${guild.id}\n` +
            `links: [default](<${iconURL}>), ` +
            `[normal\xa0png](<${baseurl}.png>), ` +
            `[normal\xa0webp](<${baseurl}.webp>), ` +
            `[big\xa0png](<${baseurl}.png?size=4096>), ` +
            `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
            `[\[for\xa0embed\]]( ${baseurl}.png?size=4096 )`);
      }
    },
  },
  {
    name: 'userinfo',
    description: '`!userinfo [@someone]` to display information about a user',
    description_slash: 'displays information about a user or you if a user isn\'t provided',
    flags: 0b111110,
    options: [
      { type: 6, name: 'user', description: 'a user to display information about' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
            { name: 'Flags', value: user.flags && user.flags.toArray().length ? user.flags.toArray().join(', ') : 'None', inline: false },
            { name: 'Avatar', value: avatarStr, inline: false },
          ],
        }
      });
    },
    async execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      
      let user;
      if (args[0]) {
        let potentialUser = await client.users.fetch(args[0].value);
        if (potentialUser) user = potentialUser;
        else return common.slashCmdResp(interaction, emphemeral, 'User not found.');
      } else user = o.author;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(user.id) >> 22n));
      let avatarURL = user.displayAvatarURL({ dynamic: true });
      let animated = user.avatar && user.avatar.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
      let avatarStr = user.avatar == null ?
        `[default](<${avatarURL} ) (avatar is default)\n` +
        `[\[for\xa0embed\]]( ${avatarURL}?size=64 )` :
          (animated ?
          `[default](<${avatarURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[normal\xa0gif](<${baseurl}.gif>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
          `[big\xa0gif](<${baseurl}.gif?size=4096>)\n` +
          `[\[for\xa0embed\]]( ${avatarURL}?size=64 )` :
          `[default](<${avatarURL}>), ` +
          `[normal\xa0png](<${baseurl}.png>), ` +
          `[normal\xa0webp](<${baseurl}.webp>), ` +
          `[big\xa0png](<${baseurl}.png?size=4096>), ` +
          `[big\xa0webp](<${baseurl}.webp?size=4096>)\n` +
          `[\[for\xa0embed\]]( ${avatarURL}?size=64 )`);
      
      return common.slashCmdResp(interaction, emphemeral,
        `**User Info for ${user.tag}**\n` +
        `**ID: ${user.id}, Bot: ${user.bot ? 'Yes' : 'No'}**\n` +
        `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
        `Flags: ${user.flags && user.flags.toArray().length ? user.flags.toArray().join(', ') : 'None'}\n` +
        `Avatar: ${avatarStr}`);
    },
  },
  {
    name: 'memberinfo',
    description: '`!memberinfo [@someone]` to display information about a user',
    description_slash: 'displays information about a member or you if a member isn\'t provided',
    flags: 0b110110,
    options: [
      { type: 6, name: 'member', description: 'a member to display information about' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
    async execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      
      let member;
      if (args[0]) {
        try {
          member = await o.guild.members.fetch(args[0].value);
        } catch (e) {
          return common.slashCmdResp(interaction, emphemeral, 'Member not found in guild.');
        }
      } else member = o.member;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(member.id) >> 22n));
      let joinedDate = new Date(member.joinedAt);
      
      return common.slashCmdResp(interaction, emphemeral,
        `**Member Info for ${member.user.tag}**\n` +
        `**ID: ${member.id}, Color: ${member.displayHexColor}**\n` +
        `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
        `Joined At: ${joinedDate.toISOString()} (${common.msecToHMSs(Date.now() - joinedDate.getTime())} ago)\n` +
        `Roles: ${member.roles.cache.array().sort((a, b) => a.position > b.position ? -1 : 1).map(x => `<@&${x.id}>`).join(' ')}\n` +
        `[\[for\xa0embed\]]( ${member.user.displayAvatarURL()}?size=64 )`);
    },
  },
  {
    name: 'serverinfo',
    description: '`!serverinfo` to view information about the current server',
    description_slash: 'displays information about the current server',
    flags: 0b110110,
    options: [
      { type: 5, name: 'all', description: 'show all server info' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
            thumbnail: { url: iconURL ? iconURL + '?size=64' : null },
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
            thumbnail: { url: iconURL ? iconURL + '?size=64' : null },
            fields: [
              { name: 'Created At', value: `${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)`, inline: false },
              { name: 'Icon', value: iconStr, inline: false },
              { name: 'Members', value: guild.memberCount, inline: true },
            ],
          }
        });
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      
      let guild = o.guild;
      
      let createdDate = new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(BigInt(guild.id) >> 22n));
      let iconURL = guild.iconURL();
      let animated = guild.icon && guild.icon.startsWith('a_');
      let baseurl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`;
      let iconStr = guild.icon == null ? `Server icon is default` :
        (animated ?
        `[default](<${iconURL}>), ` +
        `[normal\xa0png](<${baseurl}.png>), ` +
        `[normal\xa0webp](<${baseurl}.webp>), ` +
        `[normal\xa0gif](<${baseurl}.gif>), ` +
        `[big\xa0png](<${baseurl}.png?size=4096>), ` +
        `[big\xa0webp](<${baseurl}.webp?size=4096>), ` +
        `[big\xa0gif](<${baseurl}.gif?size=4096>)` :
        `[default](<${iconURL}>), ` +
        `[normal\xa0png](<${baseurl}.png>), ` +
        `[normal\xa0webp](<${baseurl}.webp>), ` +
        `[big\xa0png](<${baseurl}.png?size=4096>), ` +
        `[big\xa0webp](<${baseurl}.webp?size=4096>)`);
      
      if (args[0] && args[0].value)
        return common.slashCmdResp(interaction, emphemeral,
          `**Information for ${guild.name}**\n` +
          `**ID: ${guild.id}**\n` +
          `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
          `Icon: ${iconStr}\n` +
          `Members: ${guild.memberCount}\n` +
          `Member Cap: ${guild.maximumMembers}` +
          (iconURL ? `\n[\[for\xa0embed\]]( ${iconURL}?size=64 )` : ''));
      else
        return common.slashCmdResp(interaction, emphemeral,
          `**Information for ${guild.name}**\n` +
          `**ID: ${guild.id}**\n` +
          `Created At: ${createdDate.toISOString()} (${common.msecToHMSs(Date.now() - createdDate.getTime())} ago)\n` +
          `Icon: ${iconStr}\n` +
          `Members: ${guild.memberCount}` +
          (iconURL ? `\n[\[for\xa0embed\]]( ${iconURL}?size=64 )` : ''));
    },
  },
  {
    name: 'firstmsg',
    description: '`!firstmsg` for a link to the first message in this channel\n`!firstmsg #channel` for a link to the first message in #channel',
    description_slash: 'sends a link to the first message in this channel or a certain channel',
    flags: 0b111110,
    options: [
      { type: 7, name: 'channel', description: 'the channel' },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    async execute(o, msg, rawArgs) {
      let channel;
      if (!rawArgs[0] || !msg.guild) {
        channel = msg.channel;
      } else if (/<#[0-9]+>/.test(rawArgs[0])) {
        channel = msg.guild.channels.cache.get(rawArgs[0].slice(2, -1));
        if (!channel || !channel.permissionsFor(msg.member).has('VIEW_CHANNEL')) channel = msg.channel;
      }
      let msgs = (await channel.messages.fetch({ after: 0, limit: 1 })).array();
      if (msgs.length == 1)
        return msg.channel.send(`First message in <#${channel.id}>: https://discord.com/channels/${msg.guild ? msg.guild.id : '@me'}/${channel.id}/${msgs[0].id}`);
      else
        return msg.channel.send(`<#${channel.id}> has no messages`);
    },
    async execute_slash(o, interaction, command, args) {
      let channel;
      if (!args[0] || !o.guild) {
        channel = o.channel;
      } else {
        channel = o.guild.channels.cache.get(args[0].value);
        if (!channel || !channel.permissionsFor(o.member).has('VIEW_CHANNEL')) channel = o.channel;
      }
      let msgs = (await channel.messages.fetch({ after: 0, limit: 1 })).array();
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      if (msgs.length == 1)
        return common.slashCmdResp(interaction, emphemeral, `First message in <#${channel.id}>: https://discord.com/channels/${o.guild ? o.guild.id : '@me'}/${channel.id}/${msgs[0].id}`);
      else
        return common.slashCmdResp(interaction, emphemeral, `<#${channel.id}> has no messages`);
    },
  },
  {
    name: 'dateid',
    description: '`!dateid <id>` to get the UTC date and time of an ID in discord',
    description_slash: 'prints the UTC date and time of an ID in discord',
    flags: 0b111110,
    options: [
      { type: 3, name: 'id', description: 'the id', required: true },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
    execute(o, msg, rawArgs) {
      try {
        let id = BigInt(rawArgs[0]);
        return msg.channel.send(`Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}`);
      } catch (e) {
        return msg.channel.send('Invalid ID');
      }
    },
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      try {
        let id = BigInt(args[0].value);
        return common.slashCmdResp(interaction, emphemeral, `Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}`);
      } catch (e) {
        return common.slashCmdResp(interaction, emphemeral, 'Invalid ID');
      }
    },
  },
  {
    name: 'idinfo',
    description: '`!idinfo <id>` to get the fields of an ID in discord',
    description_slash: 'prints the fields of an ID in discord',
    flags: 0b111110,
    options: [
      { type: 3, name: 'id', description: 'the id', required: true },
      { type: 5, name: 'emphemeral', description: 'whether the command and result are visible to only you, defaults to true' },
    ],
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
    execute_slash(o, interaction, command, args) {
      let emphemeral = args[1] ? (args[1].value ? true : false) : true;
      try {
        let id = BigInt(args[0].value);
        return common.slashCmdResp(interaction, emphemeral,
          `ID Info for ${id}:\n\n` +
          `Date: ${new Date(new Date('2015-01-01T00:00:00.000Z').getTime() + Number(id >> 22n)).toISOString()}\n` +
          `Worker ID: ${(id & 0x3E0000n) >> 17n}\n` +
          `Process ID: ${(id & 0x1F000n) >> 12n}\n` +
          `Increment: ${id & 0xFFFn}`);
      } catch (e) {
        return common.slashCmdResp(interaction, emphemeral, 'Invalid ID');
      }
    },
  },
];
