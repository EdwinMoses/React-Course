function fold_right(arr, fun) {
  var accumulator;
  for(var index = arr.length - 1; index >= 0; --index) {
    if (typeof arr[index] !== 'undefined') {
      if (typeof accumulator === 'undefined') {
        accumulator = arr[index];
      } else {
        accumulator = fun(arr[index], accumulator);
      }
    }
  }
  return accumulator;
}
