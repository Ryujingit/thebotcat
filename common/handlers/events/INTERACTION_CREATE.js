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
      
      if (o.cmd.options)
        o.args = o.cmd.options.map(x => interaction.data.options ? interaction.data.options.filter(y => y.name == x.name)[0] : null);
      else
        o.args = [];
      
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
      
      if (o.cmd.execute_slash) {
        if (o.guild ? o.cmd.flags & 0b000100 : o.cmd.flags & 0b001000)
          return o.cmd.execute_slash(o, interaction, o.command, o.args);
        else
          return common.slashCmdResp(interaction, true, o.guild ? 'Command not for guilds' : 'Command not for dms');
      }
      break;
  }
};
