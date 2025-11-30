// ResizeHandle.jsx
import React from "react";
import "./ResizeHandle.css";

export default function ResizeHandle({ side, onMouseDown }) {
  return (
    <div
      className={`resize-handle resize-${side}`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e, side);
      }}
    />
  );
}
