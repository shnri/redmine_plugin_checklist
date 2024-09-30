import { findParentTask } from ".";
import { TaskTree } from "../types";

interface request {
  method: string;
  headers?: {
    "Content-Type": string;
    "X-Redmine-API-Key"?: string;
  };
  body?: string;
}

const getIssueId = () => {
  const path = window.location.pathname;
  const issueId = path.split("/").pop();

  return issueId;
};

const rollback = (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>
) => {
  fetchData(setTaskTree);
};

export const createTask = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetTaskTree: TaskTree,
  parentId: string
) => {
  try {
    const requestInfo: request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checklist_item: {
          ...targetTaskTree,
          parentId: parentId,
        },
      }),
    };

    const response = await fetch(
      `/issues/${getIssueId()}/checklist_items.json`,
      requestInfo
    );

    if (!response.ok) {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error(error);
    rollback(setTaskTree);
  }
};

export const deleteTask = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetTaskId: string
) => {
  try {
    const response = await fetch(
      `/issues/${getIssueId()}/checklist_items/${targetTaskId}.json`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  } catch (error) {
    console.error(error);
    rollback(setTaskTree);
  }
};

export const updateTaskList = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  taskTree: TaskTree,
  targetTaskTreeList: TaskTree[]
) => {
  const data = targetTaskTreeList.map((targetTaskTree) => ({
    ...targetTaskTree,
    parentId: findParentTask(taskTree, targetTaskTree.taskId ?? "")?.taskId,
  }));
  try {
    const requestInfo: request = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checklist_items: { data },
      }),
    };

    const response = await fetch(
      `/issues/${getIssueId()}/checklist_items/bulk_update.json`,
      requestInfo
    );

    if (!response.ok) {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error(error);
    rollback(setTaskTree);
  }
};

// 新しいデータをAPIから取得し、stateを更新する
export const fetchData = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>
) => {
  const issueId = getIssueId();
  try {
    if (issueId) {
      fetch(`/issues/${issueId}/checklist_items.json`)
        .then((response) => response.json())
        .then((data) => {
          const sortTaskNode = (taskTree: TaskTree): TaskTree => {
            if (!taskTree.children || taskTree.children.length === 0) {
              return taskTree;
            }

            // childrenが存在する場合、それを再帰的にソート
            const sortedChildren = taskTree.children
              .sort((a, b) => a.position - b.position)
              .map((child) => sortTaskNode(child));

            // 元のノードをコピーし、ソートされたchildrenを持たせる
            return {
              ...taskTree,
              children: sortedChildren,
            };
          };

          if (data.length !== 0) {
            setTaskTree(sortTaskNode(data[0])); // データを状態に保存
          }
        });
    }
  } catch (error) {
    console.error("Error fetching latest data:", error);
    throw error; // エラーをキャッチした側で扱う
  }
};
