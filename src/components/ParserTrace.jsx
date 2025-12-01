import React from "react";

export default function ParserTrace({ trace = [] }) {
  if (!Array.isArray(trace) || trace.length === 0) return null;
  return (
    <div style={{ background: "#000000ff", padding: 12, borderRadius: 8 }}>
      <h4 style={{ marginTop: 0 }}>Traza del Parser</h4>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
        {trace.map((t, i) => `[${i}] ${t}\n`)}
      </pre>
    </div>
  );
}
