const data = require('../parser')();
const { asCoords } = require('../utils');

const map = data
  .split('\n')
  .map(line => line.split(''));

const neighboursMap = new Map();
const queue = [];
let endY;

const buildNeighbourMap = (x, y) => {
  let neighbours = [];

  switch (map[x][y]) {
    case '#':
      return;
    case '.':
      neighbours = [[x - 1, y], [x, y + 1], [x + 1, y], [x, y - 1]];
      break;
    case '^':
      neighbours = [[x - 1, y]];
      break;
    case 'v':
      neighbours = [[x + 1, y]];
      break;
    case '>':
      neighbours = [[x, y + 1]];
      break;
    case '<':
      neighbours = [[x, y - 1]];
      break;
  }

  neighbours = neighbours.filter(([x, y]) => map[x]?.[y] !== undefined && map[x]?.[y] !== '#');

  neighboursMap.set(asCoords(x, y), neighbours);
};

map.forEach((line, x) => {
  line.forEach((tile, y) => {
    buildNeighbourMap(x, y);

    if (x === 0 && tile === '.') {
      queue.push({ x, y, prev: [] });
    }

    if (x === map.length - 1 && tile === '.') {
      endY = y;
    }
  });
});

let current;
let min = Number.MAX_SAFE_INTEGER;

while (queue.length) {
  current = queue.pop();

  if (current.x === map.length - 1 && current.y === endY) {
    min = Math.min(min, -1 * current.prev.length);
  }

  neighboursMap.get(asCoords(current.x, current.y)).forEach(([x, y]) => {
    if (!current.prev.some(el => el.x === x && el.y === y)) {
      queue.push({
        x,
        y,
        prev: [...current.prev, { x, y }],
      });
    }
  });
}

console.log('Part 1 : ', -1 * min);
