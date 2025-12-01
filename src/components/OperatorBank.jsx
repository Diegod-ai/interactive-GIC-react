import React from "react";

export default function OperatorBank({
  operators = [],
  onDragStart = () => {},
  onDragEnd = () => {}
}) {
  const handleDragStart = (e, operator) => {
    e.dataTransfer.effectAllowed = "copy";
    try {
      e.dataTransfer.setData("text/plain", operator);
    } catch (err) {}
    onDragStart(operator);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎨 Banco de Operadores (Arrastra)</h3>
      <div style={styles.buttonGrid}>
        {operators.map((op, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, op)}
            onDragEnd={handleDragEnd}
            style={{
              ...styles.operatorButton,
              ...(op === "(" || op === ")" ? styles.parenButton : {})
            }}
          >
            {op}
          </div>
        ))}
      </div>
      <div style={styles.hint}>
        💡 Arrastra los operadores a los espacios entre números
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    padding: "clamp(1rem, 3vw, 1.5rem)",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },
  title: {
    marginTop: 0,
    marginBottom: "1rem",
    color: "#1f2937",
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    textAlign: "center"
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(70px, 1fr))",
    gap: "0.75rem",
    maxWidth: "600px",
    margin: "0 auto"
  },
  operatorButton: {
    width: "100%",
    aspectRatio: "1",
    minHeight: "70px",
    borderRadius: "0.75rem",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#ffffff",
    border: "none",
    fontSize: "clamp(1.3rem, 3vw, 2rem)",
    fontWeight: "bold",
    cursor: "grab",
    transition: "all 0.3s",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none"
  },
  parenButton: {
    background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    boxShadow: "0 4px 15px rgba(236, 72, 153, 0.4)"
  },
  hint: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "clamp(0.85rem, 2vw, 1rem)",
    color: "#6b7280",
    fontStyle: "italic"
  }
};
