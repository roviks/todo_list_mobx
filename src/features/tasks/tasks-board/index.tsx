"use client";

import clsx from "clsx";
import {
  DetailedHTMLProps,
  DragEvent,
  HTMLAttributes,
  useRef,
  useState,
} from "react";
import { observer } from "mobx-react";

import { TaskItem } from "~/entities/task";
import { taskStore } from "../model";
import { TaskInput } from "../task-input";
import { useTasksDnDStore } from "~/features/tasks-dnd/model";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  boardTitle: JSX.Element;
  boardId: string;
};

export const TasksBoard = observer(
  ({ boardTitle, boardId, className }: Props) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const destinationIndex = useRef<number>();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const taskDnDStore = useTasksDnDStore();

    const taskList =
      taskStore.taskItems.find((board) => board.id === boardId)?.tasks ?? [];

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(true);
      const children = [...boardRef.current!.querySelectorAll(".tasks > *")];

      let nextSibling = children.find((child) => {
        let _child = child as HTMLElement;

        const { top } = e.currentTarget.getBoundingClientRect();

        return e.clientY - top <= _child.offsetTop + _child.offsetHeight / 2;
      });

      const nextSiblingIndex = nextSibling?.getAttribute("data-index") ?? null;
      destinationIndex.current = nextSiblingIndex
        ? Number(nextSiblingIndex)
        : undefined;
    };

    const handleDragLeave = (e: DragEvent) => {
      setIsDraggingOver(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      setIsDraggingOver(false);

      const taskId = taskDnDStore.taskId;
      const prevBoardId = taskDnDStore.boardId;
      const sourceIndex = taskDnDStore.draggedIndex;

      taskDnDStore.clearDraggedItem();
      if (prevBoardId === boardId) {
        if (sourceIndex === null || destinationIndex.current === undefined)
          return;
        taskStore.reorderTasks(sourceIndex, destinationIndex.current, boardId);
        return;
      }
      if (taskId === null || prevBoardId === null) return;

      taskStore.transferTask(
        taskId,
        prevBoardId,
        boardId,
        destinationIndex.current
      );
    };

    return (
      <div
        ref={boardRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "flex flex-col transition relative rounded-lg border-2 border-dashed border-transparent bg-white/10",
          isDraggingOver ? "border-white" : "",
          className
        )}
      >
        <div className="pt-2 pl-2">{boardTitle}</div>

        <div className="tasks flex-grow mt-5">
          {taskList.length ? (
            taskList.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                boardId={boardId}
                index={i}
                data-index={i}
              />
            ))
          ) : (
            <div className="text-textColor05 h-full flex justify-center items-center text-center">
              No tasks
            </div>
          )}
        </div>

        <div className="bg-taskCardColor px-5">
          <TaskInput
            boardId={boardId}
            inputStyle="w-full block py-2 rounded-md transition bg-white/0 focus-visible:outline-none"
          />
        </div>
      </div>
    );
  }
);
