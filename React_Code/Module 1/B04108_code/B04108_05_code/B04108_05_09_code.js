function* powers_of_two_generator() {
  var power = 1;
  while (true) {
    yield power;
    power *= 2;
  }
}
