const data = require('../parser')();

const [rawWorkflows, rawRatings] = data.split('\n\n');
const workflows = new Map();

const ratings = rawRatings
  .split('\n')
  .map(rating => JSON.parse(rating.replaceAll('=', '":').replaceAll(',', ',"').replaceAll('{', '{"')));

rawWorkflows
  .split('\n')
  .forEach(workflow => {
    const [name, conditions] = workflow.substring(0, workflow.length - 1).split('{');

    workflows.set(name, conditions.split(',').map(condition => {
      for (const operator of ['<', '>']) {
        if (condition.includes(operator)) {
          const [operation, target] = condition.split(':');
          const [operand, value] = operation.split(operator);

          return {
            target,
            operand,
            operator,
            value: Number(value),
          };
        }
      }

      return { target: condition, direct: true };
  }));
});

const isVerified = (condition, rating) => condition.direct || eval(`${rating[condition.operand]}${condition.operator}${condition.value}`);

const sum = ratings.reduce((acc, rating) => {
  let currentWorkflow = 'in';
  let target;

  do {
    for (const condition of workflows.get(currentWorkflow)) {
      if (isVerified(condition, rating)) {
        target = condition.target;
        break;
      }
    }

    currentWorkflow = target;
  } while (target !== 'A' && target !== 'R');

  return acc + (target === 'A' ? (rating.x + rating.m + rating.a + rating.s) : 0);
}, 0);

console.log('Part 1 : ', sum);

/**
 * Part 2
 */
const flipCondition = condition => ({
  ...condition,
  operator: condition.operator === '>' ? '<=' : '>=',
});

const assertWorkflow = (workflow, previousConditions) => {
  if (workflow === 'A') {
    return previousConditions;
  }

  if (workflow === 'R') {
    return false;
  }

  const conditions = workflows.get(workflow);
  const combinations = [];
  const flippedConditions = [];

  for (let i = 0; i < conditions.length; i += 1) {
    combinations.push(assertWorkflow(conditions[i].target, [...previousConditions, ...flippedConditions, conditions[i]]));

    flippedConditions.push(flipCondition(conditions[i]));
  }

  return combinations;
};

const computeCombinations = (combination) => {
  const intervals = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };

  combination
    .filter(operation => !operation.direct)
    .forEach(({ operator, operand, value }) => {
      if (operator === '>') {
        intervals[operand].min = Math.max(intervals[operand].min, value + 1);
      } else if (operator === '>=') {
        intervals[operand].min = Math.max(intervals[operand].min, value);
      } else if (operator === '<') {
        intervals[operand].max = Math.min(intervals[operand].max, value - 1);
      } else if (operator === '<=') {
        intervals[operand].max = Math.min(intervals[operand].max, value);
      }
    });

  return (intervals.x.max - intervals.x.min + 1)
    * (intervals.m.max - intervals.m.min + 1)
    * (intervals.a.max - intervals.a.min + 1)
    * (intervals.s.max - intervals.s.min + 1);
};

let combinations = assertWorkflow('in', []);
let total = 0;

while (combinations.length) {
  combinations = combinations
    .filter(Boolean)
    .flat()
    .filter(combination => {
      if (!combination[0]?.target) {
        return true;
      }

      total += computeCombinations(combination);

      return false;
  });
}

console.log('Part 2 : ', total);

