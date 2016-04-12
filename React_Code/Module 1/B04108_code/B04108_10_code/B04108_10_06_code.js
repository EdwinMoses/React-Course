    new_entry: function() {
      var result = {};
      result.hours = 12;
      result.minutes = 0;
      result.month = new Date().getMonth();
      result.date = new Date().getDate();
      result.year = new Date().getFullYear();
      result.weekday = new Date().getDay();
      result.description = '';
      return result;
      },
