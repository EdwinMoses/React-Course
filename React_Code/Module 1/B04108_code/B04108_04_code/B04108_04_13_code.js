  var DisplayGrid = React.createClass({
    componentDidMount: function() {
      document.body.addEventListener('keypress', this.onKeyPress);
      document.body.addEventListener('keydown', this.onKeyDown);
    },
