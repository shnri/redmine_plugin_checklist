import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import TaskList from "../components/TaskList";
// import "./index.css";

const rootElement = document.getElementById("checklist");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TaskList />
    </StrictMode>
  );
}
