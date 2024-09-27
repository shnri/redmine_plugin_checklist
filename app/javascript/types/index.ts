export interface TaskTree {
  id: string;
  label: string;
  checked: boolean;
  isLayerOpen: boolean;
  children: TaskTree[];
}
