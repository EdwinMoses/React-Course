var map = function(arr, func) {
  var result = [];
  for(var index = 0; index < arr.length; ++index) {
    if (typeof arr[index] !== 'undefined') {
      result[index] = func(arr[index]);
    }
  }
  return result;
};
