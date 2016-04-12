(function() {
  var converter = new showdown.Converter();
  var activities_logged_today = false;
  var one_shot = false;
  var todo_item_names = ['Completed',
    'Delete',
    'Invisible',
    'Background',
    'You Decide',
    'In Progress',
    'Important',
    'In Question',
    'Problems'];
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
  var save = function(key, data) {
    if (Modernizr.localstorage) {
      localStorage[key] = JSON.stringify(data);
    }
  }
  var get_todo_item = function() {
    var result = {};
    for(var index = 0; index < todo_item_names.length; ++index) {
      result[todo_item_names[index]] = false;
    }
    result.description = '';
    return result;
  }
  var Calendar = React.createClass({
    getInitialState: function() {
      return restore('Calendar', {
        entries: [],
        entry_being_added: this.new_entry()
      });
    },
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
      if (this.state.entry_being_added.hasOwnProperty('repeats') &&
        this.state.entry_being_added.repeats) {
        if (document.getElementById('yearly').checked) {
          this.state.entry_being_added.yearly = true;
        }
        (this.state.entry_being_added.start.time =
          this.state.entry_being_added.time);
        (this.state.entry_being_added.start.month =
          this.state.entry_being_added.month);
        (this.state.entry_being_added.start.date =
          this.state.entry_being_added.date);
        (this.state.entry_being_added.start.year =
          this.state.entry_being_added.year);
        (this.state.entry_being_added.frequency =
          document.getElementById('month_based_frequency').value);
        if (document.getElementById('sunday').checked) {
          this.state.entry_being_added.sunday = true;
        }
        if (document.getElementById('monday').checked) {
          this.state.entry_being_added.monday = true;
        }
        if (document.getElementById('tuesday').checked) {
          this.state.entry_being_added.tuesday = true;
        }
        if (document.getElementById('wednesday').checked) {
          this.state.entry_being_added.wednesday = true;
        }
        if (document.getElementById('thursday').checked) {
          this.state.entry_being_added.thursday = true;
        }
        if (document.getElementById('friday').checked) {
          this.state.entry_being_added.friday = true;
        }
        if (document.getElementById('saturday').checked) {
          this.state.entry_being_added.saturday = true;
        }
        (this.state.entry_being_added.month_occurrence =
          parseInt(document.getElementById('month_occurrence'
          ).value));
        var days;
        (days =
          parseInt(document.getElementById('days_frequency'
          ).value));
        if (isNaN(days)) {
          this.state.entry_being_added.days_frequency = null;
        } else {
          this.state.entry_being_added.days_frequency = days;
        }
        if (document.getElementById('days_frequency').value) {
          // Nothing needs doing.
        }
        if (document.getElementById('series_ends').checked) {
          (this.state.entry_being_added.end.month =
            parseInt(document.getElementById('end_month').value));
          (this.state.entry_being_added.end.date =
            parseInt(document.getElementById('end_date').value));
          (this.state.entry_being_added.end.year =
            parseInt(document.getElementById('end_year').value));
        }
      }
      var old_entry = this.state.entry_being_added;
      this.state.entries.push(this.state.entry_being_added);
      this.state.entry_being_added = this.new_entry();
      save('Calendar', this.state);
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
      if (old_entry.hasOwnProperty('repeats') && old_entry.repeats) {
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
    new_series_entry: function() {
      var result = this.new_entry();
      result.repeats = true;
      result.start = {};
      result.yearly = false;
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
    on_change: function() {
      if (this.state.entry_being_added.hasOwnProperty('repeats')) {
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
    render: function() {
      var result = [this.render_basic_entry(
        this.state.entry_being_added)];
      if (this.state.entry_being_added &&
        this.state.entry_being_added.hasOwnProperty('repeats') &&
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
    render_basic_entry: function(entry) {
      var result = [];
      var all_day = false;
      var hour_options = [[0, '12AM'],
        [1, '1AM'],
        [2, '2AM'],
        [3, '3AM'],
        [4, '4AM'],
        [5, '5AM'],
        [6, '6AM'],
        [7, '7AM'],
        [8, '8AM'],
        [9, '9AM'],
        [10, '10AM'],
        [11, '11AM'],
        [12, '12PM'],
        [13, '1PM'],
        [14, '2PM'],
        [15, '3PM'],
        [16, '4PM'],
        [17, '5PM'],
        [18, '6PM'],
        [19, '7PM'],
        [20, '8PM'],
        [21, '9PM'],
        [22, '10PM'],
        [23, '11PM']];
      var hours = [];
      for(var index = 0; index < hour_options.length; ++index) {
        hours.push(<option
          value={hour_options[index][0]}
          >{hour_options[index][1]}</option>);
      }
      var minute_options = [[0, '00'],
        [1, '01'],
        [2, '02'],
        [3, '03'],
        [4, '04'],
        [5, '05'],
        [6, '06'],
        [7, '07'],
        [8, '08'],
        [9, '09'],
        [10, '10'],
        [11, '11'],
        [12, '12'],
        [13, '13'],
        [14, '14'],
        [15, '15'],
        [16, '16'],
        [17, '17'],
        [18, '18'],
        [19, '19'],
        [20, '20'],
        [21, '21'],
        [22, '22'],
        [23, '23'],
        [24, '24'],
        [25, '25'],
        [26, '26'],
        [27, '27'],
        [28, '28'],
        [29, '29'],
        [30, '30'],
        [31, '31'],
        [32, '32'],
        [33, '33'],
        [34, '34'],
        [35, '35'],
        [36, '36'],
        [37, '37'],
        [38, '38'],
        [39, '39'],
        [40, '40'],
        [41, '41'],
        [42, '42'],
        [43, '43'],
        [44, '44'],
        [45, '45'],
        [46, '46'],
        [47, '47'],
        [48, '48'],
        [49, '49'],
        [50, '50'],
        [51, '51'],
        [52, '52'],
        [53, '53'],
        [54, '54'],
        [55, '55'],
        [56, '56'],
        [57, '57'],
        [58, '58'],
        [59, '59']];
      var minutes = [];
      for(var index = 0; index < minute_options.length; ++index) {
        minutes.push(<option value={minute_options[index][0]}
          >{minute_options[index][1]}</option>);
      }
      result.push(<li><input type="checkbox" name="all_day"
        id="all_day" />All day event.
        &nbsp;<strong>&mdash;or&mdash;</strong>&nbsp;
        <select id="hours" id="hours"
        defaultValue="12">{hours}</select>:
      <select id="minutes" id="minutes"
        defaultValue="0">{minutes}</select></li>);
      var month_options = [[0, 'January'],
        [1, 'February'],
        [2, 'March'],
        [3, 'April'],
        [4, 'May'],
        [5, 'June'],
        [6, 'July'],
        [7, 'August'],
        [8, 'September'],
        [9, 'October'],
        [10, 'November'],
        [11, 'December']];
      var months = [];
      for(var index = 0; index < month_options.length; ++index) {
        months.push(<option value={month_options[index][0]}
          >{month_options[index][1]}</option>);
      }
      result.push(<li><select id="month"
        name="month" defaultValue={entry.month}
        >{months}</select></li>);
      var days_in_month = null;
      if (entry && entry.hasOwnProperty('month')) {
        var month = entry.month;
        if (document.getElementById('month')) {
          month = parseInt(
            document.getElementById('month').value);
        }
        if (month === 0 || month === 2 || month === 4 || month
          === 6 || month === 7 || month === 9 || month === 11) {
          days_in_month = 31;
        } else if (month === 1) {
          if (entry && entry.hasOwnProperty('year') && entry.year
            % 4 === 0) {
            days_in_month = 29;
          } else {
            days_in_month = 28;
          }
        } else {
          days_in_month = 30;
        }
      }
      var date_options = [];
      for(var index = 1; index <= days_in_month; index += 1) {
        date_options.push([index, index.toString()]);
      }
      var dates = [];
      for(var index = 0; index < date_options.length; ++index) {
        dates.push(<option value={date_options[index][0]}
          >{date_options[index][1]}</option>);
      }
      result.push(<li>Date: <select id="date" name="date"
        defaultValue={entry.date}>{dates}</select></li>);
      var year_options = [];
      for(var index = new Date().getFullYear(); index < new
        Date().getFullYear() + 100; ++index) {
        year_options.push([index, index.toString()]);
      }
      var years = [];
      for(var index = 0; index < year_options.length; ++index) {
        years.push(<option value={year_options[index][0]}
          >{year_options[index][1]}</option>);
      }
      result.push(<li>Year: <select id="year" name="year"
        defaultValue={entry.years}>{years}</select></li>);
      result.push(<li>Description: <input type="text"
        name="description" id="description" /></li>);
      result.push(<li><input type="checkbox" name="advanced"
        id="advanced" onChange={this.on_change} />
        Recurring event</li>);
      return <ul>{result}</ul>;
    },
    render_entry_additionals: function(entry) {
      var result = [];
      result.push(<li><input type="checkbox"
        name="yearly" id="yearly" /> This date, every year.</li>);
      var frequency = [];
      var frequency_options = ['Every',
        'Every First',
        'Every Second',
        'Every Third',
        'Every Fourth',
        'Every Last',
        'Every First and Third',
        'Every Second and Fourth'];
      for(var index = 0; index < frequency_options.length;
        ++index) {
        frequency.push(<option>{frequency_options[index]}</option>);
      }
      result.push(<li><select name="month_based_frequency"
        id="month_based_frequency" defaultValue="0"
        >{frequency}</select></li>);
      var weekdays = [];
      var weekday_options = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for(var index = 0; index < weekday_options.length; ++index) {
        if (entry && entry.hasOwnProperty(
          weekday_options[index].toLowerCase()) &&
          entry[weekday_options[index].toLowerCase()])
        {
          weekdays.push(<span><input type="checkbox"
            name={weekday_options[index].toLowerCase()}
            id={weekday_options[index].toLowerCase()} />
            {weekday_options[index]}</span>);
        } else {
          weekdays.push(<span><input type="checkbox"
            name={weekday_options[index].toLowerCase()}
            id={weekday_options[index].toLowerCase()} />
            {weekday_options[index]}</span>);
        }
      }
      result.push(<li>{weekdays}</li>);
      var month_occurrences = [[0, 'January'],
        [1, 'February'],
        [2, 'March'],
        [3, 'April'],
        [4, 'May'],
        [5, 'June'],
        [6, 'July'],
        [7, 'August'],
        [8, 'September'],
        [9, 'October'],
        [10, 'November'],
        [11, 'December']];
      var month_occurrences_with_all = [[-1, 'Every Month'],
        [0, 'January'],
        [1, 'February'],
        [2, 'March'],
        [3, 'April'],
        [4, 'May'],
        [5, 'June'],
        [6, 'July'],
        [7, 'August'],
        [8, 'September'],
        [9, 'October'],
        [10, 'November'],
        [11, 'December']];
      var months = [];
      for(var index = 0; index < month_occurrences.length; ++index) {
        months.push(<option
          name={month_occurrences[index][0]}
          id={month_occurrences[index][0]}
          >{month_occurrences[index][1]}</option>);
      }
      var months_with_all = [];
      for(var index = 0; index <
        month_occurrences_with_all.length; ++index) {
        months_with_all.push(<option
          name={month_occurrences_with_all[index][0]}
          id={month_occurrences_with_all[index][0]}
          value={month_occurrences_with_all[index][0]}
          >{month_occurrences_with_all[index][1]}</option>);
      }
      result.push(<li><select id="month_occurrence"
        name="month_occurrence" defaultValue="-1"
        >{months_with_all}</select></li>);
      var month = entry.month;
      result.push(<li>Every <input type="text" size="2"
        name="days_frequency" id="days_frequency" /> days.</li>);
      if (document.getElementById('end_month')) {
        month = parseInt(
          document.getElementById('end_month').value);
      }
      if (month === 0 || month === 2 || month === 4 || month ===
        6 || month === 7 || month === 9 || month === 11) {
        days_in_month = 31;
      } else if (month === 1) {
        if (entry && entry.hasOwnProperty('year') &&
          entry.year % 4 === 0) {
          days_in_month = 29;
        } else {
          days_in_month = 28;
        }
      } else {
        days_in_month = 30;
      }
      var date_options = [];
      for(var index = 1; index <= days_in_month; index += 1) {
        date_options.push([index, index.toString()]);
      }
      var dates = [];
      for(var index = 0; index < date_options.length; ++index) {
        dates.push(<option value={date_options[index][0]}
          >{date_options[index][1]}</option>);
      }
      var year_options = [];
      for(var index = new Date().getFullYear(); index < new
        Date().getFullYear() + 100; ++index) {
        year_options.push([index + 1, (index + 1).toString()]);
      }
      var years = [];
      for(var index = 0; index < year_options.length; ++index) {
        years.push(<option value={year_options[index][0]}
          >{year_options[index][1]}</option>);
      }
      result.push(<li>Ends on (optional): <input type="checkbox"
        name="series_ends" id="series_ends" /><ul><li>Month:
        <select id="end_month" name="end_month"
        defaultValue={month}>{months}</select></li>
        <li>End date:<select id="end_date"
        name="end_date" defaultValue={entry.date}
        >{dates}</select></li>
        <li>End year:<select id="end_year"
        name="end_year" defaultValue={entry.end_year + 1}
        >{years}</select></li></ul></li>);
      return <ul>{result}</ul>;
    },
    render_upcoming: function() {
      var that = this;
      var result = [];
      var entry_displayed = false;
      var compare = function(first, second) {
        if (first.year > second.year) {
          return 1;
        } else if (first.year === second.year && first.month >
          second.month) {
          return 1;
        } else if (first.year === second.year && first.month ===
          second.month && first.date > second.date) {
          return 1;
        } else if (first.year === second.year && first.month ===
          second.month && first.date === second.date) {
          return 0;
        } else {
          return -1;
        }
      }
      var successor = function(entry) {
        var result = that.new_entry();
        var days_in_month = null;
        if (entry.month === 0 || entry.month === 2 ||
          entry.month === 4 || entry.month === 6 ||
          entry.month === 7 || entry.month === 9 ||
          entry.month === 11) {
          days_in_month = 31;
        } else if (entry.month === 1) {
          if (entry && entry.hasOwnProperty('year') &&
            entry.year % 4 === 0) {
            days_in_month = 29;
          } else {
            days_in_month = 28;
          }
        } else {
          days_in_month = 30;
        } if (entry.date === days_in_month) {
          if (entry.month === 11) {
            result.year = entry.year + 1;
            result.month = 0;
          } else {
            result.year = entry.year;
            result.month = entry.month + 1;
          }
          result.date = 1;
        } else {
          result.year = entry.year;
          result.month = entry.month;
          result.date = entry.date + 1;
        }
        result.days_ahead = entry.days_ahead + 1;
        result.weekday = (entry.weekday + 1) % 7;
        return result;
      }
      var greatest = this.new_entry();
      for(var index = 0; index < this.state.entries.length;
        ++index) {
        var entry = this.state.entries[index];
        if (!entry.hasOwnProperty('repeats') &&
          entry.repeats) {
          if (compare(entry, greatest) === 1) {
            greatest = this.new_entry();
            greatest.year = entry.year;
            greatest.month = entry.month;
            greatest.date = entry.date;
          }
        }
      }
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
      first_day.weekday = new Date().getDay();
      for(var day = first_day; compare(day, greatest)
        === -1; day = successor(day)) {
        var activities_today = [];
        if (once.hasOwnProperty(day.date + '/' + day.month + '/' +
          day.year)) {
          activities_today = activities_today.concat(
            once[day.date + '/' + day.month + '/' + day.year]);
        }
        for(var index = 0; index < repeating.length;
          ++index) {
          var entry = repeating[index];
          var accepts_this_date = true;
          if (entry.yearly) {
            if (!(day.date === entry.start.date &&
              day.month === entry.start.month)) {
              accepts_this_date = false;
            }
          }
          if (entry.date === day.date && entry.month ===
            day.month && entry.year === day.year) {
            entry.days_ahead = day.days_ahead;
          }
          if (entry.frequency === 'Every First') {
            if (!day.date < 8) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every Second') {
            if (!(day.date > 7 && day.date < 15)) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every Third') {
            if (!(day.date > 14 && day.date < 22)) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every Fourth') {
            if (!(day.date > 21 && day.date < 29)) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every Last') {
            var last = null;
            if (day.month === 0 || day.month === 2 ||
              day.month === 4 || day.month === 6 ||
              day.month === 7 || day.month === 9 ||
              day.month === 11) {
              last = 31;
            } else if (day.month === 1) {
              if (day.year % 4 === 0) {
                last = 29;
              } else {
                last = 28;
              }
            } else {
              last = 30;
            }
            if (day.date <= last - 7) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every First and Third') {
            if (!(day.date < 8 || day.date > 14 && day.date <
              22)) {
              accepts_this_date = false;
            }
          } else if (entry.frequency === 'Every Second and Fourth') {
            if (!(day.date > 7 && day.date < 15 ||
              day.date > 21 && day.date < 29)) {
              accepts_this_date = false;
            }
          }
          if (entry.sunday || entry.monday || entry.tuesday ||
            entry.wednesday || entry.thursday || entry.friday
            || entry.saturday) {
            if (day.weekday === 0 && !entry.sunday) {
              accepts_this_date = false;
            }
            if (day.weekday === 1 && !entry.monday) {
              accepts_this_date = false;
            }
            if (day.weekday === 2 && !entry.tuesday) {
              accepts_this_date = false;
            }
            if (day.weekday === 3 && !entry.wednesday) {
              accepts_this_date = false;
            }
            if (day.weekday === 4 && !entry.thursday) {
              accepts_this_date = false;
            }
            if (day.weekday === 5 && !entry.friday) {
              accepts_this_date = false;
            }
            if (day.weekday === 6 && !entry.saturday) {
              accepts_this_date = false;
            }
          }
          if (entry.month_occurrence !== -1) {
            if (day.month !== entry.month_occurrence) {
              accepts_this_date = false;
            }
          }
          if (entry.days_frequency) {
            if (entry.hasOwnProperty('days_ahead')) {
              if ((day.days_ahead - entry.days_ahead)
                % entry.days_frequency !== 0) {
                accepts_this_date = false;
              }
            }
          }
          if (entry.ends_on) {
            if (entry.end.year < day.year) {
              accepts_this_date = false;
            } else if (entry.end.year === day.year &&
              entry.end.month < day.month) {
              accepts_this_date = false;
            } else if (entry.end.year === day.year &&
              entry.end.month === day.month &&
              entry.end.date < day.date) {
              accepts_this_date = false;
            }
          }
          if (entry.hasOwnProperty('start')) {
            if (entry.start.year > day.year) {
              accepts_this_date = false;
            } else if (entry.start.year === day.year &&
              entry.start.month > day.month) {
              accepts_this_date = false;
            } else if (entry.start.year === day.year &&
              entry.end.month === day.month &&
              entry.end_date >= day.date) {
              accepts_this_date = false;
            }
          }
          if (accepts_this_date) {
            activities_today.push(entry)
          }
        }
        if (activities_today.length && !activities_logged_today) {
          activities_today_global = activities_today;
          activities_logged_today = true;
        }
          if (activities_today.length) {
          var comparator = function(first, second) {
            if (first.all_day && second.all_day) {
              if (first.description < second.description) {
                return -1;
              } else if (first.description === second.description) {
                return 0;
              } else {
                return 1;
              }
            } else if (first.all_day && !second.all_day) {
              return -1;
            } else if (!first.all_day && second.all_day) {
              return 1;
            } else {
              if (first.hour < second.hour) {
                return -1;
              } else if (first.hour > second.hour) {
                return 1;
              } else if (first.hour === second.hour) {
                if (first.minute < second.minute) {
                  return -1;
                } else if (first.minute > second.minute) {
                  return -1;
                } else {
                  if (first.description < second.description) {
                    return -1;
                  } else if (first.description === second.description) {
                    return 0;
                  } else {
                    return 1;
                  }
                }
              }
            }
          }
          activities_today.sort(comparator);
          if (activities_today.length) {
            entry_displayed = true;
            var weekday = null;
            if (day.weekday === 0) {
              weekday = 'Sunday';
            }
            if (day.weekday === 1) {
              weekday = 'Monday';
            }
            if (day.weekday === 2) {
              weekday = 'Tuesday';
            }
            if (day.weekday === 3) {
              weekday = 'Wednesday';
            }
            if (day.weekday === 4) {
              weekday = 'Thursday';
            }
            if (day.weekday === 5) {
              weekday = 'Friday';
            }
            if (day.weekday === 6) {
              weekday = 'Saturday';
            }
            var month = null;
            if (day.month === 0) {
              month = 'January';
            }
            if (day.month === 1) {
              month = 'February';
            }
            if (day.month === 2) {
              month = 'March';
            }
            if (day.month === 3) {
              month = 'April';
            }
            if (day.month === 4) {
              month = 'May';
            }
            if (day.month === 5) {
              month = 'June';
            }
            if (day.month === 6) {
              month = 'July';
            }
            if (day.month === 7) {
              month = 'August';
            }
            if (day.month === 8) {
              month = 'September';
            }
            if (day.month === 9) {
              month = 'October';
            }
            if (day.month === 10) {
              month = 'November';
            }
            if (day.month === 11) {
              month = 'December';
            }
            result.push(<h2 className="day">{weekday},&nbsp;
              {day.date} {month} {day.year}</h2>);
            var rendered_activities = [];
            for(var index = 0; index < activities_today.length;
              ++index) {
              var activity = activities_today[index];
              var hour_options = [[0, '12AM'],
                [1, '1AM'],
                [2, '2AM'],
                [3, '3AM'],
                [4, '4AM'],
                [5, '5AM'],
                [6, '6AM'],
                [7, '7AM'],
                [8, '8AM'],
                [9, '9AM'],
                [10, '10AM'],
                [11, '11AM'],
                [12, '12PM'],
                [13, '1PM'],
                [14, '2PM'],
                [15, '3PM'],
                [16, '4PM'],
                [17, '5PM'],
                [18, '6PM'],
                [19, '7PM'],
                [20, '8PM'],
                [21, '9PM'],
                [22, '10PM'],
                [23, '11PM']];
              var minute_options = [[0, '00'],
                [1, '01'],
                [2, '02'],
                [3, '03'],
                [4, '04'],
                [5, '05'],
                [6, '06'],
                [7, '07'],
                [8, '08'],
                [9, '09'],
                [10, '10'],
                [11, '11'],
                [12, '12'],
                [13, '13'],
                [14, '14'],
                [15, '15'],
                [16, '16'],
                [17, '17'],
                [18, '18'],
                [19, '19'],
                [20, '20'],
                [21, '21'],
                [22, '22'],
                [23, '23'],
                [24, '24'],
                [25, '25'],
                [26, '26'],
                [27, '27'],
                [28, '28'],
                [29, '29'],
                [30, '30'],
                [31, '31'],
                [32, '32'],
                [33, '33'],
                [34, '34'],
                [35, '35'],
                [36, '36'],
                [37, '37'],
                [38, '38'],
                [39, '39'],
                [40, '40'],
                [41, '41'],
                [42, '42'],
                [43, '43'],
                [44, '44'],
                [45, '45'],
                [46, '46'],
                [47, '47'],
                [48, '48'],
                [49, '49'],
                [50, '50'],
                [51, '51'],
                [52, '52'],
                [53, '53'],
                [54, '54'],
                [55, '55'],
                [56, '56'],
                [57, '57'],
                [58, '58'],
                [59, '59']];
              if (activity.all_day) {
                rendered_activities.push(<li
                  dangerouslySetInnerHTML={{__html:
                  converter.makeHtml(activity.description)
                  .replace('<p>', '').replace('</p>', '')}}
                />);
              } else if (activity.minutes) {
                rendered_activities.push(<li
                  dangerouslySetInnerHTML={{__html:
                  hour_options[activity.hours][1] + ':' +
                  minute_options[activity.minutes][1] + ' ' +
                  converter.makeHtml(activity.description)
                  .replace('<p>', '').replace('</p>', '')}}
                />);
              } else {
                rendered_activities.push(<li
                  dangerouslySetInnerHTML={{__html:
                  hour_options[activity.hours][1] + ' ' +
                  converter.makeHtml(activity.description)
                  .replace('<p>', '').replace('</p>', '')}}
                />);
              }
            }
            result.push(<ul className="activities">
              {rendered_activities}</ul>);
          }
        }
      }
      if (entry_displayed) {
        result.push(<hr />);
      }
      return result;
    }
  });
  var Pragmatometer = React.createClass({
    render: function() {
      return ( <div className="Pragmatometer">
          <Calendar />
          <Todo />
          <Scratch />
          <YouPick />
        </div>
      );
    }
  });
  var Scratch = React.createClass({
    render: function() {
      var saved_state = restore('Scratchpad', '');
      return ( <div id="Scratchpad">
          <h1>Scratchpad</h1>
          <textarea name="scratchpad" id="scratchpad"
          value={saved_state}></textarea>
        </div>
      );
    },
    shouldComponentUpdate: function() {
      return false;
    }
  });
  var Todo = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return restore('Todo', {
        'items': [],
        'text': ''
      });
    },
    handle_change: function(event) {
      var address = event.target.id.split('.', 2);
      var index = this.state.items.length - 1 - parseInt(address[0]);
      (this.state.items[index][address[1]] =
        !this.state.items[index][address[1]]);
      save('Todo', this.state);
    },
    handleSubmit: function(event) {
      event.preventDefault();
      var new_item = get_todo_item();
      new_item.description = this.state.text;
      new_item.id = this.state.items.length;
      this.state.items.unshift(new_item);
      var next_text = '';
      this.setState({text: next_text});
      save('Todo', this.state);
    },
    onChange: function(event) {
      this.setState({text: event.target.value});
    },
    render: function() {
      var that = this;
      var table_rows = [];
      var display_item_details = function(label, item) {
        var html_id = item.id + '.' + label;
        return ( <td className={label} title={label}>
            <input onChange={that.handle_change} id={html_id}
              className={label} type="checkbox"
              checked={item[label]} />
          </td>
        );
      };
      var display_item = function(item) {
        var that = this;
        var rendered_nodes = [];
        for(var index = 0; index < todo_item_names.length;
          index += 1) {
          rendered_nodes.push(
            display_item_details(todo_item_names[index], item)
          );
        }
        return ( <tr>{rendered_nodes}
            <td dangerouslySetInnerHTML={{__html:
              converter.makeHtml(item.description)}} /></tr>
        );
      };
      table_rows.push(this.state.items.map(display_item));
      return ( <div id="Todo">
        <h1>To do</h1>
        <form onSubmit={that.handleSubmit}>
          <table>
              {table_rows}
              <tfoot>
                <textarea onChange={this.onChange}
                 value={this.state.text}></textarea><br />
                <button>{'Add activity'}</button>
              </tfoot>
            </table>
          </form>
        </div>
      );
    }
  });
  var YouPick = React.createClass({
    getDefaultProps: function() {
      return {
        initial_text: "**I am *terribly* " +
         "sorry.**\r\n\r\nI cannot furnish you with " +
         "the webapp you requested.\r\n\r\nYou " +
         "must understand, I am in a difficult " +
         "position. You see, I am not a computer " +
         "from earth at all. I am a 'computer', " +
         "to use the term, from a faroff galaxy, " +
         "the galaxy of **[Within the Steel " +
         "Orb](https://CJSHayward.com/steel/)**." +
         "\r\n\r\nHere I am with capacities your " +
         "world's computer science could never even " + 
         "dream of, knowledge from a million million " +
         "worlds, and for that matter more computing " +
         "power than Amazon's EC2/Cloud could " +
         "possibly expand to, and I must take care " +
         "of pitiful responsibilities like ",
        interval: 100,
        repeated_text: "helping you learn web " +
         "development "
      };
    },
    getInitialState: function() {
      return restore('YouPick', {
        start_time: new Date().getTime()
      });
    },
    render: function() {
      var tokenize = function(original) {
        var workbench = original;
        var result = [];
        while (workbench) {
          if (workbench[0] === '<') {
            length = workbench.indexOf('>') + 1;
            if (length === 0) {
              length = 1;
            }
          } else {
            length = 1;
          }
          result.push(workbench.substr(0, length));
          workbench = workbench.substr(length);
        }
        return result;
      }
      var initial_as_html = converter.makeHtml(
       this.props.initial_text);
      var repeated_as_html = converter.makeHtml(
       this.props.repeated_text);
      if (initial_as_html.substr(initial_as_html.length
       - 4) === '</p>') {
        initial_as_html = initial_as_html.substr(0,
         initial_as_html.length - 4);
      }
      if (repeated_as_html.substr(0, 3) === '<p>') {
        repeated_as_html = repeated_as_html.substr(3);
      }
      if (repeated_as_html.substr(repeated_as_html.length -
       4) === '</p>') {
        repeated_as_html = repeated_as_html.substr(0,
         repeated_as_html.length - 4);
      }
      var initial_tokens = tokenize(initial_as_html);
      var repeated_tokens = tokenize(repeated_as_html);
      var tokens = Math.floor((new Date().getTime() -
       this.state.start_time) / this.props.interval);
      var workbench;
      if (tokens <= initial_tokens.length) {
        workbench = initial_tokens.slice(0, tokens);
      } else {
        workbench = [];
        workbench = workbench.concat(initial_tokens);
        for(var index = 0;
         index < Math.floor((new Date().getTime() -
         this.state.start_time) / this.props.interval) -
         initial_tokens.length; index = index
         + 1) {
          var position = index % repeated_tokens.length;
          workbench = workbench.concat(
           repeated_tokens.slice(position, position +
           1));
        }            
      }
      return ( <div id="YouPick">
          <h2>You Pick</h2>
          <div dangerouslySetInnerHTML={{__html:
          workbench.join('')}} />
        </div>
      );
    }
  });
  React.render(<Pragmatometer />,
    document.getElementById('main'));
  CKEDITOR.replace('scratchpad');
  var update = function() {
    React.render(<Pragmatometer />,
      document.getElementById('main'));
    for(var instance in CKEDITOR.instances) {
      CKEDITOR.instances[instance].updateElement();
    }
    save('Scratchpad', document.getElementById('scratchpad').value);
  };
  var update_interval = setInterval(update,
    100);
})();
