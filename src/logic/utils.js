
export function evaluateExpression(node) {
  if (!node) throw new Error("Nodo inválido");
  if (node.type === "Number") return node.value;
  if (node.type === "Binary") {
    const L = evaluateExpression(node.left);
    const R = evaluateExpression(node.right);
    switch (node.op) {
      case "+": return L + R;
      case "-": return L - R;
      case "*": return L * R;
      case "/": return L / R;
    }
  }
  throw new Error("Nodo inválido en AST");
}
