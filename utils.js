const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

const asCoords = (x, y, z) => [x, y, z].join(',');

const generateCubesRange = (xs, ys, zs, xe, ye, ze) => {
  const cubes = [];

  for (let x = Math.min(xs, xe); x <= Math.max(xs, xe); x += 1) {
    for (let y = Math.min(ys, ye); y <= Math.max(ys, ye); y += 1) {
      for (let z = Math.min(zs, ze); z <= Math.max(zs, ze); z += 1) {
        cubes.push({ x, y, z });
      }
    }
  }

  return cubes;
};

module.exports = {
  range,
  asCoords,
  generateCubesRange
};
