export type ITaskStatus = "backlog" | "todo" | "in progress" | "test" | "done";

export type ITask = {
  id: string;
  title: string;
  status: ITaskStatus | string;
  createdAt: Date;
  deletedAt: Date | null;
};

export type IBoard = {
  id: string;
  name: string;
  tasks: ITask[];
};
