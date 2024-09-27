import React, { useEffect, useRef, useState } from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { TaskTree } from "../types";
import { deleteTaskTreeItem, updateTaskTree } from "../utils";
import AddTask from "./AddTask";
import { rootId } from "./TaskList";
import { IconButton } from "@mui/material";

const TaskContent: React.FC<{
  taskTree: TaskTree;
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>;
  isOverlay?: boolean;
  style?: React.CSSProperties;
}> = ({ taskTree, setTaskTree, isOverlay = false, style = {} }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskTree.id });

  const baseStyle: React.CSSProperties = {
    borderColor: "#afbbc0",
    backgroundColor: "white",
    opacity: isDragging || isOverlay ? 0.5 : 1,
  };

  if (!isOverlay) {
    baseStyle.transform = CSS.Transform.toString(transform);
    baseStyle.transition = transition;
  }

  useEffect(() => {
    if (taskTree.children.length > 0) {
      const allChecked =
        taskTree.children.find((e) => !e.checked) === undefined;
      // サブタスクがすべてチェック済であれば、タスクにチェックを入れる
      // サブタスクに未チェックがあれば、タスクのチェックを外す
      if (taskTree.checked !== allChecked) {
        updateTaskTree(setTaskTree, taskTree.id, "checked", allChecked);
      }
    }
  }, [taskTree, setTaskTree]);

  // contentEditableな要素の参照
  const editableRef = useRef<HTMLDivElement>(null);

  // 編集終了時にテキストを保存
  const handleBlur = () => {
    if (editableRef.current) {
      const newText = editableRef.current.innerText;
      updateTaskTree(setTaskTree, taskTree.id, "label", newText);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDelete = () => {
    deleteTaskTreeItem(setTaskTree, taskTree.id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ ...baseStyle, ...style }}
      className="rounded-md"
    >
      {taskTree.id === rootId ? (
        <></>
      ) : (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="
        rounded-md
        box-border
        flex
        flex-row
        gap-2
        items-center
        py-[6px]
        px-[8px]
        bg-white"
        >
          <div {...listeners}>
            {/* ドラッグインジケーター */}
            <DragIndicatorIcon
              className={
                "cursor-grab text-gray-400 " + (!isHovered ? "invisible" : "")
              }
            />
          </div>
          <div className={"text-gray-400 " + (!isHovered ? "invisible" : "")}>
            {taskTree.isLayerOpen ? (
              <KeyboardArrowDownIcon
                onClick={() =>
                  // 階層を開く
                  updateTaskTree(setTaskTree, taskTree.id, "isLayerOpen", false)
                }
              />
            ) : (
              <KeyboardArrowRightIcon
                onClick={() =>
                  // 階層を閉じる
                  updateTaskTree(setTaskTree, taskTree.id, "isLayerOpen", true)
                }
              />
            )}
          </div>
          <div>
            <div />
            {/* チェックアイコン 
                サブタスクがある場合は押せない
            */}
            <IconButton
              style={{
                opacity: taskTree.children.length > 0 ? 0.7 : 1,
              }}
              disabled={taskTree.children.length > 0}
              onClick={() =>
                // ON->OFF
                updateTaskTree(
                  setTaskTree,
                  taskTree.id,
                  "checked",
                  !taskTree.checked
                )
              }
            >
              {taskTree.checked ? (
                <CheckCircleIcon className="text-green-700" />
              ) : (
                <CheckCircleOutlineIcon className="text-gray-400" />
              )}
            </IconButton>
          </div>

          <div
            ref={editableRef}
            className={
              (taskTree.checked ? "line-through text-gray-500 " : "") +
              "content_placeholder flex-1 break-all px-[8px] h-8 rounded-[6px] border-0 outline-none text-[14px] focus:bg-gray-200"
            }
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleBlur(); // 編集確定
                editableRef.current?.blur(); // フォーカスを外して編集モードを終了
              }
            }}
            style={{ cursor: "text" }}
          >
            <div className="  h-8 py-[6px] border-b-2">{taskTree.label}</div>
          </div>
          <DeleteForeverIcon
            className={"text-gray-400 " + (isHovered ? "" : "invisible")}
            onClick={() => {
              const shouldDelete = window.confirm(
                taskTree.label + "を削除しますか？"
              );
              if (shouldDelete) {
                handleDelete();
              }
            }}
          />
        </div>
      )}
      {taskTree.children && taskTree.isLayerOpen && (
        <SortableContext
          items={taskTree.children.map((child) => child.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={
              (taskTree.id === rootId ? "" : "ml-8 ") +
              (taskTree.children.length > 0 ? " mb-3" : "")
            }
          >
            {taskTree.children.map((child) => (
              <TaskContent
                key={child.id}
                taskTree={child}
                setTaskTree={setTaskTree}
              />
            ))}
          </div>
          <AddTask taskTree={taskTree} setTaskTree={setTaskTree} />
        </SortableContext>
      )}
    </div>
  );
};

export default TaskContent;
