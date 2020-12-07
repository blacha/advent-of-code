export function toNumberArray(str: string, split = '\n'): number[] {
  return str.split(split).map((c) => parseFloat(c));
}
