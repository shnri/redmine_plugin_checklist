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
import React, { useEffect, useState } from "react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import TaskContent from "./TaskContent";
import { findParentTask, findTaskById } from "../utils";
import { useTaskTree } from "./TaskTreeProvider";
import { fetchData, updateTaskList } from "../utils/apiHelper";

export const rootId = "root";

const TaskList: React.FC = () => {
  const { taskTree, setTaskTree } = useTaskTree();

  useEffect(() => {
    fetchData(setTaskTree);
  }, [setTaskTree]);

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
        const ids = parentInData.children.map((child) => child.taskId);
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
          sourceParent.taskId === destinationParent.taskId &&
          sourceId !== destinationId
        ) {
          const newData = { ...taskTree };
          const parentInData = findTaskById(newData, sourceParent.taskId);

          if (parentInData && parentInData.children) {
            const ids = parentInData.children.map((child) => child.taskId);
            const oldIndex = ids.indexOf(sourceId);
            const newIndex = ids.indexOf(destinationId);

            parentInData.children = arrayMove(
              parentInData.children,
              oldIndex,
              newIndex
            );
          }

          newData.children.forEach((item, index) => {
            item.position = index;
          });

          setTaskTree(newData);
          updateTaskList(setTaskTree, taskTree, newData.children);
        }

        setActiveId(null);
      }
    }
  };

  const activeTask =
    activeId !== null ? findTaskById(taskTree, activeId) : null;

  return (
    <div>
      <p>
        <strong>チェックリスト</strong>
      </p>
      <div className="my-2 border-2 rounded-md bg-white">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <TaskContent key={taskTree.taskId} taskTree={taskTree} />
          <DragOverlay>
            {activeTask && <TaskContent taskTree={activeTask} isOverlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
