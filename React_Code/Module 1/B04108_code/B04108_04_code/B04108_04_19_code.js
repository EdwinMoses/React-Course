  for(var outer = 0; outer < height; outer += 1) {
    for(var inner = 0; inner < width; inner += 1) {
      if (board.rows[outer][inner] === '-' ||
        board.rows[outer][inner] === '*') {
          board.rows[outer][inner] = ' ';
        }
      }
    }
