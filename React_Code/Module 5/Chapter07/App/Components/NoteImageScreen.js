'use strict'

var React = require('react-native');
var {
  Image,
  View,
  StyleSheet
} = React;

class NoteImageScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: this.props.note.imagePath}}
          style={styles.image}
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64
  },
  image: {
    flex: 1
  }
});

module.exports = NoteImageScreen;

