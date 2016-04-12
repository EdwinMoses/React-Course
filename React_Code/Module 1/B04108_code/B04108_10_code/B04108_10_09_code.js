    render: function() {
      var result = [this.render_basic_entry(
        this.state.entry_being_added)];
      if (this.state.entry_being_added &&
        this.state.entry_being_added.hasOwnProperty('repeats')
        this.state.entry_being_added.repeats) {
        result.push(this.render_entry_additionals(
          this.state.entry_being_added));
      }
      return (<div id="Calendar">
        <h1>Calendar</h1>
        {this.render_upcoming()}<form onSubmit={
        this.handle_submit}>{result}
        <input type="submit" value="Save" /></form></div>);
    },
