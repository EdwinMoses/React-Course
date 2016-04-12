function* fibonacci_generator() {
  var first = 0;
  var second = 1;
  var sum;
  yield second;
  while (true) {
    sum = first + second;
    yield sum;
    first = second;
    second = sum;
  }
}
