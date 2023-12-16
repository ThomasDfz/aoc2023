const data = require('../parser')();
const map = data
  .split('\n')
  .map(e => e.split(''));

const asCoord = (x, y) => `${x};${y}`;
const beamToStr = (b) => `${asCoord(b.x, b.y)};${b.orientation}`;

let beams = [];

const energizedTiles = new Set();
const visitedPaths = new Set();

const markEnergizedTiles = () => {
  beams.forEach(beam => {
    energizedTiles.add(asCoord(beam.x, beam.y));
    visitedPaths.add(beamToStr(beam))
  });
};

const reorientBeams = () => {
  beams = beams.reduce((acc, beam) => {
    switch (map[beam.x][beam.y]) {
      case '.':
        acc.push(beam);
        break;
      case '|':
        if (['W', 'E'].includes(beam.orientation)) {
          acc.push({ x: beam.x, y: beam.y, orientation: 'N' });
          acc.push({ x: beam.x, y: beam.y, orientation: 'S' });
        } else {
          acc.push(beam);
        }
        break;
      case '-':
        if (['N', 'S'].includes(beam.orientation)) {
          acc.push({ x: beam.x, y: beam.y, orientation: 'W' });
          acc.push({ x: beam.x, y: beam.y, orientation: 'E' });
        } else {
          acc.push(beam);
        }
        break;
      case '/':
        if (beam.orientation === 'E') acc.push({ x: beam.x, y: beam.y, orientation: 'N' });
        if (beam.orientation === 'N') acc.push({ x: beam.x, y: beam.y, orientation: 'E' });
        if (beam.orientation === 'W') acc.push({ x: beam.x, y: beam.y, orientation: 'S' });
        if (beam.orientation === 'S') acc.push({ x: beam.x, y: beam.y, orientation: 'W' });
        break;
      case '\\':
        if (beam.orientation === 'E') acc.push({ x: beam.x, y: beam.y, orientation: 'S' });
        if (beam.orientation === 'N') acc.push({ x: beam.x, y: beam.y, orientation: 'W' });
        if (beam.orientation === 'W') acc.push({ x: beam.x, y: beam.y, orientation: 'N' });
        if (beam.orientation === 'S') acc.push({ x: beam.x, y: beam.y, orientation: 'E' });
        break;
      default:
        console.error('unexpected map character');
    }

    return acc;
  }, []);
};

const shouldKeepBeam = beam =>
  beam.x >= 0
  && beam.x < map.length
  && beam.y >= 0
  && beam.y < map[0].length
  && !visitedPaths.has(beamToStr(beam));

const moveBeams = () => {
  beams = beams.reduce((acc, beam) => {
    switch (beam.orientation) {
      case 'N':
        beam.x--;
        break;
      case 'S':
        beam.x++;
        break;
      case 'W':
        beam.y--;
        break;
      case 'E':
        beam.y++;
        break;
    }

    if (shouldKeepBeam(beam)) {
      acc.push(beam);
    }

    return acc;
  }, []);
};

const simulate = (startingBeam) => {
  beams = [startingBeam];
  let currentConfiguration;

  do {
    currentConfiguration = visitedPaths.size;
    markEnergizedTiles();
    reorientBeams();
    moveBeams();
  } while (currentConfiguration !== visitedPaths.size);

  const result = energizedTiles.size;

  beams.length = 0;
  energizedTiles.clear();
  visitedPaths.clear();

  return result;
};

console.log('Part 1) ', simulate({ x: 0, y: 0, orientation: 'E' }));

/**
 * Part 2
 */
let max = 0;

for (let x = 0; x < map.length; x += 1) {
  max = Math.max(
    max,
    simulate({ x, y: 0, orientation: 'E' }),
    simulate({ x, y: map[0].length - 1, orientation: 'W' }),
  );
}

for (let y = 0; y < map[0].length; y += 1) {
  max = Math.max(
    max,
    simulate({ x: 0, y, orientation: 'S' }),
    simulate({ x: map.length - 1, y, orientation: 'N' }),
  );
}

console.log('Part 2) ', max);
