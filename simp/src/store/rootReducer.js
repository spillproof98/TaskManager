import { combineReducers } from "@reduxjs/toolkit";
import tasks from "./tasksSlice";

const rootReducer = combineReducers({
  tasks,
});

export default rootReducer;
