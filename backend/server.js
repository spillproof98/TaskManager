const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "tasks.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/tasks", (req, res) => res.json(readData()));
app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const list = readData();
  const idx = list.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  list[idx] = { ...list[idx], ...req.body, id };
  writeData(list);
  res.json(list[idx]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  let list = readData();
  const before = list.length;
  list = list.filter(t => t.id !== id);
  if (list.length === before) return res.status(404).json({ error: 'Task not found' });
  writeData(list);
  res.status(204).send();
});


app.post("/api/tasks", (req, res) => {
  const data = readData();
  const newTask = { id: uuidv4(), ...req.body };
  data.unshift(newTask);
  writeData(data);
  res.status(201).json(newTask);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
