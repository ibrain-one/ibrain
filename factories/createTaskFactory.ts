type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'aborted';

interface TaskOptions {
  timeout?: number;
  retry?: number;
  onTimeout?: () => void;
  onRetry?: () => void;
  onAbort?: () => void;
}

interface Task<T, R> {
  id: string;
  description: string;
  executeFn: (signal: AbortSignal) => Promise<R>;
  type: 'sync' | 'async';
  status: TaskStatus;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  options: TaskOptions;
}

type TaskExecuteFunction<T, R> = (signal: AbortSignal) => Promise<R>;

function createTaskFactory<T, R>(defaultOptions?: TaskOptions): (description: string, executeFn: TaskExecuteFunction<T, R>, options?: TaskOptions) => Task<T, R> {
    return (description, executeFn, options = {}) => {
      const mergedOptions: TaskOptions = { ...defaultOptions, ...options };
      const task: Task<T, R> = {
        id: Math.random().toString(36).substring(2, 15),
        description,
        executeFn: async (signal: AbortSignal) => {
          if (mergedOptions.timeout) {
            const timeoutId = setTimeout(() => {
            //   signal.abort();
              mergedOptions.onTimeout?.();
            }, mergedOptions.timeout);
            signal.addEventListener('abort', () => clearTimeout(timeoutId));
          }
  
          try {
            const result = await executeFn(signal);
            // mergedOptions.onComplete?.();
            return result;
          } catch (error) {
            if (signal.aborted) {
              mergedOptions.onAbort?.();
            } else {
            //   mergedOptions.onFail?.();
            }
            throw error;
          }
        },
        type: 'async', // Assuming async by default, adjust as necessary
        status: 'pending',
        createdAt: new Date(),
        updatedAt: undefined,
        completedAt: undefined,
        options: mergedOptions,
      };
  
      // Task execution and lifecycle management logic can be implemented here or externally
  
      return task;
    };
  }
  