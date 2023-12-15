const data = require('../parser')();
const sequence = data.split(',');

const hash = str => str
  .split('')
  .reduce((acc, curr) => {
    acc += curr.charCodeAt(0);
    acc *= 17;
    acc %= 256;

    return acc;
  }, 0);


console.log('Part 1) ', sequence.reduce((acc, curr) => acc + hash(curr), 0));

/**
 * Part 2
 */
const boxes = new Map();

sequence.forEach(instruction => {
  if (instruction.includes('=')) {
    const [label, focal] = instruction.split('=');

    const boxHash = hash(label);

    if (!boxes.has(boxHash)) boxes.set(boxHash, []);

    const box = boxes.get(boxHash);

    if (box.some(lense => lense.label === label)) {
      const lense = box.find(lense => lense.label === label);
      lense.focal = focal;
    } else {
      box.push({ label, focal });
    }
  } else if (instruction.includes('-')) {
    const label = instruction.slice(0, -1);

    const boxHash = hash(label);

    if (!boxes.has(boxHash)) boxes.set(boxHash, []);

    boxes.set(boxHash, boxes.get(boxHash).filter(lense => lense.label !== label));
  }
});

let sum = 0;

boxes.forEach((lenses, box) => {
  sum += lenses.reduce((acc, curr, i) => acc + ((box + 1) * (i + 1) * curr.focal), 0);
});

console.log('Part 2) ', sum);
