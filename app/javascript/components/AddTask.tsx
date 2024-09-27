import React, { useState } from "react";
import { TaskTree } from "../types";
import { updateTaskTree } from "../utils";
import { rootId } from "./TaskList";

const initTask = () => ({
  id: Math.random().toString(),
  label: "",
  checked: false,
  isLayerOpen: false,
  children: [],
});

const AddTask: React.FC<{
  taskTree: TaskTree;
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>;
}> = ({ taskTree, setTaskTree }) => {
  const [newTaskLabel, setNewTaskLabel] = useState<string>("");

  return (
    <div
      className={
        "my-2 mr-[40px] " +
        (taskTree.id === rootId ? "ml-[4.5rem]" : "ml-[6.5rem]")
      }
    >
      <input
        type="text"
        value={newTaskLabel}
        className="
          content_placeholder flex-1
          break-all
          px-[8px]
          h-8
          rounded-[6px]
          border-0
          outline-none
          text-[14px]
          size-full
        bg-gray-200"
        onChange={(e) => setNewTaskLabel(e.target.value)}
        placeholder={
          taskTree.id === rootId
            ? "チェック項目を追加する..."
            : "サブチェック項目を追加する..."
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            // エンターでタスクを追加する
            if (newTaskLabel.trim()) {
              updateTaskTree(setTaskTree, taskTree.id, "children", [
                ...taskTree.children,
                { ...initTask(), label: newTaskLabel.trim() },
              ]);
              setNewTaskLabel("");
            }
          }
        }}
      />
    </div>
  );
};

export default AddTask;
