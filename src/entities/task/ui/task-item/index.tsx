import clsx from "clsx";
import {
  useState,
  type PropsWithChildren,
  Fragment,
  MouseEvent,
  DetailedHTMLProps,
  HTMLAttributes,
} from "react";
import {
  CloseOutlined,
  HolderOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { useTaskStore } from "~/features/tasks/model";
import { TaskInput } from "~/features/tasks";

import { type ITask } from "../../model/types";
import styles from "./styles.module.css";

type TaskItemProps = {
  task: ITask;
  boardId: string;
  index: number;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const TaskItem = ({
  task,
  boardId,
  index,
  className,
  ...props
}: PropsWithChildren<TaskItemProps>) => {
  const [editMode, setEditMode] = useState(false);

  const taskStore = useTaskStore();

  const handleDeleteTask = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    taskStore.deleteTask(task.id, boardId);
  };

  const handleToggleEditMode = (e?: MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    setEditMode((prev) => !prev);
  };

  return (
    <div
      {...props}
      className={clsx(styles.Task_card, className)}
      onPointerDown={
        editMode
          ? (e) => {
              e.stopPropagation();
            }
          : props.onPointerDown
      }
    >
      {editMode ? (
        <Fragment>
          <TaskInput
            boardId={task.status}
            taskId={task.id}
            autoFocus
            onEdit={() => handleToggleEditMode()}
            defaultValue={task.title}
            inputStyle="bg-transparent focus-visible:outline-none w-full block"
          />
          <button
            className="inline-flex items-center w-[35px] h-[35px] justify-center p-1"
            onClick={handleToggleEditMode}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <CloseOutlined />
          </button>
        </Fragment>
      ) : (
        <Fragment>
          <button
            className="inline-flex items-center flex-shrink-0 w-[35px] h-[35px] justify-center p-1"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <HolderOutlined />
          </button>
          <div className="pr-2"></div>
          <div className="flex-grow break-words break-all">{task.title}</div>
          <div className="pr-2"></div>

          <div className="flex-shrink-0">
            <button
              className="inline-flex w-[35px] h-[35px] items-center justify-center p-1 rounded-md "
              onClick={handleToggleEditMode}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <EditOutlined />
            </button>
            <div className="inline pr-1"></div>
            <button
              className="inline-flex w-[35px] h-[35px] text-red-400 items-center justify-center p-1 rounded-md "
              onClick={handleDeleteTask}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <DeleteOutlined />
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
};
