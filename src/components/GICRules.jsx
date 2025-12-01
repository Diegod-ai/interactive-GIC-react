import React, { useState } from "react";

export default function GICRules({ showTrace = false, trace = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={styles.container}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.toggleButton}
      >
        <span style={styles.toggleIcon}>
          {isExpanded ? "▼" : "▶"}
        </span>
        <h4 style={styles.title}>Gramática Independiente del Contexto (GIC)</h4>
      </button>

      {isExpanded && (
        <div style={styles.content}>
          <div style={styles.grammarBox}>
            <div style={styles.grammarTitle}>Reglas de Producción:</div>
            <pre style={styles.grammarText}>
{`E  → T E'
E' → + T E' | - T E' | ε
T  → F T'
T' → × F T' | ÷ F T' | ε
F  → ( E ) | número`}
            </pre>

            <div style={styles.explanation}>
              <strong>Explicación:</strong>
              <ul style={styles.explanationList}>
                <li><strong>E</strong> = Expresión completa</li>
                <li><strong>T</strong> = Término (multiplicación/división)</li>
                <li><strong>F</strong> = Factor (número o expresión entre paréntesis)</li>
                <li><strong>ε</strong> = Producción vacía</li>
              </ul>
            </div>
          </div>

          {showTrace && trace.length > 0 && (
            <div style={styles.traceContainer}>
              <div style={styles.traceTitle}>🔍 Traza del Parser:</div>
              <div style={styles.traceBox}>
                {trace.map((t, i) => (
                  <div key={i} style={styles.traceItem}>
                    <span style={styles.traceIndex}>[{i}]</span>
                    <span style={styles.traceText}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    borderRadius: "1rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  toggleButton: {
    width: "100%",
    padding: "1.25rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    transition: "background 0.3s",
  },
  toggleIcon: {
    fontSize: "1rem",
    color: "#6366f1",
    fontWeight: "bold",
  },
  title: {
    margin: 0,
    color: "#1f2937",
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    fontWeight: "bold",
    textAlign: "left",
  },
  content: {
    padding: "0 1.25rem 1.25rem",
  },
  grammarBox: {
    background: "#f8fafc",
    padding: "1.25rem",
    borderRadius: "0.75rem",
    border: "2px solid #e2e8f0",
  },
  grammarTitle: {
    fontWeight: "bold",
    color: "#475569",
    marginBottom: "0.75rem",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
  },
  grammarText: {
    margin: 0,
    fontFamily: "monospace",
    fontSize: "clamp(0.85rem, 2vw, 1rem)",
    lineHeight: "1.8",
    color: "#1e293b",
    background: "#ffffff",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    overflowX: "auto",
  },
  explanation: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#eff6ff",
    borderRadius: "0.5rem",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    color: "#1e40af",
  },
  explanationList: {
    marginTop: "0.5rem",
    marginBottom: 0,
    paddingLeft: "1.5rem",
  },
  traceContainer: {
    marginTop: "1rem",
  },
  traceTitle: {
    fontWeight: "bold",
    color: "#475569",
    marginBottom: "0.75rem",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
  },
  traceBox: {
    background: "#1e293b",
    padding: "1rem",
    borderRadius: "0.75rem",
    maxHeight: "300px",
    overflowY: "auto",
  },
  traceItem: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "0.5rem",
    fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)",
  },
  traceIndex: {
    color: "#94a3b8",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  traceText: {
    color: "#e2e8f0",
    fontFamily: "monospace",
  },
};
