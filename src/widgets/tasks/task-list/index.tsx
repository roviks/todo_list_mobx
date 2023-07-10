import clsx from "clsx";
import { Fragment, useEffect } from "react";
import { observer } from "mobx-react";

import { TasksBoard } from "~/features/tasks";
import { useTaskStore } from "~/features/tasks/model";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const colors = [
  "#ff9d9d",
  "#ffe79d",
  "#c8ff9d",
  "#9dffd3",
  "#9dbeff",
  "#f49dff",
  "#ffd09d",
];

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const TaskList = observer(() => {
  const taskStore = useTaskStore();

  useEffect(() => {
    taskStore.init();
  }, []);

  const offset = 30;

  return (
    <div
      className={`overflow-hidden overflow-x-auto min-h-full flex-grow flex flex-col`}
    >
      {taskStore.taskItems.length ? (
        <div
          className={`flex flex-grow`}
          style={{
            marginBottom: offset + 100,
          }}
        >
          {taskStore.taskItems.map((board, index) => {
            const taskItem = (
              <TasksBoard
                key={board.id}
                index={index}
                className={clsx(
                  "flex-grow-0 flex-shrink-0 basis-[300px]",
                  taskStore.taskItems.length - 1 !== index ? "mr-3" : ""
                )}
                boardId={board.id}
                boardTitle={
                  <span
                    className={clsx(
                      "inline-block text-slate-800 pt-0.5 px-1 text-xs font-semibold rounded-sm"
                    )}
                    style={{
                      backgroundColor: colors[index % (colors.length - 1)],
                    }}
                  >
                    {board.name}
                  </span>
                }
              />
            );

            if (index === 0) {
              return (
                <Fragment key={board.id}>
                  <div
                    style={{
                      paddingLeft: offset,
                    }}
                  />
                  {taskItem}
                </Fragment>
              );
            } else if (index === taskStore.taskItems.length - 1) {
              return (
                <Fragment key={board.id}>
                  {taskItem}
                  <div
                    style={{
                      paddingLeft: offset,
                    }}
                  />
                </Fragment>
              );
            }

            return taskItem;
          })}
        </div>
      ) : (
        <Spin indicator={loadingIcon} />
      )}
    </div>
  );
});
