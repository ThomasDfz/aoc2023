const data = require('../parser')();

let start = {};

const garden = data
  .split('\n')
  .map((line, x) => line
    .split('')
    .map((tile, y) => {
      if (tile === 'S') start = { x, y };

      return tile === '#' ? 1 : 0;
    }));

const height = garden.length;
const width = garden[0].length;

const canMoveUp = (x, y) => x > 0 && garden[x - 1][y] === 0;
const canMoveDown = (x, y) => x < height - 1 && garden[x + 1][y] === 0;
const canMoveLeft = (x, y) => y > 0 && garden[x][y - 1] === 0;
const canMoveRight = (x, y) => y < width - 1 && garden[x][y + 1] === 0;

const uniquify = (positions) => {
  const uniquePos = new Map();

  positions.forEach(position => {
    const key = `${position.x};${position.y}`;

    if (!uniquePos.has(key)) uniquePos.set(key, position);
  });

  return Array.from(uniquePos.values());
};

const move = (positions) => {
  const nextPositions = [];

  for (const { x, y } of positions) {
    if (canMoveUp(x, y)) nextPositions.push({ x: x - 1, y });
    if (canMoveDown(x, y)) nextPositions.push({ x: x + 1, y });
    if (canMoveLeft(x, y)) nextPositions.push({ x, y: y - 1 });
    if (canMoveRight(x, y)) nextPositions.push({ x, y: y + 1 });
  }

  return uniquify(nextPositions);
};

let positions = [start];

for (let i = 0; i < 64; i += 1) {
  positions = move(positions);
}

console.log('Part 1 : ', positions.length);
