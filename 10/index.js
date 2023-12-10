const data = require('../parser')();
let currentX = 0, currentY = 0;

const map = data
  .split('\n')
  .map((line, i) => {
    if (line.includes('S')) {
      currentX = i;
      currentY = line.indexOf('S');
    }

    return line.split('');
  });

const asCoord = (x, y) => `${x};${y}`;

const isConnected = (tile1, tile2, direction) => {
  switch (direction) {
    case 'up':
      return ['|', 'L', 'J', 'S'].includes(tile1) && ['|', '7', 'F', 'S'].includes(tile2);
    case 'down':
      return ['|', '7', 'F', 'S'].includes(tile1) && ['|', 'L', 'J', 'S'].includes(tile2);
    case 'right':
      return ['-', 'L', 'F', 'S'].includes(tile1) && ['-', 'J', '7', 'S'].includes(tile2);
    case 'left':
      return ['-', 'J', '7', 'S'].includes(tile1) && ['-', 'L', 'F', 'S'].includes(tile2);
    default:
      return false;
  }
};

const loop = new Set();
let canMove = true;

const canMoveUp = (x, y) => (x > 0 && isConnected(map[x][y], map[x - 1][y], 'up') && !loop.has(asCoord(x - 1, y)));

const canMoveRight = (x, y) => (y < map[0].length - 1 && isConnected(map[x][y], map[x][y + 1], 'right') && !loop.has(asCoord(x, y + 1)));

const canMoveDown = (x, y) => (x < map.length - 1 && isConnected(map[x][y], map[x + 1][y], 'down') && !loop.has(asCoord(x + 1, y)));

const canMoveLeft = (x, y) => (y > 0 && isConnected(map[x][y], map[x][y - 1], 'left') && !loop.has(asCoord(x, y - 1)));

do {
  loop.add(asCoord(currentX, currentY));

  if (canMoveUp(currentX, currentY)) {
    currentX -= 1;
  } else if (canMoveRight(currentX, currentY)) {
    currentY += 1;
  } else if (canMoveDown(currentX, currentY)) {
    currentX += 1;
  } else if (canMoveLeft(currentX, currentY)) {
    currentY -= 1;
  } else {
    canMove = false;
  }
} while (canMove);

console.log(Math.ceil(loop.size / 2));


// TODO :  get bounds of loop instead of map bounds ???

const isInside = (x, y) => {
  let ups = [], down = [], right = [], left = [];
  for (let i = 0; i < x; i += 1) {
    if (loop.has(asCoord(i, y))) {
      ups.push({ x: i, y });
    }
  }
  for (let i = x + 1; i < map.length; i += 1) {
    if (loop.has(asCoord(i, y))) {
      down.push({ x: i, y });
    }
  }
  for (let j = 0; j < y; j += 1) {
    if (loop.has(asCoord(x, j))) {
      left.push({ x, y: j });
    }
  }
  for (let j = y + 1; j < map[0].length; j += 1) {
    if (loop.has(asCoord(x, j))) {
      right.push({ x, y: j });
    }
  }
  if (
    ups.length % 2 === 1
    && down.length % 2 === 1
    && left.length % 2 === 1
    && down.length % 2 === 1
  ) {
    console.log(x, y, 'is inside');
    return true;
  } else {
    return false;
  }
};

let count = 0;

for (let x = 0; x < map.length; x += 1) {
  for (let y = 0; y < map[x].length; y += 1) {
    if (!loop.has(asCoord(x, y)) && isInside(x, y)) {
      count ++;
    }
  }
}
console.log(count);
