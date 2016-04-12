  var save = function(key, data) {
    if (Modernizr.localstorage) {
      localStorage[key] = JSON.stringify(data);
    }
  }
