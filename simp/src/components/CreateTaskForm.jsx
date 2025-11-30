import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createTaskRequest, updateTaskRequest } from "../store/tasksSlice";
import { TASK_TYPES, TASK_STATUSES, PRIORITY_LEVELS } from "../utils/constants";

export default function CreateTaskForm({ onClose, editingTask = null }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      type: TASK_TYPES[0],
      status: TASK_STATUSES[0],
      category: TASK_STATUSES[0],
      priority: PRIORITY_LEVELS[1],
      assignees: "",
      startDate: "",
      endDate: "",
      due: ""
    }
  });

  useEffect(() => {
    if (editingTask) {
      setValue("title", editingTask.title || "");
      setValue("description", editingTask.description || "");
      setValue("type", editingTask.type || TASK_TYPES[0]);
      setValue("status", editingTask.status || TASK_STATUSES[0]);
      setValue("category", editingTask.status || TASK_STATUSES[0]);
      setValue("priority", editingTask.priority || PRIORITY_LEVELS[1]);
      setValue("assignees", (editingTask.assignees || []).join(", "));
      setValue("startDate", editingTask.startDate || "");
      setValue("endDate", editingTask.endDate || "");
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
      category: raw.status,
      priority: raw.priority,
      assignees: raw.assignees
        ? raw.assignees.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      startDate: raw.startDate || raw.due || null,
      endDate: raw.endDate || raw.due || null,
      due: raw.due || null
    };

    if (editingTask?.id) {
      dispatch(updateTaskRequest({ id: editingTask.id, payload }));
    } else {
      dispatch(createTaskRequest(payload));
    }

    reset();
    onClose && onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="task-form">
      <label>Title</label>
      <input {...register("title", { required: "Title is required" })} />
      {errors.title && <p className="error">{errors.title.message}</p>}

      <label>Description</label>
      <textarea {...register("description")} rows={3} />

      <div className="two-col">
        <div>
          <label>Type</label>
          <select {...register("type")}>
            {TASK_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Status</label>
          <select {...register("status")}>
            {TASK_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <label>Category</label>
      <select {...register("category")}>
        {TASK_STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <div className="two-col">
        <div>
          <label>Priority</label>
          <select {...register("priority")}>
            {PRIORITY_LEVELS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Due</label>
          <input type="date" {...register("due")} />
        </div>
      </div>

      <div className="two-col">
        <div>
          <label>Start Date</label>
          <input type="date" {...register("startDate")} />
        </div>

        <div>
          <label>End Date</label>
          <input type="date" {...register("endDate")} />
        </div>
      </div>

      <label>Assignees (comma separated)</label>
      <input {...register("assignees")} placeholder="Alice, Bob" />

      <div className="form-footer">
        <button type="button" className="btn cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn create" disabled={isSubmitting}>
          {editingTask ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
}
