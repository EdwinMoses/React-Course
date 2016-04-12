  var restore = function(key, default_value) {
    if (Modernizr.localstorage) {
      if (localStorage[key] === null || localStorage[key]
        === undefined) {
        return default_value;
      } else {
        return JSON.parse(localStorage[key]);
      }
    } else {
      return default_value;
    }
  }
