// searches a collection with a query

function searchRoles(roles, query) {
  // convert mentions to the inside
  if (/<(?:#|@)[0-9]+>/.test(query)) query = query.slice(2, query.length - 1);
  if (/<@(?:!|&)[0-9]+>/.test(query)) query = query.slice(3, query.length - 1);
  
  // if mention / id by itself is valid, return it immediately
  var mentionrole = roles.cache.get(query);
  if (mentionrole) return mentionrole;
  
  // total ids
  var ids = roles.cache.keyArray();
  
  // step 1: check if there is only one possibility anyway
  if (ids.length == 1) return roles.cache.get(ids[0]);
  
  // step 2: case insensitive name check
  var ids2 = ids.filter(x => roles.cache.get(x).name.toLowerCase().includes(query.toLowerCase()));
  if (ids2.length == 1) return roles.cache.get(ids2[0]);
  
  // step 3: case sensitive name check
  var ids3 = ids2.filter(x => roles.cache.get(x).name.includes(query));
  if (ids3.length == 1) return roles.cache.get(ids3[0]);
  
  // step 4: id substring check
  var ids4 = ids.filter(x => x.includes(query));
  if (ids4.length == 1) return roles.cache.get(ids4[0]);
  
  var arrays = [ids2, ids3, ids4];
  
  var minSize = Infinity, minArr = null;
  for (var i = 0; i < arrays.length; i++) {
    if (arrays[i].length < minSize && arrays[i].length != 0) {
      minArr = arrays[i];
      minSize = minArr.length;
    }
  }
  return minArr ? minArr.map(x => roles.cache.get(x)) : [];
}

async function searchMembers(members, query) {
  // convert mentions to the inside
  if (/<(?:#|@)[0-9]+>/.test(query)) query = query.slice(2, query.length - 1);
  if (/<@(?:!|&)[0-9]+>/.test(query)) query = query.slice(3, query.length - 1);
  
  // if mention / id by itself is valid, return it immediately
  var mentionmember = members.cache.get(query);
  if (mentionmember) return mentionmember;
  
  // total ids
  var ids = members.cache.keyArray();
  
  // step 1: check if there is only one possibility anyway
  if (ids.length == 1) return membersids[0];
  
  // step 2: case insensitive name check
  var ids2 = ids.filter(x => members.cache.get(x).user.tag.toLowerCase().includes(query.toLowerCase()));
  if (ids2.length == 1) return members.cache.get(ids2[0]);
  
  // step 3: case sensitive name check
  var ids3 = ids2.filter(x => members.cache.get(x).user.tag.includes(query));
  if (ids3.length == 1) return members.cache.get(ids3[0]);
  
  // step 4: id substring check
  var ids4 = ids.filter(x => x.includes(query));
  if (ids4.length == 1) return members.cache.get(ids4[0]);
  
  var arrays = [ids2, ids3, ids4];
  
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
  
  return minArr ? minArr.map(x => members.cache.get(x)) : null;
}

async function searchUsers(users, query) {
  // convert mentions to the inside
  if (/<(?:#|@)[0-9]+>/.test(query)) query = query.slice(2, query.length - 1);
  if (/<@(?:!|&)[0-9]+>/.test(query)) query = query.slice(3, query.length - 1);
  
  // if mention / id by itself is valid, return it immediately
  var mentionmember = users.cache.get(query);
  if (mentionmember) return mentionmember;
  
  // total ids
  var ids = users.cache.keyArray();
  
  // step 1: check if there is only one possibility anyway
  if (ids.length == 1) return usersids[0];
  
  // step 2: case insensitive name check
  var ids2 = ids.filter(x => users.cache.get(x).tag.toLowerCase().includes(query.toLowerCase()));
  if (ids2.length == 1) return users.cache.get(ids2[0]);
  
  // step 3: case sensitive name check
  var ids3 = ids2.filter(x => users.cache.get(x).tag.includes(query));
  if (ids3.length == 1) return users.cache.get(ids3[0]);
  
  // step 4: id substring check
  var ids4 = ids.filter(x => x.includes(query));
  if (ids4.length == 1) return users.cache.get(ids4[0]);
  
  var arrays = [ids2, ids3, ids4];
  
  var minSize = Infinity, minArr = null;
  for (var i = 0; i < arrays.length; i++) {
    if (arrays[i].length < minSize && arrays[i].length != 0) {
      minArr = arrays[i];
      minSize = minArr.length;
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

async function searchUser(query) {
  let user = await searchUsers(client.users, query);
  if (Array.isArray(user)) return null;
  return user;
}

module.exports = {
  searchRoles, searchMembers, searchUsers,
  searchRole, searchMember, searchUser,
};
