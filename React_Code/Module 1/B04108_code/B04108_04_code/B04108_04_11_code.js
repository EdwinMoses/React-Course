  var get_level = function() {
    level += 1;
    rows = [];
    result = {};
    chance_clear *= (9 / 10);
    for(var outer = 0; outer < height; ++outer) {
      rows.push([]);
      for(var inner = 0; inner < width; ++inner) {
        if (Math.random() > chance_clear) {
          rows[outer].push('a');
        } else {
          rows[outer].push(' ');
        }
      }
    }
    rows[1][0] = 's';
    rows[1][1] = ' ';
    return rows;
  }
