// components/TaskItem.tsx
import React from 'react';
import { Task, TaskHistoryEntry } from '@/app/hooks/useTaskManagerService';

interface TaskItemProps {
  task: Task | TaskHistoryEntry;
  onAbort: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onAbort }) => (
  <div className="p-4 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
      {task.description}
    </h5>
    <p className="font-normal text-gray-700">Status: {task.status}</p>
    <p>Created At: {task.createdAt.toLocaleString()}</p>
    {task.updatedAt && <p>Updated At: {task.updatedAt.toLocaleString()}</p>}
    {task.completedAt && (
      <p>Completed At: {task.completedAt.toLocaleString()}</p>
    )}
    {(task.status === 'Pending' || task.status === 'Processing') && (
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => onAbort(task.id)}
      >
        Abort
      </button>
    )}
  </div>
);

export default TaskItem;
