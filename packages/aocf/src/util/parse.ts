export function toNumberArray(str: string, split = '\n'): number[] {
  return str.split(split).map((c) => parseFloat(c));
}

export function toNumberArraySorted(str: string, split = '\n'): number[] {
  return toNumberArray(str, split).sort((a, b) => a - b);
}
