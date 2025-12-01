import React from "react";

export default function FeedbackPanel({
  feedback = { type: "info", message: "" },
  result = null,
  target = null
}) {
  const getStyles = () => {
    switch (feedback.type) {
      case "success":
        return {
          background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
          border: "3px solid #10b981",
          icon: "✅",
        };
      case "error":
        return {
          background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
          border: "3px solid #ef4444",
          icon: "❌",
        };
      default:
        return {
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          border: "3px solid #3b82f6",
          icon: "ℹ️",
        };
    }
  };

  const styleConfig = getStyles();

  return (
    <div
      style={{
        ...styles.container,
        background: styleConfig.background,
        border: styleConfig.border,
      }}
    >
      <div style={styles.header}>
        <span style={styles.icon}>{styleConfig.icon}</span>
        <div style={styles.message}>{feedback.message}</div>
      </div>

      {result !== null && (
        <div style={styles.resultContainer}>
          <div style={styles.resultItem}>
            <span style={styles.label}>Tu Resultado:</span>
            <span style={styles.value}>{result}</span>
          </div>
          <div style={styles.separator}>|</div>
          <div style={styles.resultItem}>
            <span style={styles.label}>Objetivo:</span>
            <span style={styles.value}>{target}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "clamp(1rem, 3vw, 1.5rem)",
    borderRadius: "1rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  icon: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
  },
  message: {
    flex: 1,
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
    lineHeight: "1.5",
  },
  resultContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.5)",
    borderRadius: "0.5rem",
    flexWrap: "wrap",
  },
  resultItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
  },
  label: {
    fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
    color: "#6b7280",
    fontWeight: "600",
  },
  value: {
    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
    color: "#1f2937",
    fontWeight: "bold",
  },
  separator: {
    fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
    color: "#9ca3af",
    fontWeight: "bold",
  },
};
