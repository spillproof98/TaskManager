import React from "react";
import TaskCard from "./TaskCard";
import { COLOR_MAP } from "../utils/constants";

export default function BoardColumn({ title, tasks = [], onTaskClick }) {
  return (
    <div className="column">
      <div className="column-header" style={{ borderBottomColor: COLOR_MAP[title] || "#e5e7eb" }}>
        <h3 style={{ color: COLOR_MAP[title] || "#111827" }}>
          {title}
        </h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <p className="empty-column">No tasks</p>
        )}
      </div>
    </div>
  );
}
