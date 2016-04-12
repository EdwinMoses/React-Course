var converter = new Showdown.converter();
var hello_world = React.createClass({
  render: function() {
    var raw_markdown = '*Hello*, world!';
    var showdown_markup = converter.makeHtml(raw_markdown);
    return (
      <div dangerouslySetInnerHtml={{__html:
        showdown_markup}}>
      </div>
    );
  }
});
