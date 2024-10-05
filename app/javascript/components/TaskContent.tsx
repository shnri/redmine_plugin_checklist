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
import { deleteTaskTreeItem, updateTaskTree } from "../utils/taskTreeActions";
import AddTask from "./AddTask";
import { rootId } from "./TaskList";
import { IconButton } from "@mui/material";
import { useTaskTree } from "./TaskTreeProvider";
import { deleteTask, updateTaskList } from "../utils/apiHelper";

const TaskContent: React.FC<{
  taskTree: TaskTree;
  isOverlay?: boolean;
  style?: React.CSSProperties;
}> = ({ taskTree: myTaskTree, isOverlay = false, style = {} }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: myTaskTree.taskId });

  const { taskTree, setTaskTree } = useTaskTree();

  const baseStyle: React.CSSProperties = {
    borderColor: "#afbbc0",
    opacity: isDragging || isOverlay ? 0.5 : 1,
  };

  if (!isOverlay) {
    baseStyle.transform = CSS.Transform.toString(transform);
    baseStyle.transition = transition;
  }

  useEffect(() => {
    if (myTaskTree.children.length > 0) {
      const allChecked =
        myTaskTree.children.find((e) => !e.checked) === undefined;
      // サブタスクがすべてチェック済であれば、タスクにチェックを入れる
      // サブタスクに未チェックがあれば、タスクのチェックを外す
      if (myTaskTree.checked !== allChecked) {
        updateTaskTree(setTaskTree, myTaskTree.taskId, "checked", allChecked);
      }
    }
  }, [myTaskTree, setTaskTree]);

  // contentEditableな要素の参照
  const editableRef = useRef<HTMLDivElement>(null);

  // 編集終了時にテキストを保存
  const handleBlur = () => {
    if (editableRef.current) {
      const newText = editableRef.current.innerText;
      updateTaskTree(setTaskTree, myTaskTree.taskId, "label", newText);
      updateTaskList(setTaskTree, taskTree, [
        {
          ...myTaskTree,
          label: newText,
        },
      ]);
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
    deleteTaskTreeItem(setTaskTree, myTaskTree.taskId);
  };

  const handleLayerOpen = (isLayerOpen: boolean) => {
    updateTaskTree(setTaskTree, myTaskTree.taskId, "isLayerOpen", isLayerOpen);
    updateTaskList(setTaskTree, taskTree, [
      {
        ...myTaskTree,
        isLayerOpen: isLayerOpen,
      },
    ]);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{ ...baseStyle, ...style }}
      className="rounded-md"
    >
      {myTaskTree.taskId === rootId ? (
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
            {myTaskTree.isLayerOpen ? (
              <KeyboardArrowDownIcon
                onClick={() => {
                  handleLayerOpen(false);
                }}
              />
            ) : (
              <KeyboardArrowRightIcon
                onClick={() => {
                  handleLayerOpen(true);
                }}
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
                opacity: myTaskTree.children.length > 0 ? 0.7 : 1,
              }}
              disabled={myTaskTree.children.length > 0}
              onClick={() => {
                updateTaskTree(
                  setTaskTree,
                  myTaskTree.taskId,
                  "checked",
                  !myTaskTree.checked
                );
                updateTaskList(setTaskTree, taskTree, [
                  {
                    ...myTaskTree,
                    checked: !myTaskTree.checked,
                  },
                ]);
              }}
            >
              {myTaskTree.checked ? (
                <CheckCircleIcon className="text-green-700" />
              ) : (
                <CheckCircleOutlineIcon className="text-gray-400" />
              )}
            </IconButton>
          </div>

          <div
            ref={editableRef}
            className={
              (myTaskTree.checked ? "line-through text-gray-500 " : "") +
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
            <div className="  h-8 py-[6px] border-b-2">{myTaskTree.label}</div>
          </div>
          <DeleteForeverIcon
            className={"text-gray-400 " + (isHovered ? "" : "invisible")}
            onClick={() => {
              const shouldDelete = window.confirm(
                myTaskTree.label + "を削除しますか？"
              );
              if (shouldDelete) {
                handleDelete();
                deleteTask(setTaskTree, myTaskTree.taskId);
              }
            }}
          />
        </div>
      )}
      {myTaskTree.children && myTaskTree.isLayerOpen && (
        <SortableContext
          items={myTaskTree.children.map((child) => child.taskId)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={
              (myTaskTree.taskId === rootId ? "" : "ml-8 ") +
              (myTaskTree.children.length > 0 ? " mb-3" : "")
            }
          >
            {myTaskTree.children.map((child) => (
              <TaskContent key={child.taskId} taskTree={child} />
            ))}
          </div>
          <AddTask taskTree={myTaskTree} />
        </SortableContext>
      )}
    </div>
  );
};

export default TaskContent;
