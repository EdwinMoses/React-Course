          if (activities_today.length) {
            activities_logged_today = true;
            var comparator = function(first, second) {
              if (first.all_day && second.all_day) {
                if (first.description < second.description) {
                  return -1;
                } else if (first.description ===
                  second.description) {
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
                    if (first.hour < second.hour) {
                  return -1;
                } else if (first.hour > second.hour) {
                  return 1;
                } else if (first.hour === second.hour) {
                  if (first.minute < second.minute) {
                    return -1;
                  } else if (first.minute > second.minute) {
                    return -1;
                  }
                }
              }
            }
            activities_today.sort(comparator);
