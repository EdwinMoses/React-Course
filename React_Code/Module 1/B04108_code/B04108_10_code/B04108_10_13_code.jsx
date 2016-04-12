render_entry_additionals: function(entry) {
      var result = [];
      result.push(<li><input type="checkbox" 
        name="yearly" id="yearly"> This day,
        every year.</li>);
      var frequency = [];
      var frequency_options = ['Every',
        'Every First',
        'Every Second',
        'Every Third',
        'Every Fourth',
        'Every Last',
        'Every First and Third',
        'Every Second and Fourth'];
      for(var index = 0; index < frequency_options.length;
        ++index) {
        frequency.push(<option>{frequency_options[index]}
          </option>);
      }
