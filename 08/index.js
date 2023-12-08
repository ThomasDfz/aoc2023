const data = require('../parser')();
const [instructions, network] = data.split('\n\n');
const sequence = instructions.split('');
const networkMap = new Map();
const APaths = [];

network.split('\n').forEach(node => {
  const [source, left, right] = Array.from(node.matchAll(/[A-Z]{3}/g)).map(match => match[0]);

  networkMap.set(`${source}L`, left);
  networkMap.set(`${source}R`, right);

  if (source.endsWith('A')) {
    APaths.push(source);
  }
});

const countSteps = (from, to) => {
  let current = from, i = 0, count = 0;

  while (!current.endsWith(to)) {
    current = networkMap.get(`${current}${sequence[i]}`);
    i++;
    count++;
    if (i === sequence.length) i = 0;
  }

  return count;
};

console.log(`1) ${countSteps('AAA', 'ZZZ')}`);

/**
 * Part 2
 */
const steps = APaths.map(path => countSteps(path, 'Z'));

console.log('2) use wolframalpha\'s LCM function on those numbers', steps);
