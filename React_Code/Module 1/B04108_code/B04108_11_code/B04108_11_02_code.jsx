var Scratchpad = React.createClass({
    render: function() {
      return (
        <div id="Scratchpad">
          <h1>Scratchpad</h1>
          <textarea name="scratchpad"
            id="scratchpad"></textarea>
        </div>
      );
    },
    shouldComponentUpdate: function() {
      return false;
    }
  });
