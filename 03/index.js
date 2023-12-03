const data = require('../parser')();
const lines = data.split('\n');

const markedPositions = new Set();

const coord = (x, y) => `${x};${y}`;

const markPositionsAround = (x, y) => {
  for (let i = Math.max(0, x - 1); i <= Math.min(lines.length - 1, x + 1); i += 1) {
    for (let j = Math.max(0, y - 1); j <= Math.min(lines[0].length - 1, y + 1); j += 1) {
      markedPositions.add(coord(i, j));
    }
  }
};

lines.forEach((line, x) => {
  line.split('').forEach((char, y) => {
    if (char !== '.' && isNaN(char)) {
      markPositionsAround(x, y);
    }
  });
});

const regex = /\d+/g;

const sum = lines.reduce((acc, line, x) => {
  Array.from(line.matchAll(regex), match => {
    const atLeastOnePositionIsMarked = match[0]
      .split('')
      .some((_, y) => markedPositions.has(coord(x, y + match.index)));

    if (atLeastOnePositionIsMarked) {
      acc += Number(match[0]);
    }
  });

  return acc;
}, 0);

console.log(`1) ${sum}`);

/**
 * Part 2
 */
const markedPositionsAroundGear = new Map();
const gears = {};

const markPositionsAroundGear = (x, y) => {
  gears[coord(x, y)] = {
    ratio: 1,
    adjacents: 0,
  };

  for (let i = Math.max(0, x - 1); i <= Math.min(lines.length - 1, x + 1); i += 1) {
    for (let j = Math.max(0, y - 1); j <= Math.min(lines[0].length - 1, y + 1); j += 1) {
      if (markedPositionsAroundGear.has(coord(i, j))) {
        markedPositionsAroundGear.set(coord(i, j), markedPositionsAroundGear.get(coord(i, j)).push(coord(x, y)));
      } else {
        markedPositionsAroundGear.set(coord(i, j), [coord(x, y)]);
      }
    }
  }
};

lines.forEach((line, x) => {
  line.split('').forEach((char, y) => {
    if (char === '*') {
      markPositionsAroundGear(x, y);
    }
  });
});

lines.forEach((line, x) => {
  Array.from(line.matchAll(regex), match => {
    const adjacentGears = new Set();

    match[0].split('').forEach((_, y) => {
      if (markedPositionsAroundGear.has(coord(x, y + match.index))) {
        markedPositionsAroundGear
          .get(coord(x, y + match.index))
          .forEach(gearCoords => adjacentGears.add(gearCoords));
      }
    });

    adjacentGears.forEach((gearCoord) => {
      gears[gearCoord].ratio *= match[0];
      gears[gearCoord].adjacents += 1;
    });
  });
});

const total = Object.values(gears).reduce((acc, gear) => acc += (gear.adjacents === 2) ? gear.ratio : 0, 0);

console.log(`2) ${total}`);
