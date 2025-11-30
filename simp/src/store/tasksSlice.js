import { createSlice, nanoid } from "@reduxjs/toolkit";

function loadTasks() {
  try {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const slice = createSlice({
  name: "tasks",
  initialState: {
    tasks: loadTasks(),
    loading: false,
    isCreateOpen: false,
    error: null
  },

  reducers: {
    fetchTasksRequest: (state) => {
      state.loading = false;
    },
    fetchTasksSuccess: (state) => state,
    fetchTasksFailure: (state) => state,

    createTaskRequest: (state, action) => {
      const payload = action.payload;

      const newTask = {
        id: nanoid(),
        title: payload.title,
        description: payload.description || "",
        type: payload.type,
        priority: payload.priority,

        status: payload.status || "Todo",

        startDate: payload.startDate,
        endDate: payload.endDate,

        assignees: payload.assignees || [],
        due: payload.due || null
      };

      state.tasks.unshift(newTask);
      saveTasks(state.tasks);
      state.loading = false;
    },

    createTaskSuccess: (s) => s,
    createTaskFailure: (s) => s,

    updateTaskRequest: (state, action) => {
      const { id, payload } = action.payload;
      const idx = state.tasks.findIndex((t) => t.id === id);

      if (idx !== -1) {
        state.tasks[idx] = {
          ...state.tasks[idx],
          ...payload
        };
      }

      saveTasks(state.tasks);
      state.loading = false;
    },

    updateTaskSuccess: (s) => s,
    updateTaskFailure: (s) => s,

    deleteTaskRequest: (state, action) => {
      const id = action.payload;
      state.tasks = state.tasks.filter((t) => t.id !== id);
      saveTasks(state.tasks);
      state.loading = false;
    },

    deleteTaskSuccess: (s) => s,
    deleteTaskFailure: (s) => s,

    openCreateModal: (state) => {
      state.isCreateOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateOpen = false;
    }
  }
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  openCreateModal,
  closeCreateModal
} = slice.actions;

export default slice.reducer;
