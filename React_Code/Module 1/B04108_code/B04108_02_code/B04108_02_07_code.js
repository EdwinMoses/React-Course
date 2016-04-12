var sort = function(array, comparator) {
  if (typeof comparator === 'undefined') {
    comparator = function(first, second) {
      if (first < second) {
        return -1;
      } else if (second < first) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  var before = [];
  var same = [];
  var after = [];
  if (array.length) {
    same.push(array[0]);
  }
  for(var i = 1; i < array.length; ++i) {
    if (comparator(array[i], array[0]) < 0) {
      before.push(array[i]);
    } else if (comparator(array[i], array[0]) > 0) {
      after.push(array[i]);
    } else {
      same.push(array[i]);
    }
  }
  var result = [];
  if (before.length) {
    result = result.concat(sort(before, comparator));
  }
  result = result.concat(same);
  if (after.length) {
    result = result.concat(sort(after, comparator));
  }
  return result;
}
