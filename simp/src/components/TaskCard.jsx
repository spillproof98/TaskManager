import React from "react";
import { COLOR_MAP } from "../utils/constants";

export default function TaskCard({ task, onClick }) {
  if (!task) return null;

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task.id);
  };

  return (
    <div
      className="card"
      onClick={() => onClick?.(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(task)}
      draggable
      onDragStart={handleDragStart}
    >
      <div
        className="left-stripe"
        style={{ background: COLOR_MAP[task.type] || "#ccc" }}
      ></div>
      <div className="badges">
        <span
          className="badge type"
          style={{ background: COLOR_MAP[task.type] }}
        >
          {task.type}
        </span>
        <span
          className="badge status"
          style={{ background: COLOR_MAP[task.status] }}
        >
          {task.status}
        </span>
      </div>

      <h4 className="card-title">{task.title || "Untitled Task"}</h4>
      {task.description && <p className="card-desc">{task.description}</p>}

      <div className="meta">
        <div className="avatars">
          {(task.assignees || []).map((a) => (
            <div key={a} className="avatar" title={a}>
              {a[0]?.toUpperCase()}
            </div>
          ))}
        </div>
        <div className="priority">
          <strong>Priority:</strong> {task.priority || "—"}
        </div>
      </div>
    </div>
  );
}
