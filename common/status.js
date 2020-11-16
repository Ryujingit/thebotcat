function getBotcatUptimeMessage() {
  return {
    embed: {
      title: 'Thebotcat Uptime',
      description: `${common.msecToHMSs(client.uptime)} (${ticks} ticks)`,
    }
  };
}

function getBotcatStatusMessage() {
  return {
    embed: {
      title: 'Thebotcat Status',
      fields: [
        { name: 'Uptime', value: `${common.msecToHMSs(client.uptime)} (${ticks} ticks)`, inline: false },
        { name: 'CPU User', value: props.CPUUsage ? (props.CPUUsage.user * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'CPU System', value: props.CPUUsage ? (props.CPUUsage.system * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'CPU Total', value: props.CPUUsage ? ((props.CPUUsage.user + props.CPUUsage.system) * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'Memory', value: props.memoryUsage ? (props.memoryUsage.rss / 2 ** 20).toFixed(3) + 'M' : 'N/A', inline: false },
        { name: 'Last Tick', value: props.cCPUUsageDate ? common.fancyDateString(props.cCPUUsageDate) : 'N/A', inline: false },
      ],
    }
  };
}

function getBotcatFullStatusMessage() {
  return {
    embed: {
      title: 'Thebotcat Status',
      fields: [
        { name: 'Node Version', value: process.version, inline: true },
        { name: 'Bot Version', value: version, inline: true },
        { name: 'Uptime', value: `${common.msecToHMSs(client.uptime)} (${ticks} ticks)`, inline: false },
        { name: 'CPU User', value: props.CPUUsage ? (props.CPUUsage.user * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'CPU System', value: props.CPUUsage ? (props.CPUUsage.system * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'CPU Total', value: props.CPUUsage ? ((props.CPUUsage.user + props.CPUUsage.system) * 100).toFixed(3) + '%' : 'N/A', inline: true },
        { name: 'Memory', value: props.memoryUsage ? (props.memoryUsage.rss / 2 ** 20).toFixed(3) + 'M' : 'N/A', inline: false },
        { name: 'Last Tick', value: props.cCPUUsageDate ? common.fancyDateString(props.cCPUUsageDate) : 'N/A', inline: false },
      ],
    }
  };
}

module.exports = { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage };
