import { nanoid } from "nanoid";
import { action, makeAutoObservable, observable } from "mobx";

import { ITask, IBoard } from "~/entities/task";

class TaskStore {
  taskItems: IBoard[] = [];

  constructor() {
    makeAutoObservable(this, {
      taskItems: observable,
      addTask: action,
      deleteTask: action,
      transferTask: action,
      updateTask: action,
    });
  }

  init() {
    this.taskItems = [
      {
        id: "backlog",
        name: "Backlog",
        tasks: [
          {
            id: nanoid(),
            createdAt: new Date(),
            status: "backlog",
            title: "Hello world",
            deletedAt: null,
          },
        ],
      },
      {
        id: "done",
        name: "Done",
        tasks: [],
      },
      {
        id: "in progress",
        name: "In progress",
        tasks: [],
      },
      {
        id: "todo",
        name: "To do",
        tasks: [],
      },
      {
        id: "test",
        name: "Test",
        tasks: [],
      },
    ];
  }

  addTask(title: string, boardId: string) {
    const task: ITask = {
      id: nanoid(),
      title,
      status: boardId,
      createdAt: new Date(),
      deletedAt: null,
    };
    const boardIndex = this.taskItems.findIndex(
      (board) => board.id === boardId
    );

    this.taskItems[boardIndex].tasks.push(task);
  }

  updateTask(
    taskId: string,
    boardId: string,
    { title, status }: Partial<ITask>
  ) {
    const boardIndex = this.taskItems.findIndex(
      (board) => board.id === boardId
    );

    const tasks = this.taskItems[boardIndex].tasks.map((task) => {
      if (task.id === taskId) {
        task.title = title ?? task.title;
        task.status = status ?? task.status;
      }
      return task;
    });

    this.taskItems[boardIndex].tasks = tasks;
  }

  transferTask(
    taskId: string,
    prevBoardId: string,
    boardId: string,
    destionationIndex?: number
  ) {
    const prevBoardIndex = this.taskItems.findIndex(
      (board) => board.id === prevBoardId
    );
    const boardIndex = this.taskItems.findIndex(
      (board) => board.id === boardId
    );

    const taskIndexOnPrevBoard = this.taskItems[prevBoardIndex].tasks.findIndex(
      (task) => task.id === taskId
    );
    const task = this.taskItems[prevBoardIndex].tasks.find(
      (task) => task.id === taskId
    );
    if (task) {
      this.taskItems[prevBoardIndex].tasks.splice(taskIndexOnPrevBoard, 1);

      if (destionationIndex !== undefined) {
        this.taskItems[boardIndex].tasks.splice(destionationIndex, 0, task);
      } else {
        this.taskItems[boardIndex].tasks.push(task);
      }
    }
  }

  reorderTasks(sourceIndex: number, destinationIndex: number, boardId: string) {
    const boardIndex = this.taskItems.findIndex(
      (board) => board.id === boardId
    );
    const currentBoardTasks =
      this.taskItems.find((board) => board.id === boardId)?.tasks ?? [];
    const updatedTasks = [...currentBoardTasks];
    const [removed] = updatedTasks.splice(sourceIndex, 1);
    updatedTasks.splice(destinationIndex, 0, removed);

    this.taskItems[boardIndex].tasks = updatedTasks;
  }

  deleteTask(taskId: string, boardId: string) {
    const boardIndex = this.taskItems.findIndex(
      (board) => board.id === boardId
    );

    this.taskItems[boardIndex].tasks = this.taskItems[boardIndex].tasks.filter(
      (task) => task.id !== taskId
    );
  }
}

export const taskStore = new TaskStore();
export const useTaskStore = () => taskStore;
