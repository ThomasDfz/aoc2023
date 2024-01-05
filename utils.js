const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

module.exports = {
  range,
};
