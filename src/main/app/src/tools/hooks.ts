import { useEffect, useRef } from 'react';

export const useEffectOnce = (callback: VoidFunction) => {
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      callback();
    }
  }, [callback, isFirstRun]);
};
