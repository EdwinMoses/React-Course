var counter = (function() {
  var value = 0;
  return {
    get_value: function() {
      return value;
    },
    increment_value: function() {
      value += 1;
    }
  }
})();
