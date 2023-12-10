const data = require('../parser')();
let currentX = 0, currentY = 0, maxX = 0, maxY = 0, minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;

const map = data
  .split('\n')
  .map((line, i) => {
    if (line.includes('S')) {
      currentX = i;
      currentY = line.indexOf('S');
    }

    return line.split('');
  });

// string utils for Set & Map keys
const asCoord = (x, y) => `${x};${y}`;
const asPath = (fromX, fromY, toX, toY) => `${asCoord(fromX, fromY)}->${asCoord(toX, toY)}`;
const asVector = (v) => `${v.x};${v.y};${v.direction}`;

// returns true if tile1 & tile2 are connected depending on the direction, false otherwise
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

const paths = new Set(); // store paths for p2

const startX = currentX;
const startY = currentY;

/**
 * Part 1
 */
do {
  loop.add(asCoord(currentX, currentY));
  minX = Math.min(minX, currentX);
  maxX = Math.max(maxX, currentX);
  minY = Math.min(minY, currentY);
  maxY = Math.max(maxY, currentY);


  if (canMoveUp(currentX, currentY)) {
    paths.add(asPath(currentX, currentY, currentX - 1, currentY));
    currentX -= 1;
  } else if (canMoveRight(currentX, currentY)) {
    paths.add(asPath(currentX, currentY, currentX, currentY + 1));
    currentY += 1;
  } else if (canMoveDown(currentX, currentY)) {
    paths.add(asPath(currentX, currentY, currentX + 1, currentY));
    currentX += 1;
  } else if (canMoveLeft(currentX, currentY)) {
    paths.add(asPath(currentX, currentY, currentX, currentY - 1));
    currentY -= 1;
  } else {
    paths.add(asPath(currentX, currentY, startX, startY));
    paths.add(`${asCoord(currentX, currentY)}->${asCoord(startX, startY)}`);
    canMove = false;
  }
} while (canMove);

console.log('Part 1', Math.ceil(loop.size / 2));

/**
 * Part 2
 */
const candidates = [];
const valids = [];

for (let i = minX; i <= maxX; i += 1) {
  for (let j = minY; j < maxY; j += 1) {
    if (!loop.has(asCoord(i, j))) {
      candidates.push({ x: i, y: j, direction: 'down' });
    }
  }
}

const marked = new Set();

// returns true if the vectors intersects with the loop, false otherwise
const doesIntersect = (v) => {
  if (v.direction === 'down') {
    return paths.has(asPath(v.x, v.y - 1, v.x, v.y)) || paths.has(asPath(v.x, v.y, v.x, v.y - 1));
  }
  if (v.direction === 'right') {
    return paths.has(asPath(v.x - 1, v.y, v.x, v.y)) || paths.has(asPath(v.x, v.y, v.x - 1, v.y));
  }
};

const getVectorNeighbours = (v) => {
  let neighbours = [];

  if (v.direction === 'right') {
    neighbours = [
      { x: v.x, y: v.y - 1, direction: 'right' },
      { x: v.x, y: v.y + 1, direction: 'right' },
      { x: v.x, y: v.y, direction: 'down' },
      { x: v.x - 1, y: v.y, direction: 'down' },
      { x: v.x - 1, y: v.y + 1, direction: 'down' },
      { x: v.x, y: v.y + 1, direction: 'down' },
    ];
  } else if (v.direction === 'down') {
    neighbours = [
      { x: v.x, y: v.y, direction: 'right' },
      { x: v.x - 1, y: v.y, direction: 'down' },
      { x: v.x, y: v.y - 1, direction: 'right' },
      { x: v.x + 1, y: v.y - 1, direction: 'right' },
      { x: v.x + 1, y: v.y, direction: 'down' },
      { x: v.x + 1, y: v.y, direction: 'right' },
    ];
  }

  return neighbours
    .filter(v => !marked.has(asVector(v)))
    .filter(n => !doesIntersect(n));
};

const atLeastOneEdgeVector = (vectors) => {
  return vectors.some(n => {
    if (n.direction === 'down') {
      return (n.x === 0 || n.x === map.length - 1);
    }
    if (n.direction === 'right') {
      return (n.y === 0 || n.y === map[0].length - 1);
    }
  });
};

const isVectorInside = (vector) => {
  marked.add(asVector(vector));

  const neighbours = getVectorNeighbours(vector);

  if (!neighbours.length) {
    return true;
  }

  neighbours.forEach(n => marked.add(asVector(n)));

  if (atLeastOneEdgeVector(neighbours)) {
    return false;
  }

  return neighbours.every(isVectorInside);
};

candidates.forEach(candidate => {
  marked.clear();

  if (isVectorInside(candidate)) {
    valids.push(candidate);
  }
});

console.log(`Part 2 : ${valids.length}`);
