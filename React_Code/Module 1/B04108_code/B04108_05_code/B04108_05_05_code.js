var case_insensitive_comparison = function(first, second) {
  if (first.toLowerCase() < second.toLowerCase()) {
    return -1;
  } else if (first.toLowerCase() > second.toLowerCase()) {
    return 1;
  } else {
    return 0;
  }
