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
