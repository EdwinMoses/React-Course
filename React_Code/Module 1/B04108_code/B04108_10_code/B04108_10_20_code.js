      var greatest = this.new_entry();
      for(var index = 0; index < this.state.entries.length;
        ++index) {
        var entry = this.state.entries[index];
        if (!entry.hasOwnProperty('repeats') && entry.repeats) {
          if (compare(entry, greatest) === 1) {
            greatest = this.new_entry();
            greatest.year = entry.year;
            greatest.month = entry.month;
            greatest.date = entry.date;
          }
        }
      }
