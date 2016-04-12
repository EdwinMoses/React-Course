'use strict'

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var Camera = require('react-native-camera');
var SimpleButton = require('./SimpleButton');

class CameraScreen extends React.Component {
  _takePicture () {
    this.refs.cam.capture((err, data) => {
      if (err) return;
      this.props.navigator.pop();
      this.props.onPicture(data);
    });
  }

  render () {
    return (
      <Camera
        aspect={Camera.constants.Aspect.fill}
        captureTarget={Camera.constants.CaptureTarget.disk}
        ref="cam"
        style={styles.container}
        type={Camera.constants.Type.back}
      >
        <View style={styles.cameraButtonContainer}>
          <SimpleButton
            onPress={this._takePicture.bind(this)}
            customText="Capture"
            style={styles.cameraButton}
            textStyle={styles.cameraButtonText}
          />
        </View>
      </Camera>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  },
  cameraButton: {
    backgroundColor: '#5B29C1',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  cameraButtonText: {
    color: 'white',
    textAlign: 'center'
  }
});

module.exports = CameraScreen;

