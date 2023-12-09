const data = require('../parser')();

const histories = data
  .split('\n')
  .map(history => history.split(' ').map(Number));

const getHistoryNextValue = history => {
  let current = history;
  let sum = current[current.length - 1];

  while ((new Set(current)).size !== 1) {
    current = current.reduce((acc, curr, i) => {
      if (i < current.length - 1) acc.push(current[i + 1] - current[i]);

      return acc;
    }, []);

    sum += current[current.length - 1];
  }

  return sum;
};

let sum = histories.reduce((acc, history) => acc += getHistoryNextValue(history), 0);

console.log(`1) ${sum}`);

/**
 * Part 2
 */
sum = histories.reduce((acc, history) => acc += getHistoryNextValue(history.reverse), 0);

console.log(`2) ${sum}`);
