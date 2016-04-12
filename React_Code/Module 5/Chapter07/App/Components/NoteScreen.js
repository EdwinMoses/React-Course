'use strict'

var React = require('react-native');
var {
  StyleSheet,
  TextInput,
  View
} = React;

var SimpleButton = require('./SimpleButton');

class NoteScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {note: Object.assign({}, props.note)};
  }

  updateNote (title, body) {
    var note = Object.assign(this.state.note, {title: title, body: body});
    this.props.onChangeNote(note);
    this.setState(note);
  }

  blurInputs () {
    this.refs.body.blur();
    this.refs.title.blur();
  }

  render () {
    // Render the picture button if the platform is iOS via showCameraButton
    var pictureButton = null;
    if (this.props.showCameraButton) {
      pictureButton = (this.state.note.imagePath) ? (
        <SimpleButton
          onPress={() => {
            this.blurInputs();
            this.props.navigator.push({
              name: 'noteImage',
              note: this.state.note
            });
          }}
          customText="View Picture"
          style={styles.takePictureButton}
          textStyle={styles.takePictureButtonText}
        />
      ) : (
        <SimpleButton
          onPress={() => {
            this.blurInputs();
            this.props.navigator.push({
              name: 'camera',
              note: this.state.note
            });
          }}
          customText="Take Picture"
          style={styles.takePictureButton}
          textStyle={styles.takePictureButtonText}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref="title"
            autoFocus={true}
            autoCapitalize="sentences"
            placeholder="Untitled"
            style={[styles.textInput, styles.title]}
            onEndEditing={(text) => {this.refs.body.focus()}}
            underlineColorAndroid="transparent"
            value={this.state.note.title}
            onChangeText={(title) => this.updateNote(title, this.state.note.body)}
          />

          {pictureButton}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref="body"
            multiline={true}
            placeholder="Start typing"
            style={[styles.textInput, styles.body]}
            textAlignVertical="top"
            underlineColorAndroid="transparent"
            value={this.state.note.body}
            onChangeText={(body) => this.updateNote(this.state.note.title, body)}
          />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
    padding: 20
  },
  title: {
    height: 40
  },
  body: {
    height: 250
  },
  inputContainer: {
    borderBottomColor: '#9E7CE3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  takePictureButton: {
    backgroundColor: '#5B29C1',
    borderColor: '#48209A',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: 'darkgrey',
    shadowOffset: {
        width: 1,
        height: 1
    },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  takePictureButtonText: {
    color: 'white'
  }
});

module.exports = NoteScreen;

