export interface TaskTree {
  taskId: string;
  label: string;
  checked: boolean;
  isLayerOpen: boolean;
  position: number;
  children: TaskTree[];
}
