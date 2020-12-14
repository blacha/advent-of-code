export function toNumberArray(str: string, split = '\n'): number[] {
  return str.split(split).map((c) => parseFloat(c));
}

export function toNumberArraySorted(str: string, direction: 'asc' | 'desc' = 'asc', split = '\n'): number[] {
  const num = toNumberArray(str, split);

  if (direction == 'asc') return num.sort((a, b) => a - b);
  return num.sort((a, b) => b - a);
}
