export interface TaskTree {
  taskId: string; // UUIDを使ったタスクID
  label: string; // チェックリストの項目名
  checked: boolean; // 完了済みかどうか
  isLayerOpen: boolean; // 項目が展開されているか
  position: number; // 項目の順序
  children: TaskTree[]; // サブタスク
}