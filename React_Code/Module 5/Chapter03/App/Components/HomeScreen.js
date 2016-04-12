'use strict'

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var SimpleButton = require('./SimpleButton');

class HomeScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.noNotesText}>You haven't created any notes!</Text>

        <SimpleButton
          onPress={() => this.props.navigator.push({
            name: 'createNote'
          })}
          customText="Create Note"
          style={styles.simpleButton}
          textStyle={styles.simpleButtonText}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 16
  }


});

module.exports = HomeScreen;
