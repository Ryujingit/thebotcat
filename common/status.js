function getBotcatUptimeMessage() {
  return {
    embed: {
      title: 'Thebotcat Uptime',
      description: common.msecToHMSs(client.uptime),
    }
  };
}

function getBotcatStatusMessage() {
  return {
    embed: {
      title: 'Thebotcat Status',
      fields: [
        { name: 'Uptime', value: common.msecToHMSs(client.uptime), inline: false },
        { name: 'CPU User', value: (props.CPUUsage.user * 100).toFixed(3) + '%', inline: true },
        { name: 'CPU System', value: (props.CPUUsage.system * 100).toFixed(3) + '%', inline: true },
        { name: 'CPU Total', value: ((props.CPUUsage.user + props.CPUUsage.system) * 100).toFixed(3) + '%', inline: true },
        { name: 'Memory', value: (props.memoryUsage.rss / 2 ** 20).toFixed(3) + 'M', inline: false },
      ],
    }
  };
}

module.exports = { getBotcatUptimeMessage, getBotcatStatusMessage };
