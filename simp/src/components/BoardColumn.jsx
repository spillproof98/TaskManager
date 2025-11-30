import React from "react";
import TaskCard from "./TaskCard";
import { COLOR_MAP } from "../utils/constants";

export default function BoardColumn({ title, tasks = [], onTaskClick, onDropTask }) {
  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id && onDropTask) onDropTask(id);
  };

  return (
    <div
      className="column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="column-header"
        style={{ borderBottomColor: COLOR_MAP[title] || "#e5e7eb" }}
      >
        <h3 style={{ color: COLOR_MAP[title] || "#111827" }}>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))
        ) : (
          <p className="empty-column">No tasks</p>
        )}
      </div>
    </div>
  );
}
