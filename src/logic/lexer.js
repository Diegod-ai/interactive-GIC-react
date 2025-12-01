export function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/\d/.test(char)) {
      let num = "";
      while (i < input.length && /[\d.]/.test(input[i])) {
        num += input[i];
        i++;
      }
      tokens.push({ type: "NUMBER", value: parseFloat(num) });
      continue;
    }

    if (["+", "-", "×", "÷", "(", ")"].includes(char)) {
      const type = {
        "+": "PLUS",
        "-": "MINUS",
        "×": "MULTIPLY",
        "÷": "DIVIDE",
        "(": "LPAREN",
        ")": "RPAREN",
      }[char];

      tokens.push({ type, value: char });
      i++;
      continue;
    }

    throw new Error("Carácter inválido: " + char);
  }

  tokens.push({ type: "EOF", value: null });
  return tokens;
}
