const data = require('../parser')();

const modules = new Map();

data.split('\n').map(configuration => {
  const [name, targets] = configuration.split(' -> ');
  const type = name[0];
  const id = (type === '%' || type === '&') ? name.substring(1) : name;

  const mod = modules.get(id) || {
    state: 0,
    inputs: {},
  };

  mod.type = type;
  mod.targets = targets.split(', ');

  mod.targets.forEach(target => {
    modules.has(target)
      ? modules.get(target).inputs[id] = undefined
      : modules.set(target, { state: 0, inputs: { [id]: undefined }});
  });

  modules.set(id, mod);
});

let signals = {
  0: 0,
  1: 0,
};

const pushButton = () => {
  const queue = [];

  queue.push({ id: 'broadcaster', signal: 0, source: 'button' });

  while (queue.length) {
    const { id, signal, source } = queue.shift();
    const mod = modules.get(id);
    signals[signal] += 1;

    if (mod.type === 'b') {
      mod.targets.forEach(target => queue.push({ id: target, signal, source: id }));
    } else if (mod.type === '%' && signal !== 1) {
      mod.state = 1 - mod.state;
      mod.targets.forEach(target => queue.push({ id: target, signal: mod.state, source: id }));
    } else if (mod.type === '&') {
      mod.inputs[source] = signal;
      if (Object.values(mod.inputs).every(Boolean)) {
        mod.targets.forEach(target => queue.push({ id: target, signal: 0, source: id }));
      } else {
        mod.targets.forEach(target => queue.push({ id: target, signal: 1, source: id }));
      }
    }
  }

  return false;
};

for (let i = 0; i < 1000; i += 1) {
  pushButton();
}

console.log('Part 1 : ', signals[0] * signals[1]);
