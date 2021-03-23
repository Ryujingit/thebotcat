module.exports = async interaction => {
  let type = interaction.type;
  switch (type) {
    case 2:
      let data = interaction.data;
      let o = {
        interaction,
        cmd: commandColl.get(data.name),
        command: data.name,
        args: data.options || [],
        channel: await client.channels.fetch(interaction.channel_id),
        guild: null,
        author: null,
        member: null,
      };
      
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
      
      if (o.cmd.execute_slash)
        await o.cmd.execute_slash(o, interaction, o.command, o.args);
      break;
  }
};
