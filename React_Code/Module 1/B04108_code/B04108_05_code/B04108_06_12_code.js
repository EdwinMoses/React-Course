var calculated_fibonacci_numbers = [];

function fibonacci_memoized(n) {
  if (calculated_fibonacci_numbers.length > n) {
    return calculated_fibonacci_numbers[n];
  } else {
    if (n === 0 || n === 1) {
      result = 1;
    } else {
      result = (fibonacci_memoized(n – 2) +
        fibonacci_memoized(n – 1));
    }
    calculated_fibonacci_numbers[n] = result;
    return result;
  }
