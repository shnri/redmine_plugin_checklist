import React, { createContext, useContext, useState } from "react";
import { TaskTree } from "../types";
import { rootId } from "./TaskList";

interface TaskTreeContextType {
  taskTree: TaskTree;
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>;
}

const TaskTreeContext = createContext<TaskTreeContextType | undefined>(
  undefined
);

export const TaskTreeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [taskTree, setTaskTree] = useState<TaskTree>({
    taskId: rootId,
    label: "dummy",
    checked: false,
    isLayerOpen: true,
    position: 0,
    children: [],
  });

  return (
    <TaskTreeContext.Provider value={{ taskTree, setTaskTree }}>
      {children}
    </TaskTreeContext.Provider>
  );
};

export const useTaskTree = () => {
  const context = useContext(TaskTreeContext);
  if (!context) {
    throw new Error("useTaskTree must be used within a TaskTreeProvider");
  }
  return context;
};
