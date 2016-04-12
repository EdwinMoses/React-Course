  render: function() {
    var children = ['div', {}];
    for(var outer = 0; outer < this.state.rows.length;
      outer += 1) {
      var subchildren = ['div', null];
      for(var inner = 0; inner < this.state.rows[outer].length;
        inner += 1) {
        var symbol = this.state.rows[outer][inner];
        var out_symbol; 
        if (symbol === 'a') {
          // out_symbol = '&#9632;';
          out_symbol = '■';
        } else if (symbol === 's') {
          // out_symbol = '&#9658;';
          out_symbol = '►';
        } else if (symbol === ' ') {
          // out_symbol = '&nbsp;';
          out_symbol = ' ';
        } else if (symbol === '-') {
          out_symbol = '-';
        } else if (symbol === '*') {
          out_symbol = '*';
        } else {
          console.log('Missed character: ' + symbol);
        }
        subchildren.push(React.createElement('span', {
          'style': {
            'position': 'absolute',
            'top': 18 * outer - 20),
            'left': 12 * inner – 75
          }
        }, out_symbol));
      }
      children.push(React.createElement.apply(this, subchildren));
    }
    return React.createElement.apply(this, children);
  }
});
