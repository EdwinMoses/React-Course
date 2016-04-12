  React.render(<Pragmatometer />,
    document.getElementById('main'));
  CKEDITOR.replace('scratchpad');
  var update = function() {
    React.render(<Pragmatometer />,
      document.getElementById('main'));
    for(var instance in CKEDITOR.instances) {
      CKEDITOR.instances[instance].updateElement();
    }
    save('Scratchpad', 
      document.getElementById('scratchpad').value);
  };
  var update_interval = setInterval(update,
    100);
