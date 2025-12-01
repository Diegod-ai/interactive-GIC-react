export class RecursiveDescentParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.trace = [];
  }

  current() {
    return this.tokens[this.pos];
  }

  consume(type) {
    const token = this.current();
    if (!token) throw new Error(`Token inesperado EOF, se esperaba ${type}`);
    if (token.type !== type) {
      throw new Error(`Se esperaba ${type}, pero se encontró ${token.type}`);
    }
    this.trace.push(`Consumiendo: ${token.type} (${token.value})`);
    this.pos++;
    return token;
  }

  parseExpression() {
    this.trace.push("Entrando a E");
    let value = this.parseTerm();

    while (this.current() && (this.current().type === "PLUS" || this.current().type === "MINUS")) {
      const op = this.current().type;
      this.consume(op);
      const right = this.parseTerm();
      value = op === "PLUS" ? value + right : value - right;
    }

    return value;
  }

  parseTerm() {
    this.trace.push("Entrando a T");
    let value = this.parseFactor();

    while (this.current() && (this.current().type === "MULTIPLY" || this.current().type === "DIVIDE")) {
      const op = this.current().type;
      this.consume(op);
      const right = this.parseFactor();
      if (op === "DIVIDE" && right === 0) throw new Error("División por cero");
      value = op === "MULTIPLY" ? value * right : value / right;
    }

    return value;
  }

  parseFactor() {
    this.trace.push("Entrando a F");
    const token = this.current();

    if (!token) throw new Error("Token inesperado EOF en Factor");

    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const val = this.parseExpression();
      this.consume("RPAREN");
      return val;
    }

    if (token.type === "NUMBER") {
      this.consume("NUMBER");
      return token.value;
    }

    throw new Error(`Token inesperado en Factor: ${token.type}`);
  }

  parse() {
    try {
      const result = this.parseExpression();
      if (this.current() && this.current().type !== "EOF") {
        throw new Error("Tokens extra después de la expresión");
      }
      return { success: true, result, trace: this.trace };
    } catch (error) {
      return { success: false, error: error.message, trace: this.trace };
    }
  }
}
