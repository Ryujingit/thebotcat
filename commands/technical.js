module.exports = [
  {
    name: 'version',
    full_string: false,
    execute(msg, argstring, command, args) {
      msg.channel.send(`Thebotcat is version ${version}`);
    }
  },
  {
    name: 'ping',
    full_string: false,
    execute(msg, argstring, command, args) {
      msg.channel.send('Checking Ping').then(m => {
      let beforerequest = Date.now(), afterrequest;
      https.get('https://example.com', res => {
        afterrequest = Date.now();
        res.socket.destroy();
        
        var botPing = afterrequest - beforerequest;
        var apiPing = m.createdTimestamp - msg.createdTimestamp;
      
        m.edit(`*Bot Ping:* **${botPing}**ms\n*API Ping:* **${apiPing}**ms`);
      });
    });
    }
  },
];