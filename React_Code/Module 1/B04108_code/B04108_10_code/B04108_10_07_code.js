    new_series_entry: function() {
      var result = this.new_entry();
      result.repeats = true;
      result.start = {};
      result.start.hours = null;
      result.start.minutes = null;
      result.start.month = new Date().getMonth();
      result.start.date = new Date().getDate();
      result.start.year = new Date().getFullYear();
      result.frequency = null;
      result.sunday = false;
      result.monday = false;
      result.tuesday = false;
      result.wednesday = false;
      result.thursday = false;
      result.friday = false;
      result.saturday = false;
      result.month_occurrence = -1;
      result.end = {};
      result.end.time = null;
      result.end.month = null;
      result.end.date = null;
      result.end.year = null;
      return result;
      },
