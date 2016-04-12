var counter = 0;
for(var field in obj) {
  if (obj.hasOwnProperty(field)) {
    counter += 1;
  }
}
