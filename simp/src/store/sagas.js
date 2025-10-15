import { all, takeEvery, put, call } from "redux-saga/effects";
import * as api from "../utils/api";
import {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} from "./tasksSlice";

function* fetchTasks() {
  try {
    const tasks = yield call(api.getTasks);
    yield put(fetchTasksSuccess(tasks));
  } catch (err) {
    yield put(fetchTasksFailure(err.message || String(err)));
  }
}

function* createTask(action) {
  try {
    const task = yield call(api.createTask, action.payload);
    yield put(createTaskSuccess(task));
  } catch (err) {
    yield put(createTaskFailure(err.message || String(err)));
  }
}

function* updateTask(action) {
  try {
    const { id, payload } = action.payload;
    const updated = yield call(api.updateTask, id, payload);
    yield put(updateTaskSuccess(updated));
  } catch (err) {
    yield put(updateTaskFailure(err.message || String(err)));
  }
}

function* deleteTask(action) {
  try {
    const id = action.payload;
    yield call(api.deleteTask, id);
    yield put(deleteTaskSuccess(id));
  } catch (err) {
    yield put(deleteTaskFailure(err.message || String(err)));
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(fetchTasksRequest.type, fetchTasks),
    takeEvery(createTaskRequest.type, createTask),
    takeEvery(updateTaskRequest.type, updateTask),
    takeEvery(deleteTaskRequest.type, deleteTask),
  ]);
}
