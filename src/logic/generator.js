import { tokenize } from "./lexer.js";
import { RecursiveDescentParser } from "./parser.js";

const OPS = ["+", "-", "×", "÷"];

export function generateSolvableProblem(level = 1) {
  const numCount = Math.min(3 + Math.floor(level / 3), 6);

  const numbers = Array.from({ length: numCount }, () => {
    const rand = Math.random();
    if (rand < 0.7) return Math.floor(Math.random() * 9) + 1;
    return Math.floor(Math.random() * 20) + 1;
  });

  const needsParentheses = level >= 5;

  if (needsParentheses) {
    return generateWithParentheses(numbers, level);
  }

  const solution = generateRandomSolution(numbers);

  return {
    numbers,
    target: solution.target,
    solution: solution.expression,
    needsParentheses: false
  };
}

function generateRandomSolution(numbers) {
  const ops = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    ops.push(OPS[Math.floor(Math.random() * OPS.length)]);
  }

  const expression = buildExpression(numbers, ops);
  const result = safeEvaluate(expression);

  if (result === null || !Number.isFinite(result) || Math.abs(result) > 1000) {
    const simpleOps = Array(numbers.length - 1).fill("+");
    const simpleExpr = buildExpression(numbers, simpleOps);
    return {
      target: Math.round(safeEvaluate(simpleExpr) * 100) / 100,
      expression: simpleExpr
    };
  }

  return {
    target: Math.round(result * 100) / 100,
    expression
  };
}

function generateWithParentheses(numbers, level) {
  const numCount = numbers.length;

  const strategies = [
    () => {
      if (numCount < 3) return null;
      const ops = Array.from({ length: numCount - 1 }, () =>
        OPS[Math.floor(Math.random() * OPS.length)]
      );
      return `(${numbers[0]}${ops[0]}${numbers[1]})${ops.slice(1).map((op, i) =>
        `${op}${numbers[i + 2]}`
      ).join('')}`;
    },

    () => {
      if (numCount < 3) return null;
      const ops = Array.from({ length: numCount - 1 }, () =>
        OPS[Math.floor(Math.random() * OPS.length)]
      );
      return `${numbers[0]}${ops[0]}(${numbers[1]}${ops[1]}${numbers[2]})${
        ops.slice(2).map((op, i) => `${op}${numbers[i + 3]}`).join('')
      }`;
    },

    () => {
      if (numCount < 4) return null;
      const ops = Array.from({ length: numCount - 1 }, () =>
        OPS[Math.floor(Math.random() * OPS.length)]
      );
      const beforeParen = numbers.slice(0, -2).map((n, i) =>
        i === 0 ? `${n}` : `${ops[i-1]}${n}`
      ).join('');
      return `${beforeParen}${ops[numCount-3]}(${numbers[numCount-2]}${ops[numCount-2]}${numbers[numCount-1]})`;
    },

    () => {
      if (numCount < 3) return null;
      const ops = Array.from({ length: numCount - 1 }, () =>
        OPS[Math.floor(Math.random() * OPS.length)]
      );
      return `((${numbers[0]}${ops[0]}${numbers[1]})${ops[1]}${numbers[2]})${
        ops.slice(2).map((op, i) => `${op}${numbers[i + 3]}`).join('')
      }`;
    }
  ];

  for (let attempt = 0; attempt < 20; attempt++) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const expression = strategy();

    if (!expression) continue;

    const result = safeEvaluate(expression);

    if (result !== null && Number.isFinite(result) && Math.abs(result) <= 500) {
      return {
        numbers,
        target: Math.round(result * 100) / 100,
        solution: expression,
        needsParentheses: true
      };
    }
  }

  const simple = generateRandomSolution(numbers);
  return {
    numbers,
    target: simple.target,
    solution: simple.expression,
    needsParentheses: false
  };
}

function buildExpression(numbers, ops) {
  let expr = "";
  numbers.forEach((n, i) => {
    expr += n;
    if (i < ops.length) expr += ops[i];
  });
  return expr;
}

function safeEvaluate(expr) {
  try {
    const tokens = tokenize(expr);
    const parser = new RecursiveDescentParser(tokens);
    const pr = parser.parse();
    if (pr.success && Number.isFinite(pr.result)) return pr.result;
    return null;
  } catch {
    return null;
  }
}

export function generateValidTarget(numbers) {
  if (!Array.isArray(numbers) || numbers.length < 2) return null;
  const solution = generateRandomSolution(numbers);
  return solution.target;
}
