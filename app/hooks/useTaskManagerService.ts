'use client';
import { useState, useEffect, useCallback } from 'react';
import { core } from '../providers/brainstack';

export interface Task {
  id: string;
  description: string;
  executeFn: (signal: AbortSignal) => Promise<void>;
  status: 'Pending' | 'Processing' | 'Completed' | 'Aborted';
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

export interface TaskHistoryEntry extends Omit<Task, 'executeFn'> {}

const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const useTaskManagerService = () => {
  const [syncTasks, setSyncTasks] = useState<Task[]>([]);
  const [asyncTasks, setAsyncTasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistoryEntry[]>([]);
  const [controllers, setControllers] = useState<Map<string, AbortController>>(
    new Map()
  );

  const addTask = useCallback(
    (
      description: string,
      executeFn: (signal: AbortSignal) => Promise<void>,
      isSync: boolean
    ) => {
      const id = generateId();
      const controller = new AbortController();

      const newTask: Task = {
        id,
        description,
        executeFn: (signal) => executeFn(signal),
        status: 'Pending',
        createdAt: new Date()
      };

      setControllers((prev) => new Map(prev).set(id, controller));

      if (isSync) {
        setSyncTasks((prev) => [...prev, newTask]);
      } else {
        setAsyncTasks((prev) => [...prev, newTask]);
      }
    },
    []
  );

  const addSyncTask = useCallback(
    (
      description: string,
      executeFn: (signal: AbortSignal) => Promise<void>
    ) => {
      addTask(description, executeFn, true);
    },
    [addTask]
  );

  const addAsyncTask = useCallback(
    (
      description: string,
      executeFn: (signal: AbortSignal) => Promise<void>
    ) => {
      addTask(description, executeFn, false);
    },
    [addTask]
  );

  const abortTask = useCallback(
    (taskId: string) => {
      // Abort the task using its controller
      const controller = controllers.get(taskId);
      if (controller) {
        controller.abort();
        setControllers((prev) => {
          const newControllers = new Map(prev);
          newControllers.delete(taskId);
          return newControllers;
        });
      }

      // Update task status to 'Aborted', remove from active tasks, and add to history
      // For Sync Tasks
      setSyncTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
        const abortedTask = prevTasks.find((task) => task.id === taskId);
        if (abortedTask) {
          setTaskHistory((prevHistory) => [
            {
              ...abortedTask,
              id: abortedTask.id + '-aborted',
              status: 'Aborted',
              updatedAt: new Date(),
              completedAt: new Date()
            },
            ...prevHistory
          ]);
        }
        return updatedTasks;
      });

      // For Async Tasks
      setAsyncTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
        const abortedTask = prevTasks.find((task) => task.id === taskId);
        if (abortedTask) {
          setTaskHistory((prevHistory) => [
            {
              ...abortedTask,
              id: abortedTask.id + '-aborted',
              status: 'Aborted',
              updatedAt: new Date(),
              completedAt: new Date()
            },
            ...prevHistory
          ]);
        }
        return updatedTasks;
      });
    },
    [controllers, setSyncTasks, setAsyncTasks, setTaskHistory]
  );

  const executeTask = useCallback(
    async (task: Task, isSync: boolean) => {
      const updateTasks = isSync ? setSyncTasks : setAsyncTasks;
      const controller = controllers.get(task.id);

      if (!controller) return; // Controller must exist

      try {
        updateTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: 'Processing', updatedAt: new Date() }
              : t
          )
        );

        await task.executeFn(controller.signal);

        updateTasks((prev) => prev.filter((t) => t.id !== task.id));
        setTaskHistory((prev) => [
          { ...task, status: 'Completed', completedAt: new Date() },
          ...prev
        ]);
      } catch (error: any) {
        core.log.error(`Error executing task ${task.id}: ${error}`);
        if (error?.name === 'AbortError') {
          updateTasks((prev) => prev.filter((t) => t.id !== task.id));
          setTaskHistory((prev) => [
            {
              ...task,
              status: 'Aborted',
              updatedAt: new Date(),
              completedAt: new Date()
            },
            ...prev
          ]);
        }
      }
    },
    [controllers]
  );

  const abortAllAsyncTasks = useCallback(() => {
    asyncTasks.forEach((task) => {
      abortTask(task.id);
    });
  }, [asyncTasks, abortTask]); // Depend on abortTask

  const abortAllSyncTasks = useCallback(() => {
    syncTasks.forEach((task) => {
      abortTask(task.id);
    });
  }, [syncTasks, abortTask]); // Depend on abortTask

  useEffect(() => {
    if (syncTasks.length > 0 && syncTasks[0].status === 'Pending') {
      executeTask(syncTasks[0], true);
    }
  }, [syncTasks, executeTask]);

  useEffect(() => {
    asyncTasks.forEach((task) => {
      if (task.status === 'Pending') {
        executeTask(task, false);
      }
    });
  }, [asyncTasks, executeTask]);

  return {
    addSyncTask,
    addAsyncTask,
    abortTask,
    abortAllAsyncTasks,
    abortAllSyncTasks,
    taskHistory,
    syncTasks,
    asyncTasks
  };
};
