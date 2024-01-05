const data = require('../parser')();
const MinHeap = require('../min-heap');
const { range } = require('../utils');

const lines = data.split('\n');
const height = lines.length;
const width = lines[0].length;

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';

const asKey = (x, y, d) => x + ';' + y + ';' + d;

const buildDirections = (max) => ([
  ...range(1, max).map(i => LEFT.repeat(i)),
  ...range(1, max).map(i => RIGHT.repeat(i)),
  ...range(1, max).map(i => UP.repeat(i)),
  ...range(1, max).map(i => DOWN.repeat(i)),
]);

const buildNodes = (x, y, heatLoss, map, directions) => {
  directions.forEach(dir => {
    map.set(
      asKey(x, y, dir),
      {
        x,
        y,
        dir,
        heatLoss,
        dist: Number.MAX_SAFE_INTEGER,
        visited: false,
      });
  });
};

const buildGraph = (map, directions) => lines
  .map((row, x) => {
    const heatLosses = row
      .split('')
      .map(Number);

    heatLosses.forEach((heatLoss, y) => buildNodes(x, y, heatLoss, map, directions));

    return heatLosses;
  });

const canMoveUp = (node, min, max) => {
  return node.x > 0 && node.dir !== UP.repeat(max) && !node.dir.includes(DOWN) && (node.dir.includes(UP) || node.dir.length >= min);
};
const canMoveDown = (node, min, max) => {
  return node.x < height - 1 && node.dir !== DOWN.repeat(max) && !node.dir.includes(UP) && (node.origin || node.dir.includes(DOWN) || node.dir.length >= min);
};
const canMoveLeft = (node, min, max) => {
  return node.y > 0 && node.dir !== LEFT.repeat(max) && !node.dir.includes(RIGHT) && (node.dir.includes(LEFT) || node.dir.length >= min);
};
const canMoveRight = (node, min, max) => {
  return node.y < width - 1 && node.dir !== RIGHT.repeat(max) && !node.dir.includes(LEFT) && (node.origin || node.dir.includes(RIGHT) || node.dir.length >= min);
};

const getAvailableNeighbours = (node, map, min, max) => {
  const { x, y, dir } = node;
  const neighbours = [];

  canMoveUp(node, min, max) && neighbours.push(map.get(asKey(x - 1, y, dir.includes(UP) ? dir + UP : UP)));
  canMoveDown(node, min, max) && neighbours.push(map.get(asKey(x + 1, y, dir.includes(DOWN) ? dir + DOWN : DOWN)));
  canMoveLeft(node, min, max) && neighbours.push(map.get(asKey(x, y - 1, dir.includes(LEFT) ? dir + LEFT : LEFT)));
  canMoveRight(node, min, max) && neighbours.push(map.get(asKey(x, y + 1, dir.includes(RIGHT) ? dir + RIGHT : RIGHT)));

  return neighbours.filter(n => !n.visited);
};

const findLeastHeatLoss = (minMoves, maxMoves) => {
  const nodeMap = new Map();
  const directions = buildDirections(maxMoves);
  const graph = buildGraph(nodeMap, directions);

  const queue = new MinHeap('dist');
  queue.push({
    x: 0,
    y: 0,
    dir: '',
    heatLoss: graph[0][0],
    dist: 0,
    visited: false,
    origin: true,
  });

  let current;

  while (!queue.isEmpty()) {
    current = queue.pop();
    current.visited = true;

    if (current.x === height - 1 && current.y === width - 1) break;

    getAvailableNeighbours(current, nodeMap, minMoves, maxMoves).forEach(neighbour => {
      const newDist = current.dist + neighbour.heatLoss;

      if (newDist < neighbour.dist) {
        neighbour.dist = newDist;
        queue.push(neighbour);
      }
    });
  }

  return current.dist;
};

console.log('Part 1 : ' + findLeastHeatLoss(1, 3));
console.log('Part 2 : ' + findLeastHeatLoss(4, 10));
