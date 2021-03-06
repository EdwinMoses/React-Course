'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
  StatusBarIOS,
  StyleSheet,
  Text,
  AsyncStorage
} = React;

var SimpleButton = require('./App/Components/SimpleButton');
var NoteScreen = require('./App/Components/NoteScreen');
var HomeScreen = require('./App/Components/HomeScreen');
var NoteLocationScreen = require('./App/Components/NoteLocationScreen');
var CameraScreen = require('./App/Components/CameraScreen');
var NoteImageScreen = require('./App/Components/NoteImageScreen');

var _ = require('underscore');

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'home':
        return (
          <SimpleButton
            onPress={() => navigator.push({name: 'noteLocations'})}
            customText='Map'
            style={styles.navBarLeftButton}
            textStyle={styles.navBarButtonText}
           />
        );
      case 'createNote':
      case 'noteLocations':
      case 'camera':
      case 'noteImage':
        return (
          <SimpleButton
            onPress={() => navigator.pop()}
            customText='Back'
            style={styles.navBarLeftButton}
            textStyle={styles.navBarButtonText}
           />
        );
      default:
        return null;
    }
  },

  RightButton: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'home':
        return (
          <SimpleButton
            onPress={() => {
              navigator.push({
                name: 'createNote',
                note: {
                  id: new Date().getTime(),
                  title: '',
                  body: '',
                  isSaved: false
                }
              });
            }}
            customText='Create Note'
            style={styles.navBarRightButton}
            textStyle={styles.navBarButtonText}
          />
        );
      case 'createNote':
        if (route.note.isSaved) {
          return (
            <SimpleButton
              onPress={() => {
                navigator.props.onDeleteNote(route.note);
                navigator.pop();
              }}
              customText='Delete'
              style={styles.navBarRightButton}
              textStyle={styles.navBarButtonText}
            />
          );
        } else {
          return null;
        }
      case 'noteImage':
        return (
          <SimpleButton
            onPress={() => {
              navigator.props.onDeleteNoteImage(route.note);
              navigator.pop();
            }}
            customText='Delete'
            style={styles.navBarRightButton}
            textStyle={styles.navBarButtonText}
          />
        );
      default:
         return null;
    }
  },

  Title: function(route, navigator, index, navState) {
    switch (route.name) {
      case 'home':
        return (
          <Text style={styles.navBarTitleText}>React Notes</Text>
        );
      case 'createNote':
        return (
          <Text style={styles.navBarTitleText}>{route.note ? route.note.title : 'Create Note'}</Text>
        );
      case 'noteLocations':
        return (
          <Text style={styles.navBarTitleText}>Note Locations</Text>
        );
      case 'camera':
        return (
          <Text style={styles.navBarTitleText}>Take Picture</Text>
        );
      case 'noteImage':
        return (
          <Text style={styles.navBarTitleText}>{`Image: ${route.note.title}`}</Text>
        );
    }
  }
};

class ReactNotes extends React.Component {
  constructor (props) {
    super(props);
    StatusBarIOS.setStyle('light-content');

    this.state = {
      notes: {
        1: {
          title: "Note 1",
          body: "body",
          id: 1,
          location: {
            coords: {
              latitude: 33.987,
              longitude: -118.47
            }
          }
        },
        2: {
          title: "Note 2",
          body: "body",
          id: 2,
          location: {
            coords: {
              latitude: 33.986,
              longitude: -118.46
            }
          }
        }
      }
    };

    this.loadNotes();
    this.trackLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  trackLocation() {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this.setState({initialPosition}),
      (error) => console.log(error.message)
    );

    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  }

  updateNote(note) {
    var newNotes = Object.assign({}, this.state.notes);

    if (!note.isSaved) {
      note.location = this.state.lastPosition;
    }

    note.isSaved = true;
    newNotes[note.id] = note;
    this.setState({notes:newNotes});
    this.saveNotes(newNotes);
  }

  deleteNote(note) {
    var newNotes = Object.assign({}, this.state.notes);
    delete newNotes[note.id];
    this.setState({notes:newNotes});
    this.saveNotes(newNotes);
  }

  async loadNotes() {
    try {
      var notes = await AsyncStorage.getItem("@ReactNotes:notes");

      if (notes !== null) {
        this.setState({notes:JSON.parse(notes)})
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  async saveNotes(notes) {
    try {
      await AsyncStorage.setItem("@ReactNotes:notes", JSON.stringify(notes));
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  deleteNoteImage (note) {
    note.imagePath = null;
    this.updateNote(note);
  }

  saveNoteImage(imagePath, note) {
    note.imagePath = imagePath;
    this.updateNote(note);
  }

  renderScene(route, navigator) {
    switch (route.name) {
      case 'home':
        return (
          <HomeScreen navigator={navigator} notes={_(this.state.notes).toArray()} onSelectNote={(note) => navigator.push({name:"createNote", note: note})} />
        );
      case 'createNote':
        return (
          <NoteScreen navigator={navigator} note={route.note} onChangeNote={(note) => this.updateNote(note)} showCameraButton={true} />
        );
      case 'noteLocations':
        return (
          <NoteLocationScreen notes={this.state.notes} onSelectNote={(note) => navigator.push({name:"createNote", note: note})} />
        );
      case 'camera':
        return (
          <CameraScreen navigator={navigator} onPicture={(imagePath) => this.saveNoteImage(imagePath, route.note)} />
        );
      case 'noteImage':
        return (
          <NoteImageScreen note={route.note} />
        );
    }
  }

  render () {
    return (
      <Navigator
        initialRoute={{name: 'home'}}
        renderScene={this.renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
        onDeleteNote={(note) => this.deleteNote(note)}
        onDeleteNoteImage={(note) => this.deleteNoteImage(note)}
      />
    );
  }
}

var styles = StyleSheet.create({
    navBar: {
      backgroundColor: '#5B29C1',
      borderBottomColor: '#48209A',
      borderBottomWidth: 1
    },
    navBarTitleText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
      marginVertical: 9
    },
    navBarLeftButton: {
      paddingLeft: 10
    },
    navBarRightButton: {
      paddingRight: 10
    },
    navBarButtonText: {
      color: '#EEE',
      fontSize: 16,
      marginVertical: 10
    }
});

AppRegistry.registerComponent('ReactNotes', () => ReactNotes);

