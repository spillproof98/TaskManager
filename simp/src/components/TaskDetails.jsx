import React from "react";
import { COLOR_MAP } from "../utils/constants";

export default function TaskDetails({ task, onClose, onEdit, onDelete }) {
  if (!task) return null;

  const {
    title,
    description,
    type = "Task",
    status = "Todo",
    priority = "Medium",
    assignees = [],
    startDate,
    endDate,
    due
  } = task;

  return (
    <div className="task-details">

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div
          style={{
            width: 10,
            height: 40,
            borderRadius: 4,
            background: COLOR_MAP[type] || "#888",
          }}
        />
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            {type} • {status}
          </div>
        </div>
      </div>

      <p style={{ color: "#374151", lineHeight: 1.4 }}>
        {description || "No description provided."}
      </p>

      {(startDate || endDate) && (
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <strong>📅 Duration:</strong>{" "}
          {startDate || "—"} → {endDate || "—"}
        </div>
      )}

      {due && (
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <strong>Due:</strong> {due}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Assignees</div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            {assignees.length > 0 ? (
              assignees.map((a) => (
                <div
                  key={a}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {a[0]?.toUpperCase()}
                </div>
              ))
            ) : (
              <div style={{ color: "#9ca3af" }}>Unassigned</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Priority</div>
          <div style={{ marginTop: 6, fontWeight: 600 }}>{priority}</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
        {onEdit && (
          <button className="btn" onClick={() => onEdit(task)}>
            Edit
          </button>
        )}

        {onDelete && (
          <button className="btn cancel" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        )}

        <button className="btn create" onClick={onClose}>
          Close
        </button>
      </div>

    </div>
  );
}
