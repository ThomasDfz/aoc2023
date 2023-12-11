const data = require('../parser')();

const expandedX = [], expandedY = [], galaxies = [];

const image = data.split('\n').map((row, x) => {
  const cells = row.split('');

  if (cells.every(c => c === '.')) {
    expandedX.push(x);
  }

  cells.forEach((cell, y) => {
    if (cell === '#') {
      galaxies.push({ x, y });
    }
  });

  return cells;
});

for (let y = 0; y < image[0].length; y += 1) {
  if (image.map(row => row[y]).every(c => c === '.')) {
    expandedY.push(y);
  }
}

const getDistancesSum = (expansionFactor) => {
  let sum = 0;

  for (let i = 0; i < galaxies.length - 1; i += 1) {
    for (let j = i + 1; j < galaxies.length; j += 1) {
      const maxX = Math.max(galaxies[i].x, galaxies[j].x),
        minX = Math.min(galaxies[i].x, galaxies[j].x),
        maxY = Math.max(galaxies[i].y, galaxies[j].y),
        minY = Math.min(galaxies[i].y, galaxies[j].y);

      const deltaX = (maxX - minX) + (expandedX.filter(x => (x > minX && x < maxX)).length * (expansionFactor - 1));
      const deltaY = (maxY - minY) + (expandedY.filter(y => (y > minY && y < maxY)).length * (expansionFactor - 1));

      sum += (deltaX + deltaY);
    }
  }

  return sum;
};

console.log(getDistancesSum(2));
console.log(getDistancesSum(1000000));
