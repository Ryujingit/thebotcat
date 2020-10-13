// converts a time in milliseconds to M:SS.LLL or H:MM:SS.LLL
function msecToHMS(ms) {
  if (typeof ms != 'number' || ms < 0 || ms > 1e33) return '-:--.---';
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
  else
    return `${Math.floor(ms / 3600000)}:${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}:${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}.${('' + Math.floor(ms) % 1000).padStart(3, '0')}`;
}

// converts a time in milliseconds to h m s ms
function msecToHMSs(ms) {
  if (ms < 3600000)
    return `${Math.floor(ms / 60000)}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else if (ms < 86400000)
    return `${Math.floor(ms / 3600000)}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
  else
    return `${Math.floor(ms / 86400000)}d ${('' + Math.floor(ms / 3600000) % 24).padStart(2, '0')}h ${('' + Math.floor(ms / 60000) % 60).padStart(2, '0')}m ${('' + Math.floor(ms / 1000) % 60).padStart(2, '0')}s ${('' + Math.floor(ms) % 1000).padStart(3, '0')}ms`;
}

module.exports = { msecToHMS, msecToHMSs };
