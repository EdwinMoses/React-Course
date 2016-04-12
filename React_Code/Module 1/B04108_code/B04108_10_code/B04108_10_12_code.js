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
      result.push(<li><input type="submit" value="Save" /></li>);
      return <ul>{result}</ul>;
    },
