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
