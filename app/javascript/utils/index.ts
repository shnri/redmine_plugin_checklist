import { TaskTree } from "../types";

/**
 * 指定したIDを持つタスクツリー内のオブジェクトのキーと値を更新する関数
 *
 * @param setTaskTree - タスクツリーの更新関数（Reactのstateを更新するための関数）
 * @param targetId - 更新したいタスクのID
 * @param key - 更新するプロパティ名（TaskTree内のキー）
 * @param value - 更新する値（指定されたキーの新しい値）
 */
export const updateTaskTree = <K extends keyof TaskTree>(
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetId: string,
  key: K,
  value: TaskTree[K]
) => {
  const update = <K extends keyof TaskTree>(
    taskTree: TaskTree,
    targetId: string,
    key: K,
    value: TaskTree[K]
  ): TaskTree => {
    // IDが一致する場合は、値を更新する
    if (taskTree.id === targetId) {
      return {
        ...taskTree,
        [key]: value,
      };
    }

    // 子要素がある場合、再帰的に更新する
    if (taskTree.children.length > 0) {
      return {
        ...taskTree,
        children: taskTree.children.map((child) =>
          update(child, targetId, key, value)
        ),
      };
    }

    // 何も更新がなければ、そのまま返す
    return taskTree;
  };

  setTaskTree((prevTaskTree) => update(prevTaskTree, targetId, key, value));
};

/**
 * targetIdで指定されたオブジェクトをタスクツリーから削除する関数
 *
 * @param setTaskTree - タスクツリーの更新関数（Reactのstateを更新するための関数）
 * @param targetId - 削除したいオブジェクトのID
 */
export const deleteTaskTreeItem = (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetId: string
) => {
  /**
   * 再帰的にタスクツリーを検索し、指定されたIDのオブジェクトを削除する
   *
   * @param taskTree - 現在のタスクツリー
   * @param targetId - 削除したいオブジェクトのID
   * @returns 更新されたタスクツリー（対象が見つからなければ元のツリーを返す）
   */
  const remove = (taskTree: TaskTree, targetId: string): TaskTree | null => {
    // タスクツリーのIDが一致した場合はnullを返す（このオブジェクトを削除）
    if (taskTree.id === targetId) {
      return null;
    }

    // 子要素がある場合は、再帰的に削除を行う
    if (taskTree.children.length > 0) {
      const updatedChildren = taskTree.children
        .map((child) => remove(child, targetId))
        .filter((child) => child !== null) as TaskTree[]; // nullを削除

      return {
        ...taskTree,
        children: updatedChildren,
      };
    }

    // 何も削除されなければ、そのまま返す
    return taskTree;
  };

  // ReactのsetState関数でタスクツリーを更新
  setTaskTree((prevTaskTree) => {
    const updatedTaskTree = remove(prevTaskTree, targetId);
    return updatedTaskTree ?? prevTaskTree;
  });
};

// 指定したIDを持つタスクの親を取得する
export const findParentTask = (
  root: TaskTree,
  targetId: string,
  parent: TaskTree | null = null
): TaskTree | null => {
  if (root.id === targetId) {
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
  if (root.id === targetId) {
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
