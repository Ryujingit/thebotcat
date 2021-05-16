module.exports = async interaction => {
  let type = interaction.type;
  switch (type) {
    case 2:
      let o = {
        interaction,
        cmd: commandColl.get(interaction.data.name),
        command: interaction.data.name,
        args: null,
        channel: await client.channels.fetch(interaction.channel_id),
        guild: null,
        author: null,
        member: null,
      };
      
      if (o.cmd) {
        if (Array.isArray(o.cmd.options) && o.cmd.options.length) {
          if (o.cmd.options[0].type > 2) 
            o.args = o.cmd.options.map(x => interaction.data.options ? interaction.data.options.filter(y => y.name == x.name)[0] : null);
          else
            o.args = interaction.data.options;
        } else {
          o.args = [];
        }
      } else {
        o.args = interaction.data.options;
      }
      
      if (interaction.member) {
        o.author = await client.users.fetch(interaction.member.user.id);
        o.member = await (await client.guilds.fetch(interaction.guild_id)).members.fetch(interaction.member.user.id);
        o.guild = await client.guilds.fetch(interaction.guild_id);
      } else {
        o.author = await client.users.fetch(interaction.user.id);
      }
      
      if (handlers.extra.INTERACTION_CREATE) {
        let res;
        for (var i = 0; i < handlers.extra.INTERACTION_CREATE.length; i++) {
          if (handlers.extra.INTERACTION_CREATE[i].constructor == Function) res = handlers.extra.INTERACTION_CREATE[i](o, i);
          else res = await handlers.extra.INTERACTION_CREATE[i](o, i);
          if (res === 0) return;
        }
      }
      
      if (!o.cmd) return;
      
      if (o.cmd.execute_slash) {
        if (o.guild ? o.cmd.flags & 0b000100 : o.cmd.flags & 0b001000) {
          if (!(o.cmd.flags & 0b000010) && (!o.guild || !persGuildData.special_guilds_set.has(o.guild.id)))
            return common.slashCmdResp(interaction, true, 'Command invalid.');
          if (o.guild && o.command != 'settings' &&
            props.saved.guilds[o.guild.id] && (
              !props.saved.guilds[o.guild.id].enabled_commands.global ||
              props.saved.guilds[o.guild.id].enabled_commands.categories[o.cmd.category] == false ||
              props.saved.guilds[o.guild.id].enabled_commands.commands[o.command] == false))
            return common.slashCmdResp(interaction, true, 'Command is disabled in this server.');
          
          try {
            if (o.cmd.execute_slash.constructor == Function)
              return o.cmd.execute_slash(o, interaction, o.command, o.args);
            else
              return await o.cmd.execute_slash(o, interaction, o.command, o.args);
          } catch (e) {
            if (e instanceof common.BotError) {
              return common.slashCmdResp(interaction, true, `Error: ${e.message}`);
            } else throw e;
          }
        } else {
          return common.slashCmdResp(interaction, true, o.guild ? 'Command not for guilds.' : 'Command not for dms.');
        }
      }
      break;
  }
};
