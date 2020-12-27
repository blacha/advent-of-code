import { performance } from 'perf_hooks';

export function timer<T>(fn: () => T): { duration: number; v: T } {
  const startTime = performance.now();
  const v = fn();
  const duration = Math.floor((performance.now() - startTime) * 1e3) / 1e3;
  return { v, duration };
}
