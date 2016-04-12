s.state.entry_being_added;
      this.state.entries.push(this.state.entry_being_added);
      this.state.entry_being_added = this.new_entry();
      var entry = this.new_entry();
      (document.getElementById('month').value =
        entry.month.toString());
      (document.getElementById('date').value =
        entry.date.toString());
      (document.getElementById('year').value =
        entry.year.toString());
      document.getElementById('all_day').checked = false;
      document.getElementById('description').value = '';
      document.getElementById('advanced').checked = false;
      if (old_entry.hasOwnProperty('repeats') &&
        old_entry.repeats) {
        (document.getElementById('month_based_frequency').value =
          'Every');
        document.getElementById('month_occurrence').value = '-1';
        document.getElementById('series_ends').checked = false;
        (document.getElementById('end_month').value = 
          '' + new Date().getMonth());
        (document.getElementById('end_date').value = 
          '' + new Date().getDate());
        (document.getElementById('end_year').value =
          '' + new Date().getFullYear() + 1);
        }
      },
