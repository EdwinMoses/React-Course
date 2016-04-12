   if (keystrokes.length) {
     var move = keystrokes[keystrokes.length – 1];
     if (move === 'u') {
       row -= 1;
       if (row < 0) {
         row = 0;
       }
     } else if (move === 'd') {
       row += 1; 
       if (row > height - 1) {
         row = height - 1;
       }
     }
