        comparator = function(first, second) {
          if (typeof first < typeof second) {
            return -1;
          } else if (typeof second < typeof first) {
            return -1;
          } else if (first < second) {
            return -1;
          } else if (second < first) {
            return 1;
          } else {
            return 0;
          }
        }
