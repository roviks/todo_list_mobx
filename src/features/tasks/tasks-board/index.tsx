import clsx from "clsx";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useRef,
  useEffect,
} from "react";
import { observer } from "mobx-react";

import { TaskItem } from "~/entities/task";
import { taskStore } from "../model";
import { TaskInput } from "../task-input";
import isMouseOverElementRect from "~/shared/util/is-mouse-over-element-rect";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  boardTitle: JSX.Element;
  boardId: string;
  index: number;
};

export const TasksBoard = observer(
  ({ boardTitle, boardId, className, index: boardIndex }: Props) => {
    const boardRef = useRef<HTMLDivElement>(null);
    const boardBoundingRect = useRef<DOMRect>();
    const tasksContainerRef = useRef<HTMLDivElement>(null);

    const taskList =
      taskStore.taskItems[boardIndex]?.tasks?.filter(
        (task) => task.deletedAt === null
      ) ?? [];

    const detectPressButton = (e: ReactPointerEvent) => {
      if ("buttons" in e) {
        return e.buttons === 1;
      }

      let button = (e as any).which || (e as any).button;

      return button === 1;
    };

    const initializeDnDContainer = (
      parentContainer: HTMLElement,
      index: number
    ) => {
      const items = [...parentContainer.childNodes] as HTMLElement[];

      const dragItem = items[index];
      const itemsBelowDragItem = items.slice(index + 1);
      const notDragItems = items.filter((_, i) => i !== index);

      const dragBoundingRect = dragItem.getBoundingClientRect();
      const marginBetweenItems = items[1]
        ? items[1].getBoundingClientRect().top -
          items[0].getBoundingClientRect().bottom
        : 0;

      const div = document.createElement("div");
      div.id = "drag-item-temp";
      div.style.width = dragBoundingRect.width + "px";
      div.style.height = dragBoundingRect.height + "px";
      div.style.pointerEvents = "none";

      dragItem.style.position = "fixed";
      dragItem.style.zIndex = "5000";
      dragItem.style.width = `${dragBoundingRect.width}px`;
      dragItem.style.height = `${dragBoundingRect.height}px`;
      dragItem.style.top = `${dragBoundingRect.top}px`;
      dragItem.style.left = `${dragBoundingRect.left}px`;
      dragItem.style.cursor = "grabbing";

      parentContainer.appendChild(div);

      const distance = dragBoundingRect.height + marginBetweenItems;

      itemsBelowDragItem.forEach((item) => {
        item.style.transform = `translateY(${distance}px)`;
      });

      return {
        items,
        notDragItems,
        currentDragItem: dragItem,
        distance,
        temporaryClonedElement: div,
      };
    };

    const onPointerUp = (e: any) => {
      console.log(" POINTER UP");

      document.body.onpointerup = null;
      document.body.onpointermove = null;

      document.body.releasePointerCapture(e.pointerId);
      document.body.classList.remove("ptr-events-none");
    };

    const handleDragItemStart = (e: ReactPointerEvent, index: number) => {
      if (!detectPressButton(e)) return;

      const sourceIndex = index;
      let destinationIndex: number | undefined;

      const container = tasksContainerRef.current;
      if (container === null) return;
      document.body.setPointerCapture(e.pointerId);

      document.body.classList.add("ptr-events-none");

      const {
        notDragItems,
        currentDragItem,
        distance,
        items,
        temporaryClonedElement,
      } = initializeDnDContainer(container, index);

      let x = e.clientX;
      let y = e.clientY;

      let boards: HTMLElement[] = [];
      let transferingBoardIndex: number | null = null;

      const dragMove = (e: PointerEvent) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        const boardRect = boardBoundingRect.current;

        if (!boardRect) return;

        const posX = mouseX - x;
        const posY = mouseY - y;

        const isOverlap = isMouseOverElementRect(boardRect, mouseX, mouseY);

        boards = [...document.querySelectorAll(".board")] as HTMLElement[];

        if (isOverlap) {
          notDragItems.forEach((item) => {
            const rect1 = currentDragItem.getBoundingClientRect();
            const rect2 = item.getBoundingClientRect();

            let isOverlapping =
              rect1.y < rect2.y + rect2.height / 2 &&
              rect1.y + rect1.height / 2 > rect2.y;

            if (isOverlapping) {
              if (item.getAttribute("style")) {
                item.style.transform = "";
                destinationIndex = ++index;
              } else {
                item.style.transform = `translateY(${distance}px)`;
                destinationIndex = --index;
              }
            }
          });

          boards.forEach((board) => {
            board.classList.remove("border-white");
          });

          transferingBoardIndex = null;
        } else {
          for (const board of boards) {
            const rect = board.getBoundingClientRect();

            if (isMouseOverElementRect(rect, mouseX, mouseY)) {
              board.classList.add("border-white");
              const boardIndex = board.getAttribute("data-board-index");
              transferingBoardIndex = boardIndex != null ? +boardIndex : null;
            } else {
              board.classList.remove("border-white");
            }
          }
        }

        currentDragItem.style.transform = `translate(${posX}px, ${posY}px)`;
      };

      const dragEnd = (e: PointerEvent) => {
        onPointerUp(e);

        currentDragItem.removeAttribute("style");
        container.removeChild(temporaryClonedElement);

        items.forEach((item) => item.removeAttribute("style"));

        boards.forEach((board) => {
          board.classList.remove("border-white");
        });

        if (destinationIndex != undefined) {
          taskStore.reorderTasks(sourceIndex, destinationIndex, boardId);
        }

        if (transferingBoardIndex != null) {
          const newBoard = taskStore.taskItems[transferingBoardIndex];
          if (newBoard) {
            const taskId =
              taskStore.taskItems[boardIndex].tasks[sourceIndex].id;
            taskStore.transferTask(taskId, boardId, newBoard.id);
          }
        }

        transferingBoardIndex = null;
      };

      document.body.onpointerup = dragEnd;
      document.body.onpointermove = dragMove;
    };

    useEffect(() => {
      boardBoundingRect.current = boardRef.current?.getBoundingClientRect();

      return () => {};
    }, []);

    return (
      <div
        ref={boardRef}
        data-board-index={boardIndex}
        className={clsx(
          "board flex flex-col transition relative rounded-lg border-2 border-dashed border-transparent bg-white/10",
          className
        )}
      >
        <div className="pt-2 pl-2">{boardTitle}</div>

        <div ref={tasksContainerRef} className="tasks flex-grow mt-5">
          {taskList.length ? (
            taskList.map((task, i) => (
              <TaskItem
                key={task.id}
                task={task}
                onPointerDown={(e) => handleDragItemStart(e, i)}
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
