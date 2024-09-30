import React, { useState } from "react";
import { TaskTree } from "../types";
import { updateTaskTree } from "../utils";
import { rootId } from "./TaskList";
import { useTaskTree } from "./TaskTreeProvider";
import { createTask } from "../utils/apiHelper";
import { v4 as uuidv4 } from "uuid";

const initTask = (): TaskTree => ({
  taskId: uuidv4(),
  label: "",
  checked: false,
  isLayerOpen: false,
  position: 0,
  children: [],
});

const AddTask: React.FC<{
  taskTree: TaskTree;
}> = ({ taskTree: myTaskTree }) => {
  const { setTaskTree } = useTaskTree();
  const [newTaskLabel, setNewTaskLabel] = useState<string>("");

  return (
    <div
      className={
        "my-2 mr-[40px] " +
        (myTaskTree.taskId === rootId ? "ml-[4.5rem]" : "ml-[6.5rem]")
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
          myTaskTree.taskId === rootId
            ? "チェック項目を追加する..."
            : "サブチェック項目を追加する..."
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            // エンターでタスクを追加する
            const newTask = {
              ...initTask(),
              position:
                myTaskTree.children.length > 0
                  ? Math.max(
                      ...myTaskTree.children.map((item) => item.position)
                    ) + 1
                  : 0,
              label: newTaskLabel.trim(),
            };
            if (newTaskLabel.trim()) {
              updateTaskTree(setTaskTree, myTaskTree.taskId, "children", [
                ...myTaskTree.children,
                newTask,
              ]);
              setNewTaskLabel("");
              createTask(setTaskTree, newTask, myTaskTree.taskId);
            }
          }
        }}
      />
    </div>
  );
};

export default AddTask;
