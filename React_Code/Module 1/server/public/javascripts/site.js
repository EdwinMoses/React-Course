;(function() {
  var converter = new showdown.Converter();
  var activities_logged_today = false;
  var one_shot = false;
  var scratchpad_is_initialized = false;
  var scratchpad_value = null;
  var todo_item_count = 0;
  var todo_item_names = [ 'Completed',
    'Delete',
    'Invisible',
    'Background',
    'You Decide',
    'In Progress',
    'Important',
    'In Question',
    'Problems'];
  var userid = 0;
  jQuery('#logout').click(function() {
    if (Modernizr.localstorage) {
      localStorage.removeItem('Calendar');
      localStorage.removeItem('Todo');
      localStorage.removeItem('Scratchpad');
    }
  });
  var populate_state = function(state, new_data) {
    for (field in new_data) {
      if (new_data.hasOwnProperty(field)) {
        state[field] = new_data[field];
      }
    }
    state.initialized = true;
  }
  var restore = function(identifier, default_value, state, callback) {
    populate_state(state, default_value);
    state.initialized = false;
    var complete = function(jqxhr) {
      if (jqxhr.responseText === 'undefined' || jqxhr.responseText.length &&
        jqxhr.responseText[0] === '<') {
        // We ignore non-JSON a responses
      } else {
        populate_state(state, JSON.parse(jqxhr.responseText));
      }
      callback();
      state.initialized = true;
    }
    jQuery.ajax('/restore', {
      'complete': complete,
      'data': {
        'identifier': identifier,
        'userid': userid
      },
      'method': 'POST',
    });
    if (Modernizr.localstorage) {
      if (localStorage[identifier] === null || localStorage[identifier]
        === undefined) {
        return default_value;
      } else {
        return JSON.parse(localStorage[identifier]);
      }
    } else {
      return default_value;
    }
  }
  var save = function(identifier, data) {
    if (Modernizr.localstorage) {
      localStorage[identifier] = JSON.stringify(data);
    }
    jQuery.ajax('/save', {
      'data': {
        'data': JSON.stringify(data),
        'identifier': identifier,
        'userid': userid
      },
      'method': 'POST'
    });
  }
  var get_todo_item = function() {
    var result = {};
    for(var index = 0; index < todo_item_names.length; ++index) {
      result[todo_item_names[index]] = false;
    }
    result.description = '';
    return result;
  }
  var Calendar = React.createClass({displayName: "Calendar",
    getInitialState: function() {
      default_value = {
        entries: [],
        entry_being_added: this.new_entry()
      };
      restore('Calendar', default_value,
        default_value, function() {
        jQuery('#submit-calendar').prop('disabled', false);
      });
      return default_value;
      },
    handle_submit: function(event)
      {
      event.preventDefault();
      (this.state.entry_being_added.month =
        parseInt(jQuery('#month').val()));
      (this.state.entry_being_added.date =
        parseInt(jQuery('#date').val()));
      (this.state.entry_being_added.year =
        parseInt(jQuery('#year').val()));
      if (jQuery('#all_day').checked) {
        this.state.entry_being_added.all_day = true;
      }
      (this.state.entry_being_added.description =
        jQuery('#description').val());
      if (this.state.entry_being_added.hasOwnProperty('repeats') &&
        this.state.entry_being_added.repeats) {
        if (jQuery('#yearly').is(':checked')) {
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
          jQuery('#month_based_frequency').val());
        if (jQuery('#sunday').is(':checked')) {
          this.state.entry_being_added.sunday = true;
        }
        if (jQuery('#monday').is(':checked')) {
          this.state.entry_being_added.monday = true;
        }
        if (jQuery('#tuesday').is(':checked')) {
          this.state.entry_being_added.tuesday = true;
        }
        if (jQuery('#wednesday').is('checked')) {
          this.state.entry_being_added.wednesday = true;
        }
        if (jQuery('#thursday').is('checked')) {
          this.state.entry_being_added.thursday = true;
        }
        if (jQuery('#friday').is('checked')) {
          this.state.entry_being_added.friday = true;
        }
        if (jQuery('#saturday').is('checked')) {
          this.state.entry_being_added.saturday = true;
        }
        (this.state.entry_being_added.month_occurrence =
          parseInt(jQuery('#month_occurrence').val()));
        var days;
        (days =
          parseInt(jQuery('#days_frequency').val()));
        if (isNaN(days)) {
          this.state.entry_being_added.days_frequency = null;
        } else {
          this.state.entry_being_added.days_frequency = days;
        }
        if (jQuery('#series_ends').is(':checked')) {
          (this.state.entry_being_added.end.month =
            parseInt(jQuery('#end_month').val()));
          (this.state.entry_being_added.end.date =
            parseInt(jQuery('#end_date').val()));
          (this.state.entry_being_added.end.year =
            parseInt(jQuery('#end_year').val()));
        }
      }
      var old_entry = this.state.entry_being_added;
      this.state.entries.push(this.state.entry_being_added);
      this.state.entry_being_added = this.new_entry();
      save('Calendar', this.state);
      var entry = this.new_entry();
      jQuery('#month').val(entry.month.toString());
      jQuery('#date').val(entry['date'].toString());
      jQuery('#year').val(entry.year.toString());
      jQuery('#all_day').prop('checked', false);
      jQuery('#description').val('');
      jQuery('#advanced').prop('checked', false);
      if (old_entry.hasOwnProperty('repeats') && old_entry.repeats) {
        jQuery('#month_based_frequency').val('Every');
        jQuery('#month_occurrence').val('-1');
        jQuery('#series_ends').prop('checked', false);
        jQuery('#end_month').val('' + new Date().getMonth());
        jQuery('#end_date').val('' + new Date().getDate());
        jQuery('#end_year').val('' + new Date().getFullYear() + 1);
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
      return (React.createElement("div", {id: "Calendar"}, 
        React.createElement("h1", null, "Calendar"), 
        this.render_upcoming(), React.createElement("form", {onSubmit: 
        this.handle_submit}, result, 
        React.createElement("input", {type: "submit", value: "Save", id: "submit-calendar", 
          disabled: "disabled"}))));
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
        hours.push(React.createElement("option", {
          value: hour_options[index][0]
          }, hour_options[index][1]));
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
        minutes.push(React.createElement("option", {value: minute_options[index][0]
          }, minute_options[index][1]));
      }
      result.push(React.createElement("li", null, React.createElement("input", {type: "checkbox", name: "all_day", 
        id: "all_day"}), "All day event." + ' ' +
        " ", React.createElement("strong", null, "—or—"), " ", 
        React.createElement("select", {id: "hours", id: "hours", 
        defaultValue: "12"}, hours), ":", 
      React.createElement("select", {id: "minutes", id: "minutes", 
        defaultValue: "0"}, minutes)));
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
        months.push(React.createElement("option", {value: month_options[index][0]
          }, month_options[index][1]));
      }
      result.push(React.createElement("li", null, React.createElement("select", {id: "month", 
        name: "month", defaultValue: entry.month
        }, months)));
      var days_in_month = null;
      if (entry && entry.hasOwnProperty('month')) {
        var month = entry.month;
        if (jQuery('#month').val()) {
          month = parseInt(jQuery('#month').val());
        }
        if (month === 0 || month === 2 || month === 4 || month
          === 6 || month === 7 || month === 9 || month === 11) {
          days_in_month = 31;
        }
        else if (month === 1) {
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
        dates.push(React.createElement("option", {value: date_options[index][0]
          }, date_options[index][1]));
      }
      result.push(React.createElement("li", null, "Date: ", React.createElement("select", {id: "date", name: "date", 
        defaultValue: entry.date}, dates)));
      var year_options = [];
      for(var index = new Date().getFullYear(); index < new
        Date().getFullYear() + 100; ++index) {
        year_options.push([index, index.toString()]);
      }
      var years = [];
      for(var index = 0; index < year_options.length; ++index) {
        years.push(React.createElement("option", {value: year_options[index][0]
          }, year_options[index][1]));
      }
      result.push(React.createElement("li", null, "Year: ", React.createElement("select", {id: "year", name: "year", 
        defaultValue: entry.years}, years)));
      result.push(React.createElement("li", null, "Description: ", React.createElement("input", {type: "text", 
        name: "description", id: "description"})));
      result.push(React.createElement("li", null, React.createElement("input", {type: "checkbox", name: "advanced", 
        id: "advanced", onChange: this.on_change}), 
        "Recurring event"));
      return React.createElement("ul", null, result);
    },
    render_entry_additionals: function(entry) {
      var result = [];
      result.push(React.createElement("li", null, React.createElement("input", {type: "checkbox", 
        name: "yearly", id: "yearly"}), " This date, every year."));
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
        frequency.push(React.createElement("option", null, frequency_options[index]));
      }
      result.push(React.createElement("li", null, React.createElement("select", {name: "month_based_frequency", 
        id: "month_based_frequency", defaultValue: "0"
        }, frequency)));
      var weekdays = [];
      var weekday_options = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for(var index = 0; index < weekday_options.length; ++index) {
        if (entry && entry.hasOwnProperty(
          weekday_options[index].toLowerCase()) &&
          entry[weekday_options[index].toLowerCase()]) {
          weekdays.push(React.createElement("span", null, React.createElement("input", {type: "checkbox", 
            name: weekday_options[index].toLowerCase(), 
            id: weekday_options[index].toLowerCase()}), 
            weekday_options[index]));
        } else {
          weekdays.push(React.createElement("span", null, React.createElement("input", {type: "checkbox", 
            name: weekday_options[index].toLowerCase(), 
            id: weekday_options[index].toLowerCase()}), 
            weekday_options[index]));
        }
      }
      result.push(React.createElement("li", null, weekdays));
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
        months.push(React.createElement("option", {
          name: month_occurrences[index][0], 
          id: month_occurrences[index][0]
          }, month_occurrences[index][1]));
      }
      var months_with_all = [];
      for(var index = 0; index <
        month_occurrences_with_all.length; ++index) {
        months_with_all.push(React.createElement("option", {
          name: month_occurrences_with_all[index][0], 
          id: month_occurrences_with_all[index][0], 
          value: month_occurrences_with_all[index][0]
          }, month_occurrences_with_all[index][1]));
      }
      result.push(React.createElement("li", null, React.createElement("select", {id: "month_occurrence", 
        name: "month_occurrence", defaultValue: "-1"
        }, months_with_all)));
      var month = entry.month;
      result.push(React.createElement("li", null, "Every ", React.createElement("input", {type: "text", size: "2", 
        name: "days_frequency", id: "days_frequency"}), " days."));
      if (jQuery('#end_month').val()) {
        month = parseInt(jQuery('#end_month').val());
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
        dates.push(React.createElement("option", {value: date_options[index][0]
          }, date_options[index][1]));
      }
      var year_options = [];
      for(var index = new Date().getFullYear(); index < new
        Date().getFullYear() + 100; ++index) {
        year_options.push([index + 1, (index + 1).toString()]);
      }
      var years = [];
      for(var index = 0; index < year_options.length; ++index) {
        years.push(React.createElement("option", {value: year_options[index][0]
          }, year_options[index][1]));
      }
      result.push(React.createElement("li", null, "Ends on (optional): ", React.createElement("input", {type: "checkbox", 
        name: "series_ends", id: "series_ends"}), React.createElement("ul", null, React.createElement("li", null, "Month:", 
        React.createElement("select", {id: "end_month", name: "end_month", 
        defaultValue: month}, months)), 
        React.createElement("li", null, "End date:", React.createElement("select", {id: "end_date", 
        name: "end_date", defaultValue: entry.date
        }, dates)), 
        React.createElement("li", null, "End year:", React.createElement("select", {id: "end_year", 
        name: "end_year", defaultValue: entry.end_year + 1
        }, years)))));
      return React.createElement("ul", null, result);
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
        }
        if (entry.date === days_in_month) {
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
          var identifier = (entry.date + '/' + entry.month + '/' +
            entry.year);
          if (once.hasOwnProperty(identifier)) {
            once[identifier].push(entry);
          } else {
            once[identifier] = [entry];
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
            result.push(React.createElement("h2", {className: "day"}, weekday, ", ", 
              day.date, " ", month, " ", day.year));
            var rendered_activities = [];
            for(var index = 0; index < activities_today.length; ++index) {
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
                rendered_activities.push(React.createElement("li", {
                  dangerouslySetInnerHTML: {__html:
                  converter.makeHtml(activity.description)
                  .replace('<p>', '').replace('</p>', '')}}
                  ));
              } else if (activity.minutes) {
                rendered_activities.push(React.createElement("li", {
                  dangerouslySetInnerHTML: {__html:
                  hour_options[activity.hours][1] + ':' +
                  minute_options[activity.minutes][1] + ' ' +
                  converter.makeHtml(activity.description)
                  .replace('<p>', '').replace('</p>', '')}}
                ));
              } else {
                if (activity.description) {
                  var description = converter.makeHtml(activity.description
                    ).replace('<p>', '').replace('</p>', '');
                } else {
                  var description = '';
                }
                rendered_activities.push(React.createElement("li", {
                  dangerouslySetInnerHTML: {__html:
                  hour_options[activity.hours][1] + ' ' +
                  description}}));
              }
            }
            result.push(React.createElement("ul", {className: "activities"}, 
              rendered_activities));
          }
        }
      }
      if (entry_displayed) {
          result.push(React.createElement("hr", null));
      }
      return result;
    }
  });
  var Pragmatometer = React.createClass({displayName: "Pragmatometer",
    render: function() {
      return (
        React.createElement("div", {className: "Pragmatometer"}, 
          React.createElement(Calendar, null), 
          React.createElement(Todo, null), 
          React.createElement(Scratchpad, null), 
          React.createElement(YouPick, null)
        )
      );
    }
  });
  var Scratchpad = React.createClass({displayName: "Scratchpad",
    getInitialState: function() {
      var that = this;
      result = {'text': ''};
      setTimeout(function() {
        restore('Scratchpad', '', result, function() {
          scratchpad_is_initialized = true;
          var text = '';
          for(var index = 0; that.state.hasOwnProperty(index); ++index) {
            text += that.state[index];
          }
          jQuery('#scratchpad').val(text);
          if (typeof CKEDITOR.instances['scratchpad'] === 'undefined') {
            CKEDITOR.replace('scratchpad');
          }
        });
      }, 100);
      return result;
    },
    render: function() {
      return (
        React.createElement("div", {id: "Scratchpad"}, 
          React.createElement("h1", null, "Scratchpad"), 
          React.createElement("textarea", {name: "scratchpad", id: "scratchpad", 
          value: this.state.text})
        )
      );
    },
    shouldComponentUpdate: function() {
      return false;
    }
  });
  var Todo = React.createClass({displayName: "Todo",
    mixins: [React.addons.LinkedStateMixin],
      getInitialState: function() {
        return restore('Todo', {
          'items': [],
          'text': ''
        }, {
          'items': [],
          'text': ''
        },
        function() {
          jQuery('#add-activity-button').prop('disabled', false);
        });
      },
      handle_checkbox_change: function(event) {
        console.log('Saving todo state.');
        var address = event.target.id.split('.', 2);
        var index = this.state.items.length - 1 - parseInt(address[0]);
        (this.state.items[parseInt(index)][address[1]] =
          !this.state.items[parseInt(index)][address[1]]);
        save('Todo', this.state);
        console.log('Saved todo state.');
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
        var display_todo_item_checkbox = function(label, item) {
          var html_id = item.id + '.' + label;
          return (
            React.createElement("td", {className: label, title: label}, 
              React.createElement("input", {onChange: that.handle_checkbox_change, id: html_id, 
              className: label, type: "checkbox", 
              defaultChecked: item[label]})
            )
          );
        };
        var display_todo_item = function(item) {
          var rendered_nodes = [];
          for(var index = 0; index < todo_item_names.length;
            index += 1) {
            rendered_nodes.push(
              display_todo_item_checkbox(todo_item_names[index], item)
            );
          }
          return (
            React.createElement("tr", null, rendered_nodes, 
            React.createElement("td", {dangerouslySetInnerHTML: {__html:
              converter.makeHtml(item.description)}}))
          );
        };
        table_rows.push(this.state.items.map(display_todo_item));
        return (
          React.createElement("div", {id: "Todo"}, 
            React.createElement("h1", null, "To do"), 
            React.createElement("form", {onSubmit: this.handleSubmit}, 
              React.createElement("table", null, 
                table_rows, 
                React.createElement("tfoot", null, 
                  React.createElement("textarea", {onChange: this.onChange, id: "todo-new-entries", 
                    value: this.state.text}), 
                  React.createElement("br", null), 
                  React.createElement("button", {id: "add-activity-button", 
                    disabled: "disabled"}, 'Add activity')
                )
              )
            )
          )
      );
    }
  });
  var YouPick = React.createClass( {displayName: "YouPick",
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
        'start_time': new Date().getTime()
      }, {
        'start_time': new Date().getTime()
      },
      function() {
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
      return (
        React.createElement("div", {id: "YouPick"}, 
          React.createElement("h2", null, "You Pick"), 
          React.createElement("div", {dangerouslySetInnerHTML: {__html:
          workbench.join('')}})
        )
      );
    }
  });
  React.render(React.createElement(Pragmatometer, null),
    jQuery('#main')[0]);
  var update = function() {
    React.render(React.createElement(Pragmatometer, null),
      jQuery('#main')[0]);
    if (scratchpad_is_initialized) {
      for(var instance in CKEDITOR.instances) {
        CKEDITOR.instances[instance].updateElement();
      }
      if (scratchpad_value === null ||
        jQuery('#scratchpad').val() !== scratchpad_value) {
        scratchpad_value = jQuery('#scratchpad').val();
        save('Scratchpad', jQuery('#scratchpad').val());
      }
    }
  };
  var update_interval = setInterval(update,
    100);
})();
