// searches a collection with a query

function searchRoles(roles, query) {
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionRole = roles.cache.get(query);
  if (mentionRole) return mentionRole;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var roleArr = roles.cache.array();
  
  // step 1: check if there is only one possibility anyway
  if (roleArr.length == 1) return roleArr[0];
  
  // step 2: run through the array checking every element for various things
  var roleLowerIncludes = [], roleLowerEqual = [], roleIncludes = [], roleEqual = [], roleID = [];
  for (var i = 0, x; i < roleArr.length; i++) {
    x = roleArr[i];
    if (x.name.toLowerCase() == queryLower) { roleLowerIncludes.push(x); roleLowerEqual.push(x); }
    else if (x.name.toLowerCase().includes(queryLower)) roleLowerIncludes.push(x);
    if (x.name == query) { roleIncludes.push(x); roleEqual.push(x); }
    else if (x.name.includes(query)) roleIncludes.push(x);
    if (x.id.includes(queryNumbers)) roleID.push(x);
  }
  
  // step 3: all the checking for array of size 1 lol
  if (roleLowerEqual.length == 1) return roleLowerEqual[0];
  if (roleLowerIncludes.length == 1) return roleLowerIncludes[0];
  if (roleEqual.length == 1) return roleEqual[0];
  if (roleIncludes.length == 1) return roleIncludes[0];
  if (roleID.length == 1) return roleID[0];
  
  var arrays = [roleLowerEqual, roleLowerIncludes, roleEqual, roleIncludes, roleID];
  
  var minSize = Infinity, minArr = null;
  for (var i = 0; i < arrays.length; i++) {
    if (arrays[i].length < minSize && arrays[i].length != 0) {
      minArr = arrays[i];
      minSize = minArr.length;
    }
  }
    
  return minArr ? minArr : [];
}

async function searchMembers(members, query) {
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionMember = members.cache.get(query);
  if (mentionMember) return mentionMember;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var memArr = members.cache.array();
  
  // step 1: check if there is only one possibility anyway
  if (memArr.length == 1) return memArr[0];
  
  // step 2: run through the array checking every element for various things
  var memUserLowerIncludes = [], memUserLowerEqual = [], memUserIncludes = [], memUserEqual = [],
    memNickLowerIncludes = [], memNickLowerEqual = [], memNickIncludes = [], memNickEqual = [],
    memID = [];
  for (var i = 0, x; i < memArr.length; i++) {
    x = memArr[i];
    if (x.user.username.toLowerCase() == queryLower) { memUserLowerIncludes.push(x); memUserLowerEqual.push(x); }
    else if (x.user.tag.toLowerCase().includes(queryLower)) memUserLowerIncludes.push(x);
    if (x.user.username == query) { memUserIncludes.push(x); memUserEqual.push(x); }
    else if (x.user.tag.includes(query)) memUserIncludes.push(x);
    if (x.nickname) {
      if (x.nickname.toLowerCase() == queryLower) { memNickLowerIncludes.push(x); memNickLowerEqual.push(x); }
      else if (x.nickname.toLowerCase().includes(queryLower)) memNickLowerIncludes.push(x);
      if (x.nickname == query) { memNickIncludes.push(x); memNickEqual.push(x); }
      else if (x.nickname.includes(query)) memNickIncludes.push(x);
    }
    if (x.id.includes(queryNumbers)) memID.push(x);
  }
  
  // step 3: all the checking for array of size 1 lol
  if (memUserLowerEqual.length == 1) return memUserLowerEqual[0];
  if (memUserLowerIncludes.length == 1) return memUserLowerIncludes[0];
  if (memUserEqual.length == 1) return memUserEqual[0];
  if (memUserIncludes.length == 1) return memUserIncludes[0];
  if (memNickLowerEqual.length == 1) return memNickLowerEqual[0];
  if (memNickLowerIncludes.length == 1) return memNickLowerIncludes[0];
  if (memNickEqual.length == 1) return memNickEqual[0];
  if (memNickIncludes.length == 1) return memNickIncludes[0];
  if (memID.length == 1) return memID[0];
  
  var arrays = [memUserLowerEqual, memUserLowerIncludes, memUserEqual, memUserIncludes, memNickLowerEqual, memNickLowerIncludes, memNickEqual, memNickIncludes, memID];
  
  var minSize = Infinity, minArr = null;
  for (var i = 0; i < arrays.length; i++) {
    if (arrays[i].length < minSize && arrays[i].length != 0) {
      minArr = arrays[i];
      minSize = minArr.length;
    }
  }
  
  if (/[0-9]+/.test(query)) {
    try {
      return await members.fetch(query);
    } catch (e) { }
  }
  
  return minArr ? minArr : null;
}

async function searchUsers(users, query, options) {
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionUser = users.cache.get(query);
  if (mentionUser) return mentionUser;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var userArr = users.cache.array();
  
  // step 1: check if there is only one possibility anyway
  if (userArr.length == 1) return userArr[0];
  
  // all these will not be run for non debug circumstances
  if (typeof options == 'object' && options.safeMode != null && !options.safeMode) {
    // step 2: run through the array checking every element for various things
    var userLowerIncludes = [], userLowerEqual = [], userIncludes = [], userEqual = [], userID = [];
    for (var i = 0, x; i < userArr.length; i++) {
      x = userArr[i];
      if (x.username.toLowerCase() == queryLower) { userLowerIncludes.push(x); userLowerEqual.push(x); }
      else if (x.tag.toLowerCase().includes(queryLower)) userLowerIncludes.push(x);
      if (x.username == query) { userIncludes.push(x); userEqual.push(x); }
      else if (x.tag.includes(query)) userIncludes.push(x);
      if (x.id.includes(queryNumbers)) userID.push(x);
    }
    
    // step 3: all the checking for array of size 1 lol
    if (userLowerEqual.length == 1) return userLowerEqual[0];
    if (userLowerIncludes.length == 1) return userLowerIncludes[0];
    if (userEqual.length == 1) return userEqual[0];
    if (userIncludes.length == 1) return userIncludes[0];
    if (userID.length == 1) return userID[0];
    
    var arrays = [userLowerEqual, userLowerIncludes, userEqual, userIncludes, userID];
    
    var minSize = Infinity, minArr = null;
    for (var i = 0; i < arrays.length; i++) {
      if (arrays[i].length < minSize && arrays[i].length != 0) {
        minArr = arrays[i];
        minSize = minArr.length;
      }
    }
  }
  
  if (/[0-9]+/.test(query)) {
    try {
      return await users.fetch(query);
    } catch (e) { }
  }
  
  return minArr ? minArr.map(x => users.cache.get(x)) : null;
}

function searchRole(roles, query) {
  let role = searchRoles(roles, query);
  if (Array.isArray(role)) return null;
  return role;
}

async function searchMember(members, query) {
  let member = await searchMembers(members, query);
  if (Array.isArray(member)) return null;
  return member;
}

async function searchUser(query, options) {
  let user = await searchUsers(client.users, query, options);
  if (Array.isArray(user)) return null;
  return user;
}

module.exports = {
  searchRoles, searchMembers, searchUsers,
  searchRole, searchMember, searchUser,
};
