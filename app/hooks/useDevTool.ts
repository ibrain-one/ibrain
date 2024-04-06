//@ts-nocheck
import { useEffect } from 'react';

export const useDevTools = (core) => {
  useEffect(() => {
    let devTools = null;
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
      // Send initial state
      devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
      devTools?.connect().init(core.store.getState());
      core.log.info(`Connected to Redux Devtools`);

      // Subscribe to state changes
      const unsubscribe = core.store.on(/.*/, ({ event, ...payload }) => {
        core.log.verbose(event, payload);
        devTools.send({ type: event, payload }, core.store.getState(), {
          trace: true,
          name: 'brainstack iBrain'
        });
      });

      return () => {
        devTools.disconnect();
        unsubscribe();
        core.log.info(`Disconnected from Redux Devtools`);
      };
    }
  }, [core.store]);
};
