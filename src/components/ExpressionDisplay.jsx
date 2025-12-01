import React from "react";

export default function ExpressionDisplay({
  numbers = [],
  slots = [],
  prefixSlot = [],
  suffixSlot = [],
  onDrop = () => {},
  onRemoveOperator = () => {},
  draggedOperator = null
}) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return (
      <div style={styles.errorContainer}>
        ⚠️ Error: no hay números disponibles.
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotIndex, slotType = "middle") => {
    e.preventDefault();
    const operator = e.dataTransfer.getData("text/plain");
    onDrop(slotIndex, slotType, operator);
  };

  const renderDropZone = (slotOps, slotIndex, slotType = "middle", label = "") => {
    return (
      <div
        style={{
          ...styles.dropZone,
          ...(draggedOperator ? styles.dropZoneActive : {}),
          ...(slotType !== "middle" ? styles.edgeDropZone : {})
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, slotIndex, slotType)}
      >
        {slotOps.length === 0 ? (
          <div style={styles.emptySlot}>{label || "Arrastra aquí"}</div>
        ) : (
          <div style={styles.operatorsList}>
            {slotOps.map((op, opIdx) => (
              <div
                key={opIdx}
                style={{
                  ...styles.operatorChip,
                  ...(op === "(" || op === ")" ? styles.parenChip : {})
                }}
                onClick={() => onRemoveOperator(slotIndex, opIdx, slotType)}
              >
                {op}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Construye tu expresión</h3>

      <div style={styles.expressionContainer}>
        {renderDropZone(prefixSlot, 0, "prefix", "( inicio")}

        {numbers.map((num, idx) => {
          const slotOps = slots[idx] || [];

          return (
            <React.Fragment key={idx}>
              <div style={styles.numberBox}>{num}</div>
              {idx < numbers.length - 1 &&
                renderDropZone(slotOps, idx, "middle")}
            </React.Fragment>
          );
        })}

        {renderDropZone(suffixSlot, 0, "suffix", ") final")}
      </div>

      <div style={styles.expressionPreview}>
        <strong>Expresión actual: </strong>
        <code style={styles.expressionCode}>
          {prefixSlot.join("")}

          {numbers.map((num, idx) => (
            <React.Fragment key={idx}>
              {num}
              {Array.isArray(slots[idx]) ? slots[idx].join("") : ""}
            </React.Fragment>
          ))}

          {suffixSlot.join("")}
        </code>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    padding: "clamp(1rem, 3vw, 2rem)",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },
  title: {
    marginTop: 0,
    marginBottom: "1.5rem",
    color: "#1f2937",
    fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
    textAlign: "center"
  },
  expressionContainer: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    minHeight: "100px",
    padding: "1rem"
  },
  numberBox: {
    width: "clamp(50px, 10vw, 70px)",
    height: "clamp(50px, 10vw, 70px)",
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    color: "#ffffff",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
    flexShrink: 0
  },
  dropZone: {
    minWidth: "clamp(80px, 15vw, 120px)",
    minHeight: "clamp(50px, 10vw, 70px)",
    padding: "0.5rem",
    background: "#f3f4f6",
    border: "3px dashed #d1d5db",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    flexShrink: 0
  },
  edgeDropZone: {
    minWidth: "clamp(70px, 12vw, 100px)",
    background: "#fef3c7",
    borderColor: "#f59e0b"
  },
  dropZoneActive: {
    background: "#dbeafe",
    borderColor: "#3b82f6",
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
    transform: "scale(1.05)"
  },
  emptySlot: {
    fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
    color: "#9ca3af",
    textAlign: "center",
    fontWeight: "600"
  },
  operatorsList: {
    display: "flex",
    gap: "0.25rem",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center"
  },
  operatorChip: {
    padding: "0.4rem 0.7rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    borderRadius: "0.5rem",
    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
    userSelect: "none"
  },
  parenChip: {
    background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    boxShadow: "0 2px 8px rgba(236, 72, 153, 0.3)"
  },
  expressionPreview: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
    border: "2px solid #e2e8f0",
    fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
    color: "#1e293b",
    textAlign: "center"
  },
  expressionCode: {
    fontFamily: "monospace",
    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
    color: "#7c3aed",
    fontWeight: "bold",
    background: "#ffffff",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    display: "inline-block",
    marginTop: "0.5rem"
  },
  errorContainer: {
    padding: "1.5rem",
    background: "#fee2e2",
    borderRadius: "0.75rem",
    color: "#991b1b",
    textAlign: "center",
    fontWeight: "bold"
  }
};
