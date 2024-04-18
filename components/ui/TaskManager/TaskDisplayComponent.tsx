'use client';
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { useTaskManager } from '@/app/providers/taskManager';

const TaskCategoryDrawer: React.FC<{
  title: string;
  tasks: any[];
  onAbortTask: (taskId: string) => void;
  onAbortAll?: () => void;
}> = ({ title, tasks, onAbortTask, onAbortAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="min-w-[30%] mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-xl font-bold cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </h2>
        {onAbortAll && tasks.length > 0 && (
          <button
            onClick={onAbortAll}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out"
          >
            Abort All
          </button>
        )}
      </div>
      <div
        className={`flex flex-col items-center gap-4 transition-max-height duration-700 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onAbort={onAbortTask} />
          ))
        ) : (
          <p className="text-gray-600">No tasks.</p>
        )}
      </div>
    </section>
  );
};

const TaskDisplayComponent: React.FC<{ isVisible: boolean }> = ({
  isVisible
}) => {
  const {
    syncTasks,
    asyncTasks,
    taskHistory,
    abortTask,
    abortAllAsyncTasks,
    abortAllSyncTasks
  } = useTaskManager();

  // Tailwind CSS classes for sliding animations
  const slideInClasses =
    'transform translate-x-0 transition-transform duration-500 ease-in-out';
  const slideOutClasses =
    '-translate-x-full transition-transform duration-500 ease-in-out';

  return (
    <div
      className={`fixed top-0 left-0 h-full shadow-lg z-50 w-3/4 bg-gray-800 opacity-95 ${isVisible ? slideInClasses : slideOutClasses}`}
    >
      <h1 className="text-4xl font-bold text-center">Task Manager</h1>
      <div className="flex flex-wrap justify-around items-start mt-8 p-4">
        <div className="flex flex-wrap justify-around items-start mt-8 flex-1">
          <TaskCategoryDrawer
            title="Synchronous Tasks"
            tasks={syncTasks}
            onAbortTask={abortTask}
            onAbortAll={abortAllSyncTasks}
          />
          <TaskCategoryDrawer
            title="Asynchronous Tasks"
            tasks={asyncTasks}
            onAbortTask={abortTask}
            onAbortAll={abortAllAsyncTasks}
          />
          <TaskCategoryDrawer
            title="Task History"
            tasks={taskHistory}
            onAbortTask={abortTask}
          />
        </div>
      </div>
    </div>
  );
};

const TaskManager: React.FC = () => {
  const [isTaskManagerVisible, setIsTaskManagerVisible] = useState(false);

  // Determine the button's left position based on the overlay's visibility
  // Assuming the overlay width is 3/4 of the viewport (w-3/4 in Tailwind), adjust if your overlay width is different
  const buttonLeftPosition = isTaskManagerVisible ? '75%' : '-30px';

  return (
    <>
      <button
        style={{ left: buttonLeftPosition, transform: 'rotate(90deg)' }}
        className={`fixed top-1/2  z-50 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all duration-500 ease-in-out`}
        onClick={() => setIsTaskManagerVisible(!isTaskManagerVisible)}
      >
        {isTaskManagerVisible ? 'Hide Tasks' : 'Show Tasks'}
      </button>
      <TaskDisplayComponent isVisible={isTaskManagerVisible} />
    </>
  );
};

export default TaskManager;
