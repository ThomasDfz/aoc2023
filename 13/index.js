const data = require('../parser')();

const rowToInt = row => parseInt(row.replaceAll('#', '1').replaceAll('.', '0'), 2);

const grids = data
  .split('\n\n')
  .map(grid => grid.split('\n'))
  .map(grid => {
    const cols = [];

    for (let c = 0; c < grid[0].length; c += 1) {
      cols.push(rowToInt(grid.map(g => g[c]).join('')));
    }

    return { rows: grid.map(rowToInt), cols, rowsRange: grid[0].length, colsRange: grid.length };
  });

// gets index of mirror position if any - previous is used for p2 to prevent returning twice the same mirror
const getMirrorIndex = (array, previous = -1) => {
  outer: for (let i = 1; i < array.length; i += 1) {
    for (let x = 1; x <= Math.min(i, array.length - i); x += 1) {
      if (array[i - x] !== array[i + x - 1]) {
        continue outer;
      }
    }

    if (i !== previous) return i;
  }

  return -1;
};

/**
 * Part 1
 */
let sum = grids.reduce((acc, curr) => {
  const horizontalMirrorIndex = getMirrorIndex(curr.rows);

  if (horizontalMirrorIndex !== -1) {
    curr.direction = 'h';
    curr.index = horizontalMirrorIndex;

    return acc + horizontalMirrorIndex * 100;
  }

  const verticalMirrorIndex = getMirrorIndex(curr.cols);
  curr.direction = 'v';
  curr.index = verticalMirrorIndex;

  return acc + verticalMirrorIndex;
}, 0);

console.log('1) ', sum);

/**
 * Part 2
 */
const flipEachBit = (n, range) => {
  const flipped = [];

  for (let i = 0; i < range; i += 1) {
    flipped.push(n ^ (1 << i));
  }

  return flipped;
};

sum = grids.reduce((acc, curr) => {
  for (let i = 0; i < curr.rows.length; i += 1) {
    const smudges = flipEachBit(curr.rows[i], curr.rowsRange);

    for (let j = 0; j < smudges.length; j += 1) {
      const fixed = [...curr.rows];
      fixed[i] = smudges[j];

      const horizontalMirrorIndex = getMirrorIndex(fixed, curr.direction === 'h' ? curr.index : undefined);

      if (horizontalMirrorIndex !== -1) {
        return acc + horizontalMirrorIndex * 100;
      }
    }
  }

  for (let i = 0; i < curr.cols.length; i += 1) {
    const smudges = flipEachBit(curr.cols[i], curr.colsRange);

    for (let j = 0; j < smudges.length; j += 1) {
      const fixed = [...curr.cols];
      fixed[i] = smudges[j];

      const verticalMirrorIndex = getMirrorIndex(fixed, curr.direction === 'v' ? curr.index : undefined);

      if (verticalMirrorIndex !== -1) {
        return acc + verticalMirrorIndex;
      }
    }
  }

  return acc;
}, 0);

console.log('2) ', sum);
