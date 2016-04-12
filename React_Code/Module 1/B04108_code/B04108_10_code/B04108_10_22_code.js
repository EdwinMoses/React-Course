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
