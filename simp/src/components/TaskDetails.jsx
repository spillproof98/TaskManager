import React from "react";
import { COLOR_MAP } from "../utils/constants";

export default function TaskDetails({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  return (
    <div className="task-details">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
        <div style={{
          width: 10, height: 40, borderRadius: 4,
          background: COLOR_MAP[task.type] || "#ccc"
        }} />
        <div>
          <h4 style={{ margin: 0 }}>{task.title}</h4>
          <div style={{ color: "#6b7280", fontSize: 13 }}>{task.type} • {task.status}</div>
        </div>
      </div>

      <p style={{ color: "#374151" }}>{task.description || "No description"}</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Assignees</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {(task.assignees || []).map((a) => (
              <div key={a} style={{
                width: 32, height: 32, borderRadius: 8, background: "#eef2ff",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700
              }}>{a[0]?.toUpperCase()}</div>
            ))}
            {!(task.assignees || []).length && <div style={{ color: "#9ca3af" }}>Unassigned</div>}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Priority</div>
          <div style={{ marginTop: 6, fontWeight: 600 }}>{task.priority || "Medium"}</div>

          <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>Due</div>
          <div style={{ marginTop: 6 }}>{task.due || "—"}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        {onEdit && <button className="btn" onClick={() => onEdit(task)}>Edit</button>}
        {onDelete && <button className="btn cancel" onClick={() => onDelete(task.id)}>Delete</button>}
        <button className="btn create" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
