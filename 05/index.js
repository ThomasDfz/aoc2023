const data = require('../parser')().split('\n\n');

const seeds = data
  .shift()
  .split(': ')
  .pop()
  .split(' ')
  .map(Number);

const [
  soilMap,
  fertilizerMap,
  waterMap,
  lightMap,
  temperatureMap,
  humidityMap,
  locationMap,
] = data.map(maps => {
  maps = maps.split('\n');
  maps.shift();

  return maps.map(m => {
    const [destination, source, range] = m.split(' ').map(Number);

    return { source, destination, range };
  });
});

const getDestination = (start, map) => {
  for (let i = 0; i < map.length; i += 1) {
    const { source, destination, range } = map[i];

    if (start >= source && start <= (source + range - 1)) {
      return destination + (start - source);
    }
  }

  return start;
};

const getSeedLocation = (seed) => {
  const soil = getDestination(seed, soilMap);
  const fertilizer = getDestination(soil, fertilizerMap);
  const water = getDestination(fertilizer, waterMap);
  const light = getDestination(water, lightMap);
  const temperature = getDestination(light, temperatureMap);
  const humidity = getDestination(temperature, humidityMap);

  return getDestination(humidity, locationMap);
};

/**
 * Part 1
 */
let nearest = Number.MAX_SAFE_INTEGER;

seeds.forEach((seed) => nearest = Math.min(nearest, getSeedLocation(seed)));

console.log(`1) ${nearest}`);

/**
 * Part 2
 */
nearest = Number.MAX_SAFE_INTEGER;

for (let i = 0; i < seeds.length; i += 2) {
  for (let j = seeds[i]; j <= (seeds[i] + seeds[i + 1]); j += 1) {
    nearest = Math.min(nearest, getSeedLocation(j));
  }
  console.log(`Seed ${seeds[i]} done...`);
}

console.log(`2) ${nearest}`);
