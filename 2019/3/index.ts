interface Hit {
    key: string;
    total: number;
    sum: number;
    data: HitData[];
}
interface HitData {
    id: string;
    steps: number;
}

export class Grid {
    id: number;
    output: Record<string, HitData[]>;
    hits: Record<string, Hit>;

    constructor(lines: string) {
        this.id = 0;
        this.output = {};
        this.hits = {};
        const newTasks = lines.trim().split('\n');
        for (const task of newTasks) {
            const id = String(this.id++);
            this.add(task.trim(), id);
        }
    }

    add(tasks: string, id: string) {
        let x = 0;
        let y = 0;
        let steps = 0;
        for (const task of tasks.split(',')) {
            const direction = task.charAt(0);
            let dX = 0;
            let dY = 0;

            if (direction == 'R') {
                dX = 1;
            } else if (direction == 'L') {
                dX = -1;
            } else if (direction == 'U') {
                dY = -1;
            } else if (direction == 'D') {
                dY = 1;
            }
            const count = parseInt(task.substr(1), 10);
            for (let i = 0; i < count; i++) {
                const key = `${x}:${y}`;
                const existing = this.output[key] || [];

                if (existing.find(f => f.id == id) == null) {
                    existing.push({
                        id,
                        steps,
                    });
                }
                if (existing.length > 1) {
                    this.hit(x, y, existing);
                }
                this.output[key] = existing;
                x = x + dX;
                y = y + dY;
                steps++;
            }
        }
    }

    hit(x: number, y: number, data: HitData[]) {
        const key = `${x}:${y}`;
        const existing = this.hits[key] || {
            key,
        };
        existing.total = Math.abs(x) + Math.abs(y);
        existing.data = data;
        existing.sum = data.reduce((prev, current) => prev + current.steps, 0);
        this.hits[key] = existing;
    }

    getHits() {
        const keys = Object.values(this.hits).sort((a, b) => a.total - b.total);
        return keys[1];
    }
    getBySum() {
        const keys = Object.values(this.hits).sort((a, b) => a.sum - b.sum);
        return keys[1];
    }
}
