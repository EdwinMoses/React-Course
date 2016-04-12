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
