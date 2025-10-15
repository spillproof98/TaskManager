import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createTaskRequest, updateTaskRequest } from "../store/tasksSlice";
import { TASK_TYPES, TASK_STATUSES, PRIORITY_LEVELS } from "../utils/constants";

export default function CreateTaskForm({ onClose, editingTask = null }) {
  const dispatch = useDispatch();

  const {
    register, handleSubmit, reset, setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: TASK_TYPES[0],
      status: TASK_STATUSES[0],
      priority: PRIORITY_LEVELS[1],
      assignees: "",
      due: ""
    }
  });

  useEffect(() => {
    if (editingTask) {
      setValue("title", editingTask.title || "");
      setValue("description", editingTask.description || "");
      setValue("type", editingTask.type || TASK_TYPES[0]);
      setValue("status", editingTask.status || TASK_STATUSES[0]);
      setValue("priority", editingTask.priority || PRIORITY_LEVELS[1]);
      setValue("assignees", (editingTask.assignees || []).join(", "));
      setValue("due", editingTask.due || "");
    } else {
      reset();
    }
  }, [editingTask, setValue, reset]);

  const onSubmit = (raw) => {
    const payload = {
      title: raw.title,
      description: raw.description || "",
      type: raw.type,
      status: raw.status,
      priority: raw.priority,
      assignees: raw.assignees ? raw.assignees.split(",").map(s => s.trim()).filter(Boolean) : [],
      due: raw.due || null
    };

    if (editingTask && editingTask.id) {
      dispatch(updateTaskRequest({ id: editingTask.id, payload }));
    } else {
      dispatch(createTaskRequest(payload));
    }

    reset();
    onClose && onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="task-form" aria-label="Create or Edit task">
      <label>Title</label>
      <input {...register("title", { required: "Title is required" })} />
      {errors.title && <p className="error">{errors.title.message}</p>}

      <label>Description</label>
      <textarea {...register("description")} rows={3} />

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Type</label>
          <select {...register("type")}>{TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Status</label>
          <select {...register("status")}>{TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Priority</label>
          <select {...register("priority")}>{PRIORITY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}</select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Due</label>
          <input type="date" {...register("due")} />
        </div>
      </div>

      <label>Assignees (comma separated)</label>
      <input {...register("assignees")} placeholder="Alice, Bob" />

      <div className="form-footer" style={{ marginTop: 12 }}>
        <button type="button" className="btn cancel" onClick={() => { reset(); onClose && onClose(); }}>Cancel</button>
        <button type="submit" className="btn create" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (editingTask ? "Save" : "Create")}
        </button>
      </div>
    </form>
  );
}
