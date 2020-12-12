export class AnswersRegistry {
  map: Map<string, { a: number | string; b: number | string }> = new Map();
  get(user: string, year: number, day: number): { a: number | string; b: number | string } | null {
    return this.map.get(`${user}:${year}:${day}`) ?? null;
  }
  register(user: string, year: number, day: number, a: number | string, b: number | string): void {
    const userKey = `${user}:${year}:${day}`;
    if (this.map.has(`${user}:${year}:${day}`)) throw new Error('Duplicate answer supplied ' + userKey);
    this.map.set(userKey, { a, b });
  }
}

export const Answers = new AnswersRegistry();

Answers.register('blacha', 2015, 1, 138, 1771);
Answers.register('blacha', 2015, 2, 1586300, 3737498);
Answers.register('blacha', 2015, 3, 2565, 2639);
Answers.register('blacha', 2015, 4, 346386, 9958218);
Answers.register('blacha', 2015, 5, 258, 53);
Answers.register('blacha', 2015, 6, 569999, 17836115);
Answers.register('blacha', 2015, 7, 3176, 14710);
Answers.register('blacha', 2015, 8, 1371, 2117);
Answers.register('blacha', 2015, 9, 207, 804);
Answers.register('blacha', 2015, 10, 492982, 6989950);
Answers.register('blacha', 2015, 11, 'cqjxxyzz', 'cqkaabcc');
Answers.register('blacha', 2015, 12, 156366, 96852);
Answers.register('blacha', 2015, 13, 618, 601);
Answers.register('blacha', 2015, 14, 2696, 1084);

Answers.register('blacha', 2019, 1, 3405637, 5105597);
Answers.register('blacha', 2019, 2, 3516593, 7749);
Answers.register('blacha', 2019, 3, 1337, 65356);
Answers.register('blacha', 2019, 4, 1150, 748);
Answers.register('blacha', 2019, 5, 15259545, 7616021);
Answers.register('blacha', 2019, 6, 117672, 277);
Answers.register('blacha', 2019, 7, 437860, 49810599);
Answers.register('blacha', 2019, 8, 1848, 'fgjuz');
Answers.register('blacha', 2019, 9, 2682107844, 34738);
Answers.register('blacha', 2019, 10, 288, 616);
Answers.register('blacha', 2019, 11, 1709, 'pguehcjh');
Answers.register('blacha', 2019, 12, 13500, 278013787106916);

Answers.register('blacha', 2020, 1, 1003971, 84035952);
Answers.register('blacha', 2020, 2, 506, 443);
Answers.register('blacha', 2020, 3, 148, 727923200);
Answers.register('blacha', 2020, 4, 226, 160);
Answers.register('blacha', 2020, 5, 933, 711);
Answers.register('blacha', 2020, 6, 6683, 3122);
Answers.register('blacha', 2020, 7, 126, 220149);
Answers.register('blacha', 2020, 8, 1675, 1532);
Answers.register('blacha', 2020, 9, 1492208709, 238243506);
Answers.register('blacha', 2020, 10, 1920, 1511207993344);
Answers.register('blacha', 2020, 11, 2303, 2057);
Answers.register('blacha', 2020, 12, 1441, 61616);
