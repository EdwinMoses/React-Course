/**
 * Created by tombray on 9/27/15.
 */
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
  } = React;

class NoteList extends React.Component {

  constructor (props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  render() {
    return (
      <ListView
        dataSource={this.ds.cloneWithRows(this.props.notes)}
        renderRow={(rowData) => {
              return (
                <TouchableHighlight onPress={() => this.props.onSelectNote(rowData)}>
                  <Text>{rowData.title}</Text>
                </TouchableHighlight>
              )
            }
          }/>
      )
  }
}

module.exports = NoteList;