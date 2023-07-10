"use client";

import { DetailedHTMLProps, InputHTMLAttributes, useState } from "react";

import { useTaskStore } from "../model";

type TaskInputProps = {
  boardId: string;
  taskId?: string;
  inputStyle?: string;
  onEdit?: () => void;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const TaskInput: React.FC<TaskInputProps> = ({
  boardId,
  taskId,
  inputStyle,
  defaultValue,
  onEdit,
  ...props
}) => {
  const [taskTitle, setTaskTitle] = useState<string>(
    defaultValue?.toString() ?? ""
  );
  const taskStore = useTaskStore();

  const handleAddOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    if (taskId) {
      taskStore.updateTask(taskId, boardId, {
        title: taskTitle,
      });
      onEdit && onEdit();
    } else {
      taskStore.addTask(taskTitle, boardId);
    }

    setTaskTitle("");
  };

  return (
    <form onSubmit={handleAddOrUpdateTask} className="flex w-full">
      <input
        {...props}
        type="text"
        className={inputStyle}
        value={taskTitle}
        placeholder="Task title..."
        onChange={(e) => setTaskTitle(e.target.value)}
      />
    </form>
  );
};
