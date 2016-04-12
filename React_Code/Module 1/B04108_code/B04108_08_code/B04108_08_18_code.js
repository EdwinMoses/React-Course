 var update = function() {
    React.render(<Pragmatometer />,
      document.getElementById('main'));
  };
  update();
  var update_interval = setInterval(update, 1);
})();
