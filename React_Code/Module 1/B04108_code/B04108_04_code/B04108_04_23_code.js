else if (move === 's') {
       shot_taken = true;
       score -= 1;
       var asteroid_found = false;
       for(var index = position + 1; index < width &&
         !asteroid_found; index += 1) {
         if (board.rows[row][index] === 'a') {
           board.rows[row][index] = '*';
           asteroid_found = true;
         } else {
           board.rows[row][index] = '-';
         }
       }
     }
     keystrokes = [];
   }
