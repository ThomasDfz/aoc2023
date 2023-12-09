const data = require('../parser')();

const histories = data
  .split('\n')
  .map(history => history.split(' ').map(Number));

const getHistoryNextValue = history => {
  let current = history;
  const sequences = [history];

  while ((new Set(current)).size !== 1) {
    const newSequence = [];

    for (let i = 1; i < current.length; i += 1) {
      newSequence.push(current[i] - current[i - 1]);
    }

    sequences.push(newSequence);
    current = newSequence;
  }

  return sequences.reduce((acc, sequence) => acc += sequence[sequence.length - 1], 0);
};

let sum = histories.reduce((acc, history) => acc += getHistoryNextValue(history), 0);

console.log(`1) ${sum}`);

/**
 * Part 2
 */
const reversedHistories = histories.map(history => history.reverse());

sum = reversedHistories.reduce((acc, history) => acc += getHistoryNextValue(history), 0);

console.log(`2) ${sum}`);
