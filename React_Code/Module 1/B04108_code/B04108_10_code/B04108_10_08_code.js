    on_change: function() {
      if (this.state.entry_being_added.hasOwnProperty('repeats') {
        (this.state.entry_being_added.repeats =
          !this.state.entry_being_added.repeats);
      } else {
        var new_entry = this.new_series_entry();
        new_entry.time = this.state.entry_being_added.time;
        new_entry.month = this.state.entry_being_added.month;
        new_entry.date = this.state.entry_being_added.date;
        new_entry.year = this.state.entry_being_added.year;
        this.state.entry_being_added = new_entry;
      }
    },
