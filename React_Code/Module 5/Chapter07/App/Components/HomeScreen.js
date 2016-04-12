'use strict'

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} = React;

var SimpleButton = require('./SimpleButton');
var NoteList = require('./NoteList');

class HomeScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        {this.props.notes.length > 0 ?
          <NoteList notes={this.props.notes} onSelectNote={this.props.onSelectNote}/> :
        (
          <View style={styles.center}>
            <Text style={styles.noNotesText}>You haven't created any notes!</Text>

            <SimpleButton
              onPress={() => this.props.navigator.push({
                name: 'createNote',
                note: {
                  id: new Date().getTime(),
                  title: '',
                  body: '',
                  isSaved: false
                }
              })}
              customText="Create Note"
              style={styles.simpleButton}
              textStyle={styles.simpleButtonText}
            />
          </View>
        )}
      </View>

    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  noNotesText: {
    color: '#48209A',
    marginBottom: 10
  },
  simpleButton: {
    backgroundColor: '#5B29C1',
    borderColor: '#48209A',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: 'darkgrey',
    shadowOffset: {
        width: 1,
        height: 1
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  simpleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

module.exports = HomeScreen;

