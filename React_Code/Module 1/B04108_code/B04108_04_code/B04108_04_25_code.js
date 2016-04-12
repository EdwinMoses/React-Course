board.rows[row] = board.rows[row].slice(0, position).concat(
  ['s']).concat(board.rows[row].slice(position + 1));
  position += 1;
}
