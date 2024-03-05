const { asCoords, generateCubesRange } = require('./utils');
const data = require('../parser')();

const settledCubesMap = new Map();
const bricksByHeight = new Map();
const collisionsSet = new Set();

const bricks = data
  .split('\n')
  .map((line, id) => {
    const [start, end] = line.split('~');
    const [xs, ys, zs] = start.split(',').map(Number);
    const [xe, ye, ze] = end.split(',').map(Number);
    const cubes = generateCubesRange(xs, ys, zs, xe, ye, ze);

    const brick = {
      id,
      cubes,
      height: Math.min(zs, ze),
      isVertical: (zs !== ze),
    };

    bricksByHeight.has(brick.height)
      ? bricksByHeight.get(brick.height).push(brick)
      : bricksByHeight.set(brick.height, [brick]);

    return brick;
  });

const hasCollision = (brick, z) => {
  let collides = false;

  const below = new Set();

  brick.cubes.forEach(cube => {
    if (settledCubesMap.has(asCoords(cube.x, cube.y, z))) {
      collides = true;
      below.add(settledCubesMap.get(asCoords(cube.x, cube.y, z)));
    }
  });

  Array.from(below).every(bottom => collisionsSet.add(`${brick.id}-${bottom}`));

  return collides;
};

const simulateFall = () => {
  Array.from(bricksByHeight.keys()).sort((a, b) => a - b).forEach(height => {
    bricksByHeight.get(height).forEach(brick => {
      let z = height;

      do {
        z--;
      } while (z !== 0 && !hasCollision(brick, z));

      brick.cubes.forEach(({ x, y }, i) => settledCubesMap.set(asCoords(x, y, z + 1 + (brick.isVertical ? i : 0)), brick.id));
    });
  });

  return Array.from(collisionsSet).map(collision => {
    const [top, bottom] = collision.split('-').map(Number);

    return { top, bottom };
  })
};

/**
 * Part 1
 */
const collisions = simulateFall();

const canBeDestroyed = (brick) => {
  if (collisions.every(collision => collision.bottom !== brick.id)) {
    return true;
  }

  const topBricksId = [...new Set(collisions.filter(c => c.bottom === brick.id).map(c => c.top))];

  return topBricksId.every(id => collisions.some(c => c.top === id && c.bottom !== brick.id));
};

const part1 = bricks.reduce((sum, brick) => sum + (+canBeDestroyed(brick)), 0);

console.log('Part 1 : ', part1);

/**
 * Part 2
 */
const countChainReaction = (brick) => {
  const fallingList = [brick.id];
  let i = 0;

  while (i < fallingList.length) {
    const current = fallingList[i];

    const fallingTopBricks = collisions
      .filter(({ top, bottom }) => bottom === current && !collisions.some(c => c.top === top && !fallingList.includes(c.bottom)))
      .map(({ top }) => top)
      .filter(id => !fallingList.includes(id));

    fallingList.push(...fallingTopBricks);

    i++;
  }

  return fallingList.length - 1;
};

const part2 = bricks.reduce((sum, brick) => sum + countChainReaction(brick), 0);

console.log('Part 2 :', part2);
