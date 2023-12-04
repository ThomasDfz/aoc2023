const data = require('../parser')();
const lines = data.split('\n');

const cards = lines.map((card) => {
  const [winning, scratched] = card
    .split(':')[1]
    .split('|')
    .map(nbrs => nbrs.trim().split(' ').map(Number).filter(Boolean));

  return {
    value: scratched.filter(e => winning.includes(e)).length,
    count: 1,
  };
});

const points = cards.reduce((acc, card) => acc + Math.floor(2 ** (card.value - 1)), 0);

console.log(`1) ${points}`);

/**
 * Part 2
 */
for (let i = 0; i < cards.length; i += 1) {
  const { value, count } = cards[i];

  for (let j = i + 1; j <= Math.min(i + value, cards.length - 1); j += 1) {
    cards[j].count += count;
  }
}

const sum = cards.reduce((acc, card) => acc + card.count, 0);

console.log(`2) ${sum}`);
