import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchTasksRequest,
  openCreateModal,
  closeCreateModal,
  deleteTaskRequest,
  updateTaskRequest,
} from "./store/tasksSlice";

import CreateTaskForm from "./components/CreateTaskForm";
import Modal from "./components/Modal";
import TaskDetails from "./components/TaskDetails";

import MonthView from "./components/MonthView";
import BoardColumn from "./components/BoardColumn";
import FilterBar from "./components/FilterBar";

export default function App() {
  const dispatch = useDispatch();
  const { tasks = [], isCreateOpen, loading } = useSelector((s) => s.tasks);

  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [view, setView] = useState("month"); // "month" | "board"

  // Filters: categories, time window, search
  const [filters, setFilters] = useState({
    categories: ["Todo", "In Progress", "In Review", "Done"],
    timeWindow: null, // null = all
    search: "",
  });

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  // ---------- FILTER LOGIC ----------
  const applyFilters = (list, f) => {
    if (!f) return list;
    const { categories, timeWindow, search } = f;

    return list.filter((t) => {
      // Category filter (status)
      if (categories?.length && !categories.includes(t.status)) {
        return false;
      }

      // Search (by title)
      if (search?.trim()) {
        const q = search.toLowerCase();
        if (!t.title?.toLowerCase().includes(q)) return false;
      }

      // Time window (from today forward N weeks)
      if (timeWindow) {
        const today = new Date();
        const end = new Date();
        end.setDate(today.getDate() + timeWindow * 7);

        // use startDate, or due, or fallback to today
        const dateStr = t.startDate || t.due;
        if (!dateStr) return false;
        const d = new Date(dateStr);

        if (d < today || d > end) return false;
      }

      return true;
    });
  };

  const filteredTasks = useMemo(
    () => applyFilters(tasks, filters),
    [tasks, filters]
  );

  // Group FOR BOARD view (on filtered tasks)
  const grouped = useMemo(
    () => ({
      Todo: filteredTasks.filter((t) => t.status === "Todo"),
      "In Progress": filteredTasks.filter((t) => t.status === "In Progress"),
      "In Review": filteredTasks.filter((t) => t.status === "In Review"),
      Done: filteredTasks.filter((t) => t.status === "Done"),
    }),
    [filteredTasks]
  );

  // ---------- Range create from Month view ----------
  const handleCreateFromRange = (startDate, endDate) => {
    setEditingTask({
      title: "",
      description: "",
      status: "Todo",
      type: "Task",
      priority: "Medium",
      assignees: [],
      due: startDate,
      startDate,
      endDate,
    });

    dispatch(openCreateModal());
  };

  // ---------- Edit / Delete ----------
  const openEdit = (task) => {
    setEditingTask(task);
    dispatch(openCreateModal());
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this task?")) return;
    dispatch(deleteTaskRequest(id));
    setSelectedTask(null);
  };

  // ---------- Board drag & drop: change status ----------
  const handleDropOnColumn = (taskId, newStatus) => {
    dispatch(updateTaskRequest({ id: taskId, payload: { status: newStatus } }));
  };

  return (
    <div className="app">
      <header className="header">
        <h1>{view === "month" ? "Month Planner" : "Task Board"}</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn"
            onClick={() => setView(view === "month" ? "board" : "month")}
          >
            {view === "month" ? "Switch to Board" : "Switch to Calendar"}
          </button>

          <button
            className="btn"
            onClick={() => {
              setEditingTask(null);
              dispatch(openCreateModal());
            }}
          >
            + Create Task
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: 20 }}>Loading tasks…</div>
      ) : (
        <main>
          {view === "month" ? (
            <>
              {/* Filters also apply to Month view */}
              <FilterBar filters={filters} setFilters={setFilters} />

              <MonthView
                tasks={filteredTasks}
                filters={filters}
                onCreateRange={handleCreateFromRange}
                onOpenTask={(t) => setSelectedTask(t)}
              />
            </>
          ) : (
            <>
              <FilterBar filters={filters} setFilters={setFilters} />

              <div className="board">
                {Object.entries(grouped).map(([status, list]) => (
                  <BoardColumn
                    key={status}
                    title={status}
                    tasks={list}
                    onTaskClick={(t) => setSelectedTask(t)}
                    onDropTask={(taskId) => handleDropOnColumn(taskId, status)}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      )}

      {/* Create/Edit Modal */}
      {isCreateOpen && (
        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
          onClose={() => {
            dispatch(closeCreateModal());
            setEditingTask(null);
          }}
        >
          <CreateTaskForm
            editingTask={editingTask}
            onClose={() => {
              dispatch(closeCreateModal());
              setEditingTask(null);
            }}
          />
        </Modal>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <Modal
          title={selectedTask.title}
          onClose={() => setSelectedTask(null)}
        >
          <TaskDetails
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={(t) => {
              setSelectedTask(null);
              openEdit(t);
            }}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
}
