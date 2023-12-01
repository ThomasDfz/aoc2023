const data = require('../parser')();
const lines = data.split('\n');

let sum = 0;

lines.forEach(line => {
  const digits = line
    .split('')
    .filter(char => !isNaN(char))
    .map(Number);

  sum += (digits[0] * 10 + digits[digits.length - 1]);
});

console.log(`1) ${sum}`);

sum = 0;

lines.forEach(line => {
  // replace all numbers by their digits without breaking overlap (oneight => 1eight => 18)
  const digits = line
    .replaceAll('one', 'o1e')
    .replaceAll('two', 't2')
    .replaceAll('three', 't3e')
    .replaceAll('four', '4')
    .replaceAll('five', '5e')
    .replaceAll('six', '6')
    .replaceAll('seven', '7n')
    .replaceAll('eight', 'e8')
    .replaceAll('nine', '9')
    .split('')
    .filter(char => !isNaN(char))
    .map(Number);

  sum += (digits[0] * 10 + digits[digits.length - 1]);
});

console.log(`2) ${sum}`);
