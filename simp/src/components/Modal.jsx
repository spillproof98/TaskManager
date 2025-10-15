import React from "react";
import "../styles/Modal.css";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h3 className="modal-title">{title}</h3>}
        <button className="close" onClick={onClose}>×</button>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
