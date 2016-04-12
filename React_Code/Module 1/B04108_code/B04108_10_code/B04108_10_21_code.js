      var once = {};
      var repeating = [];
      for(var index = 0; index < this.state.entries.length;
        ++index) {
        var entry = this.state.entries[index];
        if (entry.hasOwnProperty('repeats') && entry.repeats) {
          repeating.push(entry);
        } else {
          var key = (entry.date + '/' + entry.month + '/' +
            entry.year);
          if (once.hasOwnProperty(key)) {
            once[key].push(entry);
          } else {
            once[key] = [entry];
          }
        }
      }
      greatest.year += 1;
      var first_day = this.new_entry();
      first_day.days_ahead = 0;
