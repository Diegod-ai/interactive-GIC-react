import React, { useEffect, useState } from "react";
import OperatorBank from "./components/OperatorBank.jsx";
import ExpressionDisplay from "./components/ExpressionDisplay.jsx";
import FeedbackPanel from "./components/FeedbackPanel.jsx";
import GICRules from "./components/GICRules.jsx";
import { tokenize } from "./logic/lexer.js";
import { RecursiveDescentParser } from "./logic/parser.js";
import { generateSolvableProblem } from "./logic/generator.js";

export default function Game() {
  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState([3, 5, 2]);
  const [target, setTarget] = useState(16);
  const [slots, setSlots] = useState([]);
  const [prefixSlot, setPrefixSlot] = useState([]);
  const [suffixSlot, setSuffixSlot] = useState([]);
  const [feedback, setFeedback] = useState({
    type: "info",
    message: "¡Arrastra operadores entre los números para alcanzar el objetivo!",
  });
  const [result, setResult] = useState(null);
  const [trace, setTrace] = useState([]);
  const [showTrace, setShowTrace] = useState(false);
  const [currentSolution, setCurrentSolution] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [needsParentheses, setNeedsParentheses] = useState(false);
  const [draggedOperator, setDraggedOperator] = useState(null);

  const operators = ["+", "-", "×", "÷", "(", ")"];

  useEffect(() => {
    initializeLevel(1);
  }, []);

  const initializeLevel = (newLevel) => {
    const problem = generateSolvableProblem(newLevel);

    setLevel(newLevel);
    setNumbers(problem.numbers);
    setTarget(problem.target);
    setCurrentSolution(problem.solution);
    setNeedsParentheses(problem.needsParentheses);

    setSlots(Array.from({ length: problem.numbers.length - 1 }, () => []));
    setPrefixSlot([]);
    setSuffixSlot([]);

    setResult(null);
    setTrace([]);
    setShowTrace(false);
    setShowHint(false);

    setFeedback({
      type: "info",
      message: newLevel >= 5
        ? `¡Nivel ${newLevel}! Ahora necesitas usar paréntesis.`
        : `¡Nivel ${newLevel}! Nuevo desafío.`,
    });
  };

  const handleDragStart = (operator) => {
    setDraggedOperator(operator);
  };

  const handleDragEnd = () => {
    setDraggedOperator(null);
  };

  const countOpenParentheses = () => {
    let count = 0;
    prefixSlot.forEach((op) => {
      if (op === "(") count++;
      if (op === ")") count--;
    });
    slots.forEach((slotOps) => {
      slotOps.forEach((op) => {
        if (op === "(") count++;
        if (op === ")") count--;
      });
    });
    suffixSlot.forEach((op) => {
      if (op === "(") count++;
      if (op === ")") count--;
    });
    return count;
  };

  const isValidOperatorSequence = (currentOps, newOp, slotType = "middle") => {
    if (currentOps.length === 0) {
      if (slotType === "prefix") return newOp === "(";
      if (slotType === "suffix") return newOp === ")";
      return newOp !== ")";
    }

    const lastOp = currentOps[currentOps.length - 1];

    const isOperator = (op) => ["+", "-", "×", "÷"].includes(op);
    const isOpenParen = (op) => op === "(";
    const isCloseParen = (op) => op === ")";

    if (slotType === "prefix") {
      if (isOpenParen(lastOp)) return isOpenParen(newOp);
      return false;
    }

    if (slotType === "suffix") {
      if (isCloseParen(lastOp)) return isCloseParen(newOp);
      return false;
    }

    if (isOperator(lastOp)) return isOpenParen(newOp);

    if (isOpenParen(lastOp)) return isOperator(newOp) || isCloseParen(newOp);

    if (isCloseParen(lastOp)) return isOperator(newOp) || isCloseParen(newOp);

    return false;
  };

  const handleDrop = (slotIndex, slotType = "middle", operator) => {
    if (!operator) return;

    let currentOps = [];

    if (slotType === "prefix") {
      currentOps = prefixSlot;
    } else if (slotType === "suffix") {
      currentOps = suffixSlot;
    } else {
      currentOps = slots[slotIndex] || [];
    }

    if (!isValidOperatorSequence(currentOps, operator, slotType)) {
      setFeedback({
        type: "error",
        message: "¡Secuencia inválida! Verifica las reglas de combinación.",
      });
      return;
    }

    if (operator === ")") {
      const openCount = countOpenParentheses();
      if (openCount <= 0) {
        setFeedback({
          type: "error",
          message: "No puedes cerrar un paréntesis que no has abierto.",
        });
        return;
      }
    }

    if (slotType === "prefix") {
      setPrefixSlot([...currentOps, operator]);
    } else if (slotType === "suffix") {
      setSuffixSlot([...currentOps, operator]);
    } else {
      const newSlots = [...slots];
      newSlots[slotIndex] = [...currentOps, operator];
      setSlots(newSlots);
    }

    setFeedback({
      type: "info",
      message: `Operador "${operator}" agregado.`,
    });
  };

  const handleRemoveOperator = (slotIndex, operatorIndex, slotType = "middle") => {
    if (slotType === "prefix") {
      setPrefixSlot(prefixSlot.filter((_, idx) => idx !== operatorIndex));
    } else if (slotType === "suffix") {
      setSuffixSlot(suffixSlot.filter((_, idx) => idx !== operatorIndex));
    } else {
      const newSlots = [...slots];
      newSlots[slotIndex] = newSlots[slotIndex].filter((_, idx) => idx !== operatorIndex);
      setSlots(newSlots);
    }

    setFeedback({ type: "info", message: "Operador eliminado." });
  };

  const buildExpression = () => {
    let expr = "";
    expr += prefixSlot.join("");
    numbers.forEach((num, i) => {
      expr += num;
      if (i < slots.length) expr += slots[i].join("");
    });
    expr += suffixSlot.join("");
    return expr;
  };

  const validateExpression = () => {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].length === 0) {
        return { valid: false, message: "Todos los espacios entre números deben tener al menos un operador." };
      }
    }

    let openCount = 0;

    for (const op of prefixSlot) {
      if (op === "(") openCount++;
      if (op === ")") openCount--;
      if (openCount < 0) return { valid: false, message: "Paréntesis de cierre sin apertura." };
    }

    for (const slotOps of slots) {
      for (const op of slotOps) {
        if (op === "(") openCount++;
        if (op === ")") openCount--;
        if (openCount < 0) return { valid: false, message: "Paréntesis de cierre sin apertura." };
      }
    }

    for (const op of suffixSlot) {
      if (op === "(") openCount++;
      if (op === ")") openCount--;
      if (openCount < 0) return { valid: false, message: "Paréntesis de cierre sin apertura." };
    }

    if (openCount !== 0) {
      return { valid: false, message: `Paréntesis sin cerrar. Faltan ${openCount} paréntesis de cierre.` };
    }

    return { valid: true };
  };

  const handleEvaluate = () => {
    const validation = validateExpression();

    if (!validation.valid) {
      setFeedback({ type: "error", message: validation.message });
      setResult(null);
      return;
    }

    const expr = buildExpression();

    try {
      const tokens = tokenize(expr);
      const parser = new RecursiveDescentParser(tokens);
      const parseResult = parser.parse();

      setTrace(parseResult.trace || []);
      setShowTrace(true);

      if (!parseResult.success) {
        setFeedback({ type: "error", message: `Error de sintaxis: ${parseResult.error}` });
        setResult(null);
        return;
      }

      const value = Math.round(parseResult.result * 100) / 100;
      setResult(value);

      const epsilon = 0.01;
      if (Math.abs(value - target) < epsilon) {
        setFeedback({
          type: "success",
          message: "¡Perfecto! 🎉 Has alcanzado el objetivo. Pasa al siguiente nivel.",
        });
      } else {
        setFeedback({
          type: "error",
          message: `No alcanzaste el objetivo. Tu resultado: ${value}, Objetivo: ${target}`,
        });
      }
    } catch (e) {
      setFeedback({ type: "error", message: `Error: ${e.message}` });
      setResult(null);
    }
  };

  const handleClear = () => {
    setSlots(Array.from({ length: numbers.length - 1 }, () => []));
    setPrefixSlot([]);
    setSuffixSlot([]);
    setResult(null);
    setTrace([]);
    setShowTrace(false);
    setShowHint(false);
    setFeedback({ type: "info", message: "Slots limpiados. Comienza de nuevo." });
  };

  const handleNewLevel = () => {
    initializeLevel(level + 1);
  };

  const handleShowHint = () => {
    if (showHint) {
      setShowHint(false);
      setFeedback({
        type: "info",
        message: "Pista ocultada. ¡Intenta resolverlo tú mismo!",
      });
    } else {
      setShowHint(true);
      setFeedback({
        type: "info",
        message: `💡 Pista: Una solución posible es: ${currentSolution}`,
      });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <h1 style={styles.title}>🎯 Juego de Gramáticas GIC</h1>
          <div style={styles.levelInfo}>
            <span style={styles.levelBadge}>Nivel {level}</span>
            <span style={styles.targetBadge}>Objetivo: {target}</span>
          </div>
          {needsParentheses && <div style={styles.warningBadge}>⚠️ Este nivel requiere paréntesis</div>}
        </header>

        <ExpressionDisplay
          numbers={numbers}
          slots={slots}
          prefixSlot={prefixSlot}
          suffixSlot={suffixSlot}
          onDrop={handleDrop}
          onRemoveOperator={handleRemoveOperator}
          draggedOperator={draggedOperator}
        />

        <OperatorBank
          operators={operators}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />

        <div style={styles.rulesBox}>
          <h4 style={styles.rulesTitle}>📋 Reglas de Combinación:</h4>
          <ul style={styles.rulesList}>
            <li>✓ <strong>Entre números:</strong> <code>+</code> <code>-</code> <code>×</code> <code>÷</code> o combinaciones como <code>+(</code> <code>)-</code> <code>)×</code></li>
            <li>✓ <strong>Al inicio:</strong> Solo paréntesis de apertura <code>(</code> <code>((</code> <code>(((</code></li>
            <li>✓ <strong>Al final:</strong> Solo paréntesis de cierre <code>)</code> <code>))</code> <code>)))</code></li>
            <li>✗ <strong>No permitido:</strong> <code>++</code> <code>--</code> <code>××</code> <code>÷÷</code></li>
          </ul>
        </div>

        <div style={styles.buttonContainer}>
          <button onClick={handleEvaluate} style={styles.btnEvaluate}>✓ Evaluar</button>
          <button onClick={handleClear} style={styles.btnClear}>🗑️ Limpiar</button>
          <button onClick={handleNewLevel} style={styles.btnNext}>▶️ Siguiente Nivel</button>
          <button onClick={handleShowHint} style={styles.btnHint}>
            {showHint ? "🔒 Ocultar Pista" : "💡 Mostrar Pista"}
          </button>
        </div>

        <FeedbackPanel
          feedback={feedback}
          result={result}
          target={target}
        />

        <GICRules
          showTrace={showTrace}
          trace={trace}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  header: {
    background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    margin: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "bold",
  },
  levelInfo: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "1rem",
  },
  levelBadge: {
    background: "#667eea",
    color: "white",
    padding: "0.5rem 1.5rem",
    borderRadius: "2rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
  },
  targetBadge: {
    background: "#10b981",
    color: "white",
    padding: "0.5rem 1.5rem",
    borderRadius: "2rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
  },
  warningBadge: {
    background: "#f59e0b",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    marginTop: "1rem",
    display: "inline-block",
  },
  rulesBox: {
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  rulesTitle: {
    margin: "0 0 1rem 0",
    color: "#1f2937",
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
  },
  rulesList: {
    margin: 0,
    paddingLeft: "1.5rem",
    fontSize: "clamp(0.85rem, 2vw, 1rem)",
    color: "#374151",
    lineHeight: "2",
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "0.75rem",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  },
  btnEvaluate: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
  },
  btnClear: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
  },
  btnNext: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)",
  },
  btnHint: {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "white",
    border: "none",
    borderRadius: "0.75rem",
    fontWeight: "bold",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
  },
};
