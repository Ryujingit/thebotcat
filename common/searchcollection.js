// searches a collection with a query
module.exports = function searchCollection(coll, query) {
  // convert mentions to the inside
  if (/<(?:#|@)[0-9]+>/.test(query)) query = query.slice(2, query.length - 1);
  if (/<@(?:!|&)[0-9]+>/.test(query)) query = query.slice(3, query.length - 1);

  // if mention / id by itself is valid, return it immediately
  if (coll.get(query)) return query;

  // total ids
  var ids = coll.keyArray();
  
  // step 1: check if there is only one possibility anyway
  if (ids.length == 1) return ids[0];

  // step 2: case insensitive name check
  var ids2 = ids.filter(x => coll.get(x).name.toLowerCase().includes(query.toLowerCase()));
  if (ids2.length == 1) return ids2[0];

  // step 3: case sensitive name check
  var ids3 = ids2.filter(x => coll.get(x).name.includes(query));
  if (ids3.length == 1) return ids3[0];
  
  // step 4: id substring check
  var ids4 = ids.filter(x => x.includes(query));
  if (ids4.length == 1) return ids4[0];

  var arrays = [ids2, ids3, ids4];
  console.log(arrays);
  var minSize = Infinity, minArr = null;
  for (var i = 0; i < arrays.length; i++) {
    if (arrays[i].length < minSize && arrays[i].length != 0) {
      minArr = arrays[i];
      minSize = minArr.length;
    }
  }
  return minArr;
};