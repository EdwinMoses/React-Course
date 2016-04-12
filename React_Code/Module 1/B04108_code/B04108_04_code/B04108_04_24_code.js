if (position < width) {
  if (rows[row][position] === 'a') {
    game_over = true;
    game_over_timestamp = new Date().getTime();
    (document.getElementById('display').innerHTML =
    '<span style="font-size: larger;">GAME OVER' +
    '<br />SCORE: ' + score + '</span>');
    return;
 }
