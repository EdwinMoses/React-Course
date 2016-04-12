var mostly_case_insensitive_comparison = function(first, second) {
  if (first.toLowerCase() < second.toLowerCase()) {
    return -1;
  } else if (first.toLowerCase() > second.toLowerCase()) {
    return 1;
  } else {
    if (first < second) {
      return -1;
    } else if (second < first) {
      return 1;
    } else {
      return 0;
    }
  }
}
