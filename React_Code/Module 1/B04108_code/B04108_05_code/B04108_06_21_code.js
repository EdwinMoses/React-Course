function fold_left(arr, fun) {
  var accumulator;
  for(var index = 0; index < arr.length; ++index) {
    if (typeof arr[index] !== 'undefined') {
      if (typeof accumulator === 'undefined') {
        accumulator = arr[index];
      } else {
        accumulator = fun(accumulator, arr[index]);
      }
    }
  }
  return accumulator;
}
