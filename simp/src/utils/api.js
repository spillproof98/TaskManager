import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getTasks = () => API.get("/tasks").then((r) => r.data);
export const createTask = (data) => API.post("/tasks", data).then((r) => r.data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data).then((r) => r.data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`).then((r) => r.data);
