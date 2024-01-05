const data = require('../parser')();

const instructions = data.split('\n');

let xmin = 0, xmax = 0, ymin = 0, ymax = 0;

instructions.reduce((acc, curr) => {
  const [direction, steps,] = curr.split(' ');

  if (direction === 'R') {
    acc.y += Number(steps);
  } else if (direction === 'D') {
    acc.x += Number(steps);
  } else if (direction === 'L') {
    acc.y -= Number(steps);
  } else if (direction === 'U') {
    acc.x -= Number(steps);
  }

  xmax = Math.max(xmax, acc.x);
  xmin = Math.min(xmin, acc.x);
  ymax = Math.max(ymax, acc.y);
  ymin = Math.min(ymin, acc.y);

  return acc;
}, { x: 0, y: 0 });

const height = xmax - xmin + 1;
const width = ymax - ymin + 1;

const terrain = Array.from({ length: height }, () => Array.from({ length: width }).fill(0));

let pos = { x: Math.abs(xmin), y: Math.abs(ymin) };

instructions.forEach(instruction => {
  const [direction, steps, _] = instruction.split(' ');

  let move;
  switch (direction) {
    case 'L':
      move = () => pos.y--;
      break;
    case 'R':
      move = () => pos.y++;
      break;
    case 'D':
      move = () => pos.x++;
      break;
    case 'U':
      move = () => pos.x--;
      break;
  }

  for (let i = 1; i <= steps; i += 1) {
    move();
    terrain[pos.x][pos.y] = 1;
  }
});

const fill = (xStart, yStart) => {
  const queue = [[xStart, yStart]];

  while (queue.length) {
    const [x, y] = queue.shift();

    if (terrain[x][y]) continue;

    terrain[x][y] = 1;

    if (x > 0 && terrain[x - 1][y] === 0) queue.push([x - 1, y]);
    if (x < height - 1 && terrain[x + 1][y] === 0) queue.push([x + 1, y]);
    if (y > 0 && terrain[x][y - 1] === 0) queue.push([x, y - 1]);
    if (y < width - 1 && terrain[x][y + 1] === 0) queue.push([x, y + 1]);
  }
};

fill(Math.abs(xmin) + 1, Math.abs(ymin) + 1);

const sum = terrain.reduce((accR, row) => accR + row.reduce((accC, curr) => accC + curr, 0), 0);

console.log('Part 1 : ', sum);

/**
 * Part 2
 */
const shoelaceFormula = (polygon) => {
  const { length } = polygon;

  const sum = polygon.reduce((acc, curr, i) => {
    return acc + (curr[0] * polygon[(i + 1) % length][1] - curr[1] * polygon[(i + 1) % length][0]);
  }, 0);

  return Math.abs(sum) * 0.5;
};

pos.x = 0;
pos.y = 0;

const polygon = [[pos.x, pos.y]];
let edgesLength = 0;

instructions.forEach(instruction => {
  const color = instruction.split(' ')[2].match(/\(#([0-9a-fA-F]{6})\)/)[1];
  const direction = Number(color[5]);
  const steps = parseInt(color.substring(0, color.length - 1), 16);

  switch (direction) {
    case 0:
      pos.y += steps;
      break;
    case 1:
      pos.x += steps;
      break;
    case 2:
      pos.y -= steps;
      break;
    case 3:
      pos.x -= steps;
      break;
  }

  polygon.push([pos.x, pos.y]);
  edgesLength += steps;
});

const area = shoelaceFormula(polygon);

// Pick's theorem
const interior = area + 1 - 0.5 * edgesLength;

console.log('Part 2 : ', interior + edgesLength);
