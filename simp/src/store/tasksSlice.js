import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false, isCreateOpen: false, error: null },
  reducers: {
    fetchTasksRequest: (s) => { s.loading = true; s.error = null; },
    fetchTasksSuccess: (s, a) => { s.loading = false; s.tasks = a.payload; },
    fetchTasksFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    createTaskRequest: (s) => { s.loading = true; s.error = null; },
    createTaskSuccess: (s, a) => { s.loading = false; s.tasks.unshift(a.payload); },
    createTaskFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    updateTaskRequest: (s) => { s.loading = true; s.error = null; },
    updateTaskSuccess: (s, a) => {
      s.loading = false;
      const updated = a.payload;
      const idx = s.tasks.findIndex((t) => t.id === updated.id);
      if (idx !== -1) s.tasks[idx] = updated;
    },
    updateTaskFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    deleteTaskRequest: (s) => { s.loading = true; s.error = null; },
    deleteTaskSuccess: (s, a) => {
      s.loading = false;
      s.tasks = s.tasks.filter((t) => t.id !== a.payload);
    },
    deleteTaskFailure: (s, a) => { s.loading = false; s.error = a.payload; },

    openCreateModal: (s) => { s.isCreateOpen = true; },
    closeCreateModal: (s) => { s.isCreateOpen = false; },
  },
});

export const {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure,
  openCreateModal, closeCreateModal
} = slice.actions;

export default slice.reducer;
