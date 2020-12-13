import { performance } from 'perf_hooks';

export async function timer<T>(fn: () => T | Promise<T>): Promise<{ duration: number; v: T }> {
  const startTime = performance.now();
  const v = await fn();
  const duration = Math.floor((performance.now() - startTime) * 1e3) / 1e3;
  return { v, duration };
}
