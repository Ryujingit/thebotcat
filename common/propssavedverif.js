var commonConstants = require('./constants');

// props.saved integrity checks / conversion from older format
function isId(val) {
  return typeof val == 'string' && /[0-9]{16,20}/.test(val);
}

// cause js typeof is sus
function isObject(val) {
  return val instanceof Object;
}

module.exports = {
  isId, isObject,
  
  propsSavedCreateVerifiedCopy: function propsSavedCreateVerifiedCopy(obj) {
    if (!isObject(obj)) obj = {};
    if (!Number.isSafeInteger(obj.version) || obj.version == 1) {
      let featIsObj = isObject(obj.feat);
      let guildsIsObj = isObject(obj.guilds);
      let perGuildFunc = (guild, id) => {
        let guildIsObj = isObject(guild);
        let newGuild = {
          prefix: guildIsObj && typeof guild.prefix == 'string' ? guild.prefix : defaultprefix,
          confirm_kb: true,
          vc_disconnect_timeout: -1,
          enabled_commands: {
            global: true,
            categories: (() => {
              let catObj = {};
              commandCategories.forEach(x => catObj[x] = true);
              return catObj;
            })(),
            commands: (() => {
              let cmdObj = {};
              commands.forEach(x => x.flags & 0b000110 == 0b000110 ? cmdObj[x.name] = true : null);
              return cmdObj;
            })(),
          },
          logging: {
            main: guildIsObj && isId(guild.infochannel) ? guild.infochannel : null,
          },
          perms: (() => {
            let includesEveryone = false;
            let obj = {};
            (guildIsObj && Array.isArray(guild.modroles) ? guild.modroles : [])
              .forEach(x => {
                if (!isId(x)) return null;
                if (x == id && !includesEveryone) includesEveryone = true;
                obj[x] = commonConstants.botRolePermMod;
              });
            if (!includesEveryone) obj[id] = commonConstants.botRolePermDef;
            return obj;
          })(),
          overrides: {},
          mutedrole: null,
          basic_automod: {
            bad_words: [],
          },
          events: [],
          temp: {
            stashed: {
              channeloverrides: (() => {
                if (!guildIsObj || !isObject(guild.savedperms)) return {};
                let overrides = guild.savedperms;
                let overObj = {};
                Object.keys(overrides).forEach(x => {
                  if (!Array.isArray(overrides[x])) return;
                  overObj[x] = overrides[x].map(y => {
                    if (!isObject(y) ||
                      typeof y.id != 'string' ||
                      y.type != 'role' && y.type != 'member' ||
                      !Number.isSafeInteger(y.allow) ||
                      !Number.isSafeInteger(y.deny)) return null;
                    return {
                      id: y.id,
                      type: y.type,
                      allow: y.allow,
                      deny: y.deny,
                    };
                  }).filter(y => y != null);
                });
                return overObj;
              })(),
            },
          },
        };
        Object.defineProperty(newGuild, 'voice', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: guildIsObj && 'voice' in guild ? guild.voice : common.clientVCManager.getEmptyVoiceObject(),
        });
        return newGuild;
      };
      let newObj;
      let perUserFunc = user => {
        let userIsObj = isObject(user);
        let userObj = {
          calc_scope: userIsObj ? JSON.stringify(user) : '{}',
        };
        Object.defineProperty(userObj, 'calc_scope_running', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: false,
        });
        return userObj;
      };
      newObj = {
        version: 2,
        feat: {
          _audio: null,
          calc: featIsObj && typeof obj.feat.calc == 'boolean' ? obj.feat.calc : true,
          audio: null,
          lamt: featIsObj && Number.isSafeInteger(obj.feat.lamt) ? obj.feat.lamt : 0,
        },
        guilds: { default: perGuildFunc(guildsIsObj ? obj.guilds.default : null) },
        users: { default: perUserFunc(isObject(obj.calc_scopes) ? obj.calc_scopes.shared : null) },
        disallowed_guilds: [],
        misc: {
          dmchannels: Array.isArray(obj.dmchannels) ? obj.dmchannels.filter(x => isId(x)) : [],
          sendmsgid: typeof obj.sendmsgid == 'string' ? obj.sendmsgid : '1',
        },
      };
      Object.defineProperties(newObj.feat, {
        _audio: {
          configurable: true,
          enumerable: false,
          writable: true,
          value: featIsObj && Number.isSafeInteger(obj.feat.audio) && obj.feat.audio >= 0 && obj.feat.audio < 4 ? obj.feat.audio : 3,
        },
        audio: {
          configurable: true,
          enumerable: true,
          get: () => newObj.feat._audio,
          set: newVal => {
            let oldVal = newObj.feat._audio;
            if (oldVal & 1 && !(newVal & 1)) {
              Object.keys(props.saved.guilds).forEach(guild => {
                guild = props.saved.guilds[guild];
                try {
                  common.clientVCManager.leave(guild.voice);
                } catch (e) {
                  console.error(e);
                }
              });
            } else if (oldVal & 2 && !(newVal & 2)) {
              Object.keys(props.saved.guilds).forEach(guild => {
                guild = props.saved.guilds[guild];
                try {
                  common.clientVCManager.stopMainLoop(guild.voice);
                } catch (e) {
                  console.error(e);
                }
              });
            }
            newObj.feat._audio = newVal;
          },
        }
      });
      client.guilds.cache.keyArray().forEach(x => newObj.guilds[x] = perGuildFunc(guildsIsObj ? obj.guilds[x] : null, x));
      if (guildsIsObj) {
        let props = Object.getOwnPropertyDescriptors(obj.guilds);
        let keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          if (props[keys[i]].enumerable && isId(keys[i]))
            newObj.guilds[keys[i]] = perGuildFunc(obj.guilds[keys[i]], keys[i]);
          else if (props[keys[i]].get)
            Object.defineProperty(newObj.guilds, keys[i], {
              configurable: true,
              enumerable: false,
              get: props[keys[i]].get,
            });
        }
      }
      if (isObject(obj.calc_scopes))
        Object.keys(obj.calc_scopes).forEach(x => x != 'shared' && isId(x) ? newObj.users[x] = perUserFunc(obj.calc_scopes[x]) : null);
      return newObj;
    } else if (obj.version == 2) {
      let featIsObj = isObject(obj.feat);
      let guildsIsObj = isObject(obj.guilds);
      let perGuildFunc = (guild, id) => {
        let guildIsObj = isObject(guild);
        let newGuild = {
          prefix: guildIsObj && typeof guild.prefix == 'string' ? guild.prefix : defaultprefix,
          confirm_kb: guildIsObj && typeof guild.confirm_kb == 'boolean' ? guild.confirm_kb : true,
          vc_disconnect_timeout: guildIsObj && Number.isSafeInteger(guild.vc_disconnect_timeout) && guild.vc_disconnect_timeout >= -1 ? guild.vc_disconnect_timeout : -1,
          enabled_commands: (() => {
            let enabledcmds = {
              _global: null,
              global: null,
              categories: (() => {
                let ecco = guildIsObj && isObject(guild.enabled_commands) && isObject(guild.enabled_commands.categories);
                let catObj = {};
                commandCategories.forEach(x => {
                  if (x == 'Voice Channel') {
                    Object.defineProperty(catObj, '_' + x, {
                      configurable: true,
                      enumerable: false,
                      writable: true,
                      value: ecco && typeof guild.enabled_commands.categories[x] == 'boolean' ? guild.enabled_commands.categories[x] : true,
                    });
                    Object.defineProperty(catObj, x, {
                      configurable: true,
                      enumerable: true,
                      get: () => catObj['_' + x],
                      set: val => {
                        if (!val)
                          common.clientVCManager.leave(newGuild.voice);
                        catObj['_' + x] = val;
                      },
                    });
                  } else if (x == 'Music') {
                    Object.defineProperty(catObj, '_' + x, {
                      configurable: true,
                      enumerable: false,
                      writable: true,
                      value: ecco && typeof guild.enabled_commands.categories[x] == 'boolean' ? guild.enabled_commands.categories[x] : true,
                    });
                    Object.defineProperty(catObj, x, {
                      configurable: true,
                      enumerable: true,
                      get: () => catObj['_' + x],
                      set: val => {
                        if (!val)
                          common.clientVCManager.stopMainLoop(newGuild.voice);
                        catObj['_' + x] = val;
                      },
                    });
                  } else {
                    catObj[x] = ecco && typeof guild.enabled_commands.categories[x] == 'boolean' ? guild.enabled_commands.categories[x] : true;
                  }
                });
                return catObj;
              })(),
              commands: (() => {
                let ecco = guildIsObj && isObject(guild.enabled_commands) && isObject(guild.enabled_commands.commands);
                let cmdObj = {};
                commands.forEach(x => {
                  if (x.flags & 0b000110 != 0b000110) return;
                  if (x.name == 'leave') {
                    Object.defineProperty(cmdObj, '_' + x.name, {
                      configurable: true,
                      enumerable: false,
                      writable: true,
                      value: ecco && typeof guild.enabled_commands.commands[x] == 'boolean' ? guild.enabled_commands.commands[x] : true,
                    });
                    Object.defineProperty(cmdObj, x.name, {
                      configurable: true,
                      enumerable: true,
                      get: () => cmdObj['_' + x.name],
                      set: val => {
                        if (!val)
                          common.clientVCManager.leave(newGuild.voice);
                        cmdObj['_' + x.name] = val;
                      },
                    });
                  } else {
                    cmdObj[x.name] = ecco && typeof guild.enabled_commands.commands[x] == 'boolean' ? guild.enabled_commands.commands[x] : true;
                  }
                });
                return cmdObj;
              })(),
            };
            Object.defineProperties(enabledcmds, {
              _global: {
                configurable: true,
                enumerable: false,
                writable: true,
                value: guildIsObj && isObject(guild.enabled_commands) && typeof guild.enabled_commands.global == 'boolean' ? guild.enabled_commands.global : true,
              },
              global: {
                configurable: true,
                enumerable: true,
                get: () => enabledcmds._global,
                set: val => {
                  common.clientVCManager.leave(newGuild.voice);
                  enabledcmds._global = val;
                },
              },
            });
            return enabledcmds;
          })(),
          logging: {
            main: guildIsObj && isObject(guild.logging) && isId(guild.logging.main) ? guild.logging.main : null,
          },
          perms: (() => {
            let includesEveryone = false;
            let obj = (guildIsObj && isObject(guild.perms) ? guild.perms : {}), newObj = {};
            Object.keys(obj)
              .forEach(x => {
                if (!isId(x)) return;
                if (x == id && !includesEveryone) includesEveryone = true;
                newObj[x] = Number.isSafeInteger(obj[x]) ? obj[x] : 0;
              });
            if (!includesEveryone) newObj[id] = commonConstants.botRolePermDef;
            return newObj;
          })(),
          overrides: (() => {
            if (!guildIsObj || !isObject(guild.overrides)) return {};
            let overObj = {};
            Object.keys(guild.overrides).forEach(x => {
              let obj = guild.overrides[x], newObj = {};
              Object.keys(obj)
                .forEach(x => {
                  if (!isId(x) || !isObject(obj[x])) return;
                  newObj[x] = {
                    allows: Number.isSafeInteger(obj[x].allows) ? obj[x].allows : 0,
                    denys: Number.isSafeInteger(obj[x].denys) ? obj[x].denys : 0,
                  };
                });
              overObj[x] = newObj;
            });
            return overObj;
          })(),
          mutedrole: guildIsObj && isId(guild.mutedrole) ? guild.mutedrole : null,
          basic_automod: {
            bad_words: guildIsObj && isObject(guild.basic_automod) && Array.isArray(guild.basic_automod.bad_words) ? guild.basic_automod.bad_words.map(x => {
              if (!isObject(x) || typeof x.word != 'string' || typeof x.retaliation != 'string') return null;
              return {
                enabled: typeof x.enabled == 'boolean' ? x.enabled : false,
                type: Number.isSafeInteger(x.type) && x.type >= 0 && x.type < 7 ? x.type : 0,
                ignore_admin: typeof x.ignore_admin == 'boolean' ? x.ignore_admin : false,
                ignored_roles: Array.isArray(x.ignored_roles) ? x.ignored_roles.filter(y => isId(y)) : [],
                word: x.word,
                retaliation: x.retaliation,
              };
            }).filter(x => x != null) : [],
          },
          events: guildIsObj && Array.isArray(guild.events) ? guild.events : [],
          temp: {
            stashed: {
              channeloverrides: (() => {
                if (!guildIsObj || !isObject(guild.temp) || !isObject(guild.temp.stashed) || !isObject(guild.temp.stashed.channeloverrides)) return {};
                let overrides = guild.temp.stashed.channeloverrides;
                let overObj = {};
                Object.keys(overrides).forEach(x => {
                  if (!Array.isArray(overrides[x])) return;
                  overObj[x] = overrides[x].map(y => {
                    if (!isObject(y) ||
                      typeof y.id != 'string' ||
                      y.type != 'role' && y.type != 'member' ||
                      !Number.isSafeInteger(y.allow) ||
                      !Number.isSafeInteger(y.deny)) return null;
                    return {
                      id: y.id,
                      type: y.type,
                      allow: y.allow,
                      deny: y.deny,
                    };
                  }).filter(y => y != null);
                });
                return overObj;
              })(),
            },
          },
        };
        Object.defineProperty(newGuild, 'voice', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: guildIsObj && 'voice' in guild ? guild.voice : common.clientVCManager.getEmptyVoiceObject(),
        });
        return newGuild;
      };
      let newObj;
      let perUserFunc = user => {
        let userIsObj = isObject(user);
        let userObj = {
          calc_scope: userIsObj && typeof user.calc_scope == 'string' ? user.calc_scope : '{}',
        };
        Object.defineProperty(userObj, 'calc_scope_running', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: false,
        });
        return userObj;
      };
      newObj = {
        version: 2,
        feat: {
          _audio: null,
          calc: featIsObj && typeof obj.feat.calc == 'boolean' ? obj.feat.calc : true,
          audio: null,
          lamt: featIsObj && Number.isSafeInteger(obj.feat.lamt) ? obj.feat.lamt : 0,
        },
        guilds: { default: perGuildFunc(guildsIsObj ? obj.guilds.default : null) },
        users: { default: perUserFunc(isObject(obj.users) ? obj.users.default : null) },
        disallowed_guilds: Array.isArray(obj.disallowed_guilds) ? obj.disallowed_guilds.filter(x => isId(x)) : [],
        misc: {
          dmchannels: isObject(obj.misc) && Array.isArray(obj.misc.dmchannels) ? obj.misc.dmchannels.filter(x => typeof x == 'string') : [],
          sendmsgid: isObject(obj.misc) && typeof obj.misc.sendmsgid == 'string' ? obj.misc.sendmsgid : '1',
        },
      };
      Object.defineProperties(newObj.feat, {
        _audio: {
          configurable: true,
          enumerable: false,
          writable: true,
          value: featIsObj && Number.isSafeInteger(obj.feat.audio) && obj.feat.audio >= 0 && obj.feat.audio < 4 ? obj.feat.audio : 3,
        },
        audio: {
          configurable: true,
          enumerable: true,
          get: () => newObj.feat._audio,
          set: newVal => {
            let oldVal = newObj.feat._audio;
            if (oldVal & 1 && !(newVal & 1)) {
              Object.keys(props.saved.guilds).forEach(guild => {
                guild = props.saved.guilds[guild];
                try {
                  common.clientVCManager.leave(guild.voice);
                } catch (e) {
                  console.error(e);
                }
              });
            } else if (oldVal & 2 && !(newVal & 2)) {
              Object.keys(props.saved.guilds).forEach(guild => {
                guild = props.saved.guilds[guild];
                try {
                  common.clientVCManager.stopMainLoop(guild.voice);
                } catch (e) {
                  console.error(e);
                }
              });
            }
            newObj.feat._audio = newVal;
          },
        },
      });
      client.guilds.cache.keyArray().forEach(x => newObj.guilds[x] = perGuildFunc(guildsIsObj ? obj.guilds[x] : null, x));
      if (guildsIsObj) {
        let props = Object.getOwnPropertyDescriptors(obj.guilds);
        let keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          if (props[keys[i]].enumerable && isId(keys[i]))
            newObj.guilds[keys[i]] = perGuildFunc(obj.guilds[keys[i]], keys[i]);
          else if (props[keys[i]].get)
            Object.defineProperty(newObj.guilds, keys[i], {
              configurable: true,
              enumerable: false,
              get: props[keys[i]].get,
            });
        }
      }
      if (isObject(obj.users))
        Object.keys(obj.users).forEach(x => x != 'default' && isId(x) ? newObj.users[x] = perUserFunc(obj.users[x]) : null);
      return newObj;
    }
  },
  
  getEmptyGuildObject: id => {
    let obj = {
      prefix: defaultprefix,
      confirm_kb: true,
      enabled_commands: {
        global: true,
        categories: (() => {
          let catObj = {};
          commandCategories.forEach(x => catObj[x] = true);
          return catObj;
        })(),
        commands: (() => {
          let cmdObj = {};
          commands.forEach(x => x.flags & 0b000110 == 0b000110 ? cmdObj[x.name] = true : null);
          return cmdObj;
        })(),
      },
      logging: {
        main: null,
      },
      perms: isId(id) ? { [id]: commonConstants.botRolePermDef } : {},
      overrides: {},
      mutedrole: null,
      basic_automod: {
        bad_words: [],
      },
      events: [],
      temp: {
        stashed: {
          channeloverrides: {},
        },
      },
    };
    Object.defineProperty(obj, 'voice', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: common.clientVCManager.getEmptyVoiceObject(),
    });
    return obj;
  },
  
  getEmptyUserObject: (guildObj) => {
    let obj = {
      calc_scope: '{}',
    };
    Object.defineProperty(obj, 'calc_scope_running', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: false,
    });
    return obj;
  },
};
