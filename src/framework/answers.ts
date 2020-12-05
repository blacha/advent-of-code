export class AnswersRegistry {
  map: Map<string, { a: number; b: number }> = new Map();
  get(user: string, year: number, day: number): { a: number; b: number } | null {
    return this.map.get(`${user}:${year}:${day}`) ?? null;
  }
  register(user: string, year: number, day: number, a: number, b: number): void {
    const userKey = `${user}:${year}:${day}`;
    if (this.map.has(`${user}:${year}:${day}`)) throw new Error('Duplicate answer supplied ' + userKey);
    this.map.set(userKey, { a, b });
  }
}

export const Answers = new AnswersRegistry();

Answers.register('blacha', 2020, 1, 1003971, 84035952);
Answers.register('blacha', 2020, 2, 506, 443);
Answers.register('blacha', 2020, 3, 148, 742481664);
Answers.register('blacha', 2020, 4, 226, 160);
