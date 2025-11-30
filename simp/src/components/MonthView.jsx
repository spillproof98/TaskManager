import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateTaskRequest } from "../store/tasksSlice";
import ResizeHandle from "./ResizeHandle";
import "./MonthView.css";

export default function MonthView({
  tasks = [],
  filters,
  onCreateRange,
  onOpenTask
}) {
  const dispatch = useDispatch();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const daysGrid = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startOffset = first.getDay();
    const cells = [];

    for (let i = 0; i < startOffset; i++) {
      cells.push({ key: "pad-" + i, dateStr: null, num: null });
    }

    for (let d = 1; d <= last.getDate(); d++) {
      const date = new Date(viewYear, viewMonth, d);
      const iso = date.toISOString().slice(0, 10);
      cells.push({ key: iso, dateStr: iso, num: d });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const allDateStrs = daysGrid.map((d) => d.dateStr).filter(Boolean);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];
    if (filters) {
      const { categories = [], timeWindow = null, search = "" } = filters;

      if (categories.length > 0)
        list = list.filter((t) => categories.includes(t.status));

      if (timeWindow) {
        const now = new Date();
        const limit = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + timeWindow * 7
        );
        const nowStr = now.toISOString().slice(0, 10);
        const limitStr = limit.toISOString().slice(0, 10);

        list = list.filter(
          (t) => t.startDate <= limitStr && t.endDate >= nowStr
        );
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((t) => (t.title || "").toLowerCase().includes(q));
      }
    }

    return list;
  }, [tasks, filters]);

  const [createDragStart, setCreateDragStart] = useState(null);
  const [createHoverDate, setCreateHoverDate] = useState(null);

  const selectedRange = useMemo(() => {
    if (!createDragStart || !createHoverDate) return [];
    const start = createDragStart < createHoverDate ? createDragStart : createHoverDate;
    const end = createDragStart < createHoverDate ? createHoverDate : createDragStart;
    return allDateStrs.filter((d) => d >= start && d <= end);
  }, [createDragStart, createHoverDate, allDateStrs]);

  const [dragAction, setDragAction] = useState(null);

  const applyTaskUpdate = (id, changes) => {
    dispatch(updateTaskRequest({ id, payload: changes }));
  };

  const addDays = (dateStr, offset) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d + offset);
    return dt.toISOString().slice(0, 10);
  };

  const diffDays = (a, b) => {
    const d1 = new Date(a);
    const d2 = new Date(b);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
  };

  const tasksByDate = useMemo(() => {
    const map = {};
    allDateStrs.forEach((d) => (map[d] = []));
    filteredTasks.forEach((t) => {
      allDateStrs.forEach((day) => {
        if (t.startDate <= day && t.endDate >= day) {
          map[day].push(t);
        }
      });
    });
    return map;
  }, [filteredTasks, allDateStrs]);

  const handleDayMouseDown = (cell) => {
    if (!cell.dateStr || dragAction) return;
    setCreateDragStart(cell.dateStr);
    setCreateHoverDate(cell.dateStr);
  };

  const handleDayMouseEnter = (cell) => {
    if (createDragStart && cell.dateStr) setCreateHoverDate(cell.dateStr);
  };

  const handleDayMouseUp = (cell) => {
    if (!cell.dateStr) return;

    if (dragAction) {
      const { mode, task, originDate } = dragAction;

      if (mode === "move") {
        const offset = diffDays(originDate, cell.dateStr);
        if (offset !== 0) {
          applyTaskUpdate(task.id, {
            startDate: addDays(task.startDate, offset),
            endDate: addDays(task.endDate, offset)
          });
        }
      }

      if (mode === "resize-start" && cell.dateStr <= task.endDate)
        applyTaskUpdate(task.id, { startDate: cell.dateStr });

      if (mode === "resize-end" && cell.dateStr >= task.startDate)
        applyTaskUpdate(task.id, { endDate: cell.dateStr });

      setDragAction(null);
      return;
    }

    if (createDragStart && createHoverDate) {
      const start = createDragStart < createHoverDate ? createDragStart : createHoverDate;
      const end = createDragStart < createHoverDate ? createHoverDate : createDragStart;
      onCreateRange(start, end);
    }

    setCreateDragStart(null);
    setCreateHoverDate(null);
  };

  const CATEGORY_COLOR = {
    Todo: "#9ca3af",
    "In Progress": "#2563eb",
    "In Review": "#f59e0b",
    Done: "#16a34a",
    Completed: "#16a34a"
  };

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth(viewMonth - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth(viewMonth + 1);
  };

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="month-wrapper">
      <div className="month-header">
        <button className="nav-btn" onClick={goPrevMonth}>‹</button>
        <span className="month-title">{monthLabel}</span>
        <button className="nav-btn" onClick={goNextMonth}>›</button>
      </div>

      <div className="weekday-row">
        {weekdayLabels.map((w) => (
          <div key={w} className="weekday-cell">{w}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {daysGrid.map((cell) => {
          const { key, dateStr, num } = cell;
          const dayTasks = dateStr ? tasksByDate[dateStr] : [];

          return (
            <div
              key={key}
              className={`day-tile ${dateStr ? "" : "empty"} ${
                selectedRange.includes(dateStr) ? "highlight" : ""
              }`}
              onMouseDown={() => handleDayMouseDown(cell)}
              onMouseEnter={() => handleDayMouseEnter(cell)}
              onMouseUp={() => handleDayMouseUp(cell)}
            >
              {dateStr && (
                <div className="day-num">
                  {num}
                  {dateStr === today.toISOString().slice(0, 10) && (
                    <span className="today-dot" />
                  )}
                </div>
              )}

              {dayTasks.map((t) => {
                const bg = CATEGORY_COLOR[t.status] || "#4b5563";
                const isStart = t.startDate === dateStr;
                const isEnd = t.endDate === dateStr;

                return (
                  <div
                    key={t.id}
                    className="task-bar"
                    style={{ background: bg }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragAction({
                        mode: "move",
                        task: t,
                        originDate: dateStr
                      });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!dragAction) onOpenTask(t);
                    }}
                  >
                    {isStart && (
                      <ResizeHandle
                        side="left"
                        onMouseDown={() =>
                          setDragAction({
                            mode: "resize-start",
                            task: t,
                            originDate: dateStr
                          })
                        }
                      />
                    )}

                    <span className="task-title">{t.title}</span>

                    {isEnd && (
                      <ResizeHandle
                        side="right"
                        onMouseDown={() =>
                          setDragAction({
                            mode: "resize-end",
                            task: t,
                            originDate: dateStr
                          })
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
