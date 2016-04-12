    handle_submit: function(event) {
      event.preventDefault();
      (this.state.entry_being_added.month =
        parseInt(document.getElementById('month').value));
      (this.state.entry_being_added.date =
        parseInt(document.getElementById('date').value));
      (this.state.entry_being_added.year =
        parseInt(document.getElementById('year').value));
      if (document.getElementById('all_day').checked) {
        this.state.entry_being_added.all_day = true;
      }
      (this.state.entry_being_added.description =
        document.getElementById('description').value);
      if (this.state.entry_being_added.hasOwnProperty('repeats') 
        && this.state.entry_being_added.repeats) {
        (this.state.entry_being_added.start.time =
          this.state.entry_being_added.time);
