var outer = function() {
  var a = 1;
  var inner = function() {
    var b = 2;
    return a + b;
  }
  return inner;
}
var result = outer();
