const data = require('../parser')();

const [times, records] = data
  .split('\n')
  .map(line => line.split(':')[1].split(' ').map(Number).filter(Boolean));

const countWaysToBeat = (time, record) => {
  let waysToBeat = 0;

  for (let j = 1; j < time; j += 1) {
    if (j * (time - j) > record) {
      waysToBeat++;
    }
  }

  return waysToBeat;
};

/**
 * Part 1
 */
const product = times.reduce((acc, time, i) => acc *= countWaysToBeat(time, records[i]), 1);

console.log(`1) ${product}`);

/**
 * Part 2
 */
const time = Number(times.join(''));
const record = Number(records.join(''));

console.log(`2) ${countWaysToBeat(time, record)}`);
