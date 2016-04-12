onKeyDown: function(eventObject) {
  this.onKeyPress(eventObject);
},
onKeyPress: function(eventObject) {
  if (eventObject.which === 37 || eventObject.which === 38) {
    keystrokes.push('u');
  } else if (eventObject.which === 39 ||
    eventObject.which === 40) {
    keystrokes.push('d');
  } else if (eventObject.which === 32) {
    keystrokes.push('s');
  }
},
