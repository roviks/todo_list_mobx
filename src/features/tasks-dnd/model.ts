import { action, makeAutoObservable, observable } from "mobx";

class TasksDnD {
  taskId: string | null = null;
  boardId: string | null = null;
  draggedIndex: number | null = null;

  constructor() {
    makeAutoObservable(this, {
      boardId: observable,
      taskId: observable,
      initDraggedItem: action,
      clearDraggedItem: action,
    });
  }

  initDraggedItem(taskId: string, boardId: string, draggedIndex: number) {
    this.taskId = taskId;
    this.boardId = boardId;
    this.draggedIndex = draggedIndex;
  }

  clearDraggedItem() {
    this.taskId = null;
    this.boardId = null;
    this.draggedIndex = null;
  }
}

export const tasksDnD = new TasksDnD();
export const useTasksDnDStore = () => tasksDnD;
