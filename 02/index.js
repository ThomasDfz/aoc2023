const data = require('../parser')();
const lines = data.split('\n');
const games = [];

lines.forEach(line => {
  games.push(line.split(': ')[1].split('; ').map(set => set.split(', ')));
});

const isValid = (game) => {
  for (const set of game) {
    for (const drawing of set) {
      const [number, color] = drawing.split(' ');

      if ((color === 'red' && Number(number) > 12)
        || (color === 'blue' && Number(number) > 14)
        || (color === 'green' && Number(number) > 13))
        return false;
    }
  }

  return true;
};

const total = games.reduce((sum, game, i) => sum + (isValid(game) ? (i + 1) : 0), 0);

console.log(`1) ${total}`);


/**
 * Part 2
 */
const getGamePower = (game) => {
  let mins = {
    blue: 0,
    red: 0,
    green: 0,
  };

  for (const set of game) {
    for (const drawing of set) {
      const [number, color] = drawing.split(' ');
      if (color === 'blue' && Number(number) > mins.blue) mins.blue = Number(number);
      if (color === 'red' && Number(number) > mins.red) mins.red = Number(number);
      if (color === 'green' && Number(number) > mins.green) mins.green = Number(number);
    }
  }

  return mins.blue * mins.red * mins.green;
};

const powers = games.reduce((sum, game) => sum + getGamePower(game), 0);

console.log(`2) ${powers}`);
