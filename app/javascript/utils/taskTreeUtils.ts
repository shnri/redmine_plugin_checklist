import { TaskTree } from "../types";

// 指定したIDを持つタスクの親を取得する
export const findParentTask = (
    root: TaskTree,
    targetId: string,
    parent: TaskTree | null = null
  ): TaskTree | null => {
    if (root.taskId === targetId) {
      return parent;
    } else if (root.children) {
      for (const child of root.children) {
        const result = findParentTask(child, targetId, root);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };
  
  // 指定したIDを持つタスクを取得する
  export const findTaskById = (
    root: TaskTree,
    targetId: string
  ): TaskTree | null => {
    if (root.taskId === targetId) {
      return root;
    } else if (root.children) {
      for (const child of root.children) {
        const result = findTaskById(child, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };