export function toNumberArray(str: string): number[] {
  return str.split('\n').map((c) => parseFloat(c));
}
