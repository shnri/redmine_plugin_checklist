import { findParentTask } from "./taskTreeUtils";

import { TaskTree } from "../types";

const getIssueEndpoint = (issueId: string, path: string = ""): string => {
  const API_BASE_URL = "/issues";
  return `${API_BASE_URL}/${issueId}/checklist_items${path}`;
};

const getRequestHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
});

interface ResponseMsg {
  message: string;
  task_id: string;
}

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(endpoint, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }
  const data = await response.json();
  return data;
};

const getIssueId = (): string => {
  const path = window.location.pathname;
  const issueId = path.split("/").pop();
  if (!issueId) {
    throw new Error("Issue ID not found in the URL");
  }
  return issueId;
};

const rollback = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>
) => {
  try {
    await fetchData(setTaskTree);
    window.alert("更新に失敗したため、変更を元の状態に戻します。");
  } catch (error) {
    console.error(error);
    window.alert("更新が失敗しました。ネットワークエラーの可能性があります。もう一度試すか、時間をおいて再度お試しください。");
  }
};

export const createTask = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetTaskTree: TaskTree,
  parentId: string
) => {
  try {
    const body = {
      checklist_item: {
        ...targetTaskTree,
        parentId: parentId,
      },
    };

    await apiRequest<ResponseMsg>(getIssueEndpoint(getIssueId()) + ".json", {
      method: "POST",
      headers: getRequestHeaders(),
      body: JSON.stringify(body),
    });

    await fetchData(setTaskTree); // 状態を最新に更新
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
    await apiRequest<ResponseMsg>(
      getIssueEndpoint(getIssueId(), `/${targetTaskId}.json`),
      {
        method: "DELETE",
        headers: getRequestHeaders(),
      }
    );

    await fetchData(setTaskTree); // 状態を最新に更新
  } catch (error) {
    console.error(error);
    rollback(setTaskTree);
  }
};

export const updateTaskList = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  taskTree: TaskTree,
  targetTaskTreeList: TaskTree[]
): Promise<void> => {
  const data = targetTaskTreeList.map((targetTaskTree) => ({
    ...targetTaskTree,
    parentId: findParentTask(taskTree, targetTaskTree.taskId ?? "")?.taskId,
  }));
  try {
    const body = {
      checklist_items: { data },
    };
    await apiRequest<ResponseMsg>(
      getIssueEndpoint(getIssueId(), "/bulk_update.json"),
      {
        method: "PUT",
        headers: getRequestHeaders(),
        body: JSON.stringify(body),
      }
    );

    await fetchData(setTaskTree); // 状態を最新に更新
  } catch (error) {
    console.error(error);
    rollback(setTaskTree);
  }
};

// 新しいデータをAPIから取得し、stateを更新する
export const fetchData = async (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>
) => {
  try {
    const issueId = getIssueId();
    const data = await apiRequest<TaskTree[]>(
      getIssueEndpoint(issueId) + ".json",
      {
        method: "GET",
        headers: getRequestHeaders(),
      }
    );

    const sortTaskNode = (taskTree: TaskTree): TaskTree => {
      if (!taskTree.children || taskTree.children.length === 0) {
        return taskTree;
      }

      // childrenが存在する場合、それを再帰的にソート
      const sortedChildren = taskTree.children
        .sort((a, b) => a.position - b.position)
        .map((child) => sortTaskNode(child));

      return {
        ...taskTree,
        children: sortedChildren,
      };
    };

    if (data.length !== 0) {
      setTaskTree(sortTaskNode(data[0]));
    }
  } catch (error) {
    console.error("Error fetching latest data:", error);
    throw error;
  }
};
