const data = require('../parser')();

const platform = data
  .split('\n')
  .map(line => line.split(''));

platform.count = () => platform.reduce((acc, curr, i) => acc + (curr.filter(el => el === 'O').length * (platform.length - i)), 0);

const slideLeft = (row) => {
  let emptySpots = [];

  for (let i = 0;  i < row.length;  i += 1) {
    switch (row[i]) {
      case '.':
        emptySpots.push(i);
        break;
      case '#':
        emptySpots = [];
        break;
      case 'O':
        if (emptySpots.length) {
          row[emptySpots.shift()] = 'O';
          row[i] = '.';
          emptySpots.push(i);
        }
        break;
      default:
        console.error(row);
    }
  }

  return row;
};

const slideRight = (row) => slideLeft(row.reverse()).reverse();

const moveVertical = (slider) => {
  for (let y = 0; y < platform[0].length; y += 1) {
    const sortedColumn = slider(platform.map(p => p[y]));

    for (let x = 0; x < platform.length; x += 1) {
      platform[x][y] = sortedColumn[x];
    }
  }
};

const moveHorizontal = (slider) => {
  for (let x = 0; x < platform.length; x += 1) {
    const sortedRow = slider(platform[x]);

    for (let y = 0; y < platform[0].length; y += 1) {
      platform[x][y] = sortedRow[y];
    }
  }
};

moveVertical(slideLeft);

console.log('Part 1 : ', platform.count());

// finish p1 cycle
moveHorizontal(slideLeft);
moveVertical(slideRight);
moveHorizontal(slideRight);

const cycle = () => {
  moveVertical(slideLeft);
  moveHorizontal(slideLeft);
  moveVertical(slideRight);
  moveHorizontal(slideRight);
};

const positions = new Map();
positions.set(JSON.stringify(platform), 1);

let patternLength, patternStart;

for (let i = 2; i < 1_000_000_000; i += 1) {
  cycle();

  if (positions.has(JSON.stringify(platform))) {
    patternStart = positions.get(JSON.stringify(platform));
    patternLength = i - patternStart;
    break;
  }

  positions.set(JSON.stringify(platform), i);
}

const delta = (1_000_000_000 - patternStart) % patternLength;

for (let i = 0; i < delta; i += 1) {
  cycle();
}

console.log('Part 2 : ', platform.count());
