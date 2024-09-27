import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import TaskContent from "./TaskContent";
import { TaskTree } from "../types";
import { findParentTask, findTaskById } from "../utils";

export const rootId = "root";

const TaskList: React.FC = () => {
  const [taskTree, setTaskTree] = useState<TaskTree>({
    id: rootId,
    label: "",
    checked: false,
    isLayerOpen: true,
    children: [
      // {
      //   id: "1",
      //   label: "Main Task 1",
      //   checked: false,
      //   isLayerOpen: false,
      //   children: [
      //     {
      //       id: "3",
      //       label: "Subtask 1.1",
      //       checked: false,
      //       isLayerOpen: false,
      //       children: [
      //         {
      //           id: "7",
      //           label: "SubSubtask 1.1.1",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //         {
      //           id: "8",
      //           label: "SubSubtask 1.1.2",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //       ],
      //     },
      //     {
      //       id: "4",
      //       label: "Subtask 1.2",
      //       checked: false,
      //       isLayerOpen: false,
      //       children: [
      //         {
      //           id: "9",
      //           label: "SubSubtask 1.2.1",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //         {
      //           id: "10",
      //           label: "SubSubtask 1.2.2",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: "2",
      //   label: "Main Task 2",
      //   checked: false,
      //   isLayerOpen: false,
      //   children: [
      //     {
      //       id: "5",
      //       label: "Subtask 2.1",
      //       checked: false,
      //       isLayerOpen: false,
      //       children: [
      //         {
      //           id: "11",
      //           label: "SubSubtask 2.1.1",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //         {
      //           id: "12",
      //           label: "SubSubtask 2.1.2",
      //           checked: false,
      //           isLayerOpen: false,
      //           children: [],
      //         },
      //       ],
      //     },
      //     {
      //       id: "6",
      //       label: "Subtask 2.2",
      //       checked: false,
      //       isLayerOpen: false,
      //       children: [],
      //     },
      //   ],
      // },
    ],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastValidId, setLastValidId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    setActiveId(activeId);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const parentInData = findParentTask(taskTree, active.id.toString());

      if (parentInData && parentInData.children) {
        const ids = parentInData.children.map((child) => child.id);
        if (ids.includes(over.id.toString())) {
          setLastValidId(over.id.toString());
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    const sourceId = String(active.id);

    // ドロップ先がない場合でも処理を行う
    const destinationId = lastValidId;

    // ソースとデスティネーションの親を取得
    const sourceParent = findParentTask(taskTree, sourceId);

    if (sourceParent && sourceParent.children) {
      if (destinationId !== null) {
        const destinationParent = findParentTask(taskTree, destinationId);

        // 親が存在し、親が同じ場合のみ移動を許可
        if (
          destinationParent &&
          sourceParent.id === destinationParent.id &&
          sourceId !== destinationId
        ) {
          setTaskTree((prevData) => {
            const newData = { ...prevData };
            const parentInData = findTaskById(newData, sourceParent.id);

            if (parentInData && parentInData.children) {
              const ids = parentInData.children.map((child) => child.id);
              const oldIndex = ids.indexOf(sourceId);
              const newIndex = ids.indexOf(destinationId);

              parentInData.children = arrayMove(
                parentInData.children,
                oldIndex,
                newIndex
              );
            }

            return newData;
          });
        }

        setActiveId(null);
      }
    }
  };

  const activeTask =
    activeId !== null ? findTaskById(taskTree, activeId) : null;

  return (
    <div>
      <div className="m-4 border-2 rounded-md">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <TaskContent
            key={taskTree.id}
            taskTree={taskTree}
            setTaskTree={setTaskTree}
          />
          <DragOverlay>
            {activeTask && (
              <TaskContent
                taskTree={activeTask}
                setTaskTree={setTaskTree}
                isOverlay
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
