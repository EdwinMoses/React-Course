result.push(<li><select name="month_based_frequency"
        id="month_based_frequency" defaultValue="0"
        >{frequency}</select></li>);
      var weekdays = [];
      var weekday_options = ['Sunday', 'Monday', 'Tuesday',
        'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for(var index = 0; index < weekday_options.length;
        ++index) {
        if (entry && entry.hasOwnProperty(
          weekday_options[index].toLowerCase()) &&
          entry[weekday_options[index].toLowerCase()]) {
          weekdays.push(<span><input type="checkbox"
            name={weekday_options[index].toLowerCase()}
            id={weekday_options[index].toLowerCase()}
            />
            {weekday_options[index]}</span>);
        } else {
          weekdays.push(<span><input type="checkbox"
            name={weekday_options[index].toLowerCase()}
            id={weekday_options[index].toLowerCase()} />
            {weekday_options[index]}</span>);
        }
      }
      result.push(<li>{weekdays}</li>);
