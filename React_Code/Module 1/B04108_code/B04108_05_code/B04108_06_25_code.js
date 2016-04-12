var factory_for_objects_with_private_member = function() {
  var counter = 0;
  return {
    'increment': function() {
      counter += 1;
    },
    'decrement': function() {
      counter -= 1;
    },
    'get_count': function() {
      return counter;
    }
  }
};
