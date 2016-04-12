function fibonacci_recursive(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return (fibonacci_recursive(n – 2) +
      fibonacci_recursive(n – 1));
  }
}
