'use strict'

var React = require('react-native');
var {
  MapView,
  StyleSheet
} = React;

var _ = require('underscore');

class NoteLocationScreen extends React.Component {
  render () {
    var locations = _.values(this.props.notes).map((note) => {
      return {
        latitude: note.location.coords.latitude,
        longitude: note.location.coords.longitude,
        hasLeftCallout: true,
        onLeftCalloutPress: this.props.onSelectNote.bind(this, note),
        title: note.title
      };
    });

    return (
      <MapView
        annotations={locations}
        showsUserLocation={true}
        style={styles.map}
      />
    );
  }
}

var styles = StyleSheet.create({
  map: {
    flex: 1,
    marginTop: 64
  }
});

module.exports = NoteLocationScreen;

