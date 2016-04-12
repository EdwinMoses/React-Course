      if (initial_as_html.substr(initial_as_html.length - 4) 
        === '</p>') {
        initial_as_html = initial_as_html.substr(0,
          initial_as_html.length - 4);
      }
      if (repeated_as_html.substr(0, 3) === '<p>') {
        repeated_as_html = repeated_as_html.substr(3);
      }
      if (repeated_as_html.substr(repeated_as_html.length - 4)
        === '</p>') {
        repeated_as_html = repeated_as_html.substr(0,
          repeated_as_html.length - 4);
      }
