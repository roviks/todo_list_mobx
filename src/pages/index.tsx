import { TaskList } from "~/widgets/tasks";

export default function Home() {
  return (
    <div className="mx-auto flex flex-col min-h-screen pt-10 sm">
      <h1 className="font-sans mb-5 text-4xl pl-[30px]">Task List</h1>

      <div className="relative min-h-full flex flex-col flex-grow">
        <TaskList />
      </div>
    </div>
  );
}
