function getBotcatUptimeMessage(embeds) {
  if (embeds != false)
    return {
      embed: {
        title: 'Thebotcat Uptime',
        description: `${common.msecToHMSs(client.uptime)} (${ticks} ticks)`,
      }
    };
  else
    return `Uptime: ${common.msecToHMSs(client.uptime)} (${ticks} ticks)`
}

function getBotcatStatusMessage(embeds) {
  if (embeds != false)
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
  else
    return '**Thebotcat Status:**\n\n' +
      `Uptime: ${common.msecToHMSs(client.uptime)} (${ticks} ticks)\n` +
      `CPU User: ${props.CPUUsage ? (props.CPUUsage.user * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `CPU System: ${props.CPUUsage ? (props.CPUUsage.system * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `CPU Total: ${props.CPUUsage ? ((props.CPUUsage.user + props.CPUUsage.system) * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `Memory: ${props.memoryUsage ? (props.memoryUsage.rss / 2 ** 20).toFixed(3) + 'M' : 'N/A'}\n` +
      `Last Tick: ${props.cCPUUsageDate ? common.fancyDateString(props.cCPUUsageDate) : 'N/A'}`;
}

function getBotcatFullStatusMessage(embeds, statusMsg) {
  if (embeds != false) {
    if (statusMsg)
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
    else
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
            { name: 'Current Time', value: common.fancyDateString(new Date()), inline: false },
          ],
        }
      };
  } else {
    return '**Thebotcat Status:**\n\n' +
      `Node Version: ${process.version}\n` +
      `Bot Version: ${version}\n` +
      `Uptime: ${common.msecToHMSs(client.uptime)} (${ticks} ticks)\n` +
      `CPU User: ${props.CPUUsage ? (props.CPUUsage.user * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `CPU System: ${props.CPUUsage ? (props.CPUUsage.system * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `CPU Total: ${props.CPUUsage ? ((props.CPUUsage.user + props.CPUUsage.system) * 100).toFixed(3) + '%' : 'N/A'}\n` +
      `Memory: ${props.memoryUsage ? (props.memoryUsage.rss / 2 ** 20).toFixed(3) + 'M' : 'N/A'}\n` +
      `Last Tick: ${props.cCPUUsageDate ? common.fancyDateString(props.cCPUUsageDate) : 'N/A'}\n` +
      `Current Time: ${common.fancyDateString(new Date())}`;
  }
}

module.exports = { getBotcatUptimeMessage, getBotcatStatusMessage, getBotcatFullStatusMessage };
