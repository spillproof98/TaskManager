import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasksRequest, openCreateModal, closeCreateModal,
  deleteTaskRequest
} from "./store/tasksSlice";
import BoardColumn from "./components/BoardColumn";
import CreateTaskForm from "./components/CreateTaskForm";
import Modal from "./components/Modal";
import TaskDetails from "./components/TaskDetails";

export default function App() {
  const dispatch = useDispatch();
  const { tasks = [], isCreateOpen, loading } = useSelector((s) => s.tasks);

  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  const grouped = useMemo(() => {
    const out = {};
    out["Todo"] = tasks.filter((t) => t.status === "Todo");
    out["In Progress"] = tasks.filter((t) => t.status === "In Progress");
    out["In Review"] = tasks.filter((t) => t.status === "In Review");
    out["Done"] = tasks.filter((t) => t.status === "Done");
    return out;
  }, [tasks]);

  const openEdit = (task) => {
    setEditingTask(task);
    dispatch(openCreateModal());
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this task?")) return;
    dispatch(deleteTaskRequest(id));
    setSelectedTask(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Task Board</h1>
        <button className="btn" onClick={() => { setEditingTask(null); dispatch(openCreateModal()); }}>
          + Create Task
        </button>
      </header>

      {loading ? <div style={{ padding: 20 }}>Loading tasks…</div> : (
        <main className="board">
          {Object.entries(grouped).map(([status, list]) => (
            <BoardColumn key={status} title={status} tasks={list} onTaskClick={(t) => setSelectedTask(t)} />
          ))}
        </main>
      )}

      {isCreateOpen && (
        <Modal title={editingTask ? "Edit Task" : "Create Task"} onClose={() => { dispatch(closeCreateModal()); setEditingTask(null); }}>
          <CreateTaskForm onClose={() => { dispatch(closeCreateModal()); setEditingTask(null); }} editingTask={editingTask} />
        </Modal>
      )}

      {selectedTask && (
        <Modal title={selectedTask.title} onClose={() => setSelectedTask(null)}>
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={(t) => { setSelectedTask(null); openEdit(t); }}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
}
