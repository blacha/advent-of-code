export interface BestScanner {
    count: number;
    asteroid: Asteroid;
}

export interface ToKill {
    asteroid: Asteroid;
    angle: number;
    distance: number;
}
const RadToDeg = 180 / Math.PI;
const NumberSort = (a: number, b: number): number => a - b;
export class Asteroid {
    static Id = 0;
    id: number;
    x: number;
    y: number;
    name: string;

    constructor(x: number, y: number, name: string) {
        this.id = Asteroid.Id++;
        this.x = x;
        this.y = y;
        this.name = name;
    }

    angle(other: Asteroid): number {
        return Math.atan2(this.y - other.y, this.x - other.x);
    }

    distance(other: Asteroid): number {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
    get point() {
        return { x: this.x, y: this.y };
    }
}

export class Sensors {
    asteroids: Asteroid[] = [];

    constructor(grid: string) {
        const lines = grid.trim().split('\n');
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y].trim().split('');
            for (let x = 0; x < line.length; x++) {
                if (line[x] === '.') {
                    continue;
                }
                this.asteroids.push(new Asteroid(x, y, line[x]));
            }
        }
    }
    get(x: number, y: number) {
        const astro = this.asteroids.find(a => a.x == x && a.y == y);
        if (astro == null) {
            throw new Error('Cannot find asteroid');
        }
        return astro;
    }

    scan(): BestScanner {
        let best: BestScanner | null = null;
        for (const asteroid of this.asteroids) {
            const angles = new Set();

            for (const target of this.asteroids) {
                if (target.id == asteroid.id) {
                    continue;
                }
                angles.add(asteroid.angle(target));
            }

            if (best == null || angles.size > best.count) {
                best = { asteroid, count: angles.size };
            }
        }
        if (best == null) {
            throw new Error('Unable to find a asteroid');
        }
        return best;
    }

    destroy(source: Asteroid, counter?: number): Asteroid {
        let killCount = 0;
        const toKill: ToKill[] = [];
        const angles = new Map<number, ToKill[]>();
        for (const asteroid of this.asteroids) {
            if (asteroid.id == source.id) {
                continue;
            }
            const killer = {
                asteroid,
                angle: asteroid.angle(source) * RadToDeg,
                distance: asteroid.distance(source),
            };
            toKill.push(killer);
            const existing = angles.get(killer.angle);
            if (existing == null) {
                angles.set(killer.angle, [killer]);
            } else {
                existing.push(killer);
            }
        }

        const targetAngles = Array.from(angles.keys()).sort(NumberSort);
        let currentIndex = targetAngles.indexOf(-90);
        while (angles.size > 0) {
            const angle = targetAngles[currentIndex];
            const targets = angles.get(angle);
            if (targets != null) {
                const closestTarget = targets.sort((a, b) => a.distance - b.distance)[0];
                killCount++;
                if (killCount == counter) {
                    return closestTarget.asteroid;
                }

                targets.shift();
                if (targets.length == 0) {
                    angles.delete(angle);
                }
            }

            currentIndex = currentIndex + 1;
            if (currentIndex > targetAngles.length) {
                currentIndex = 0;
            }
        }

        return source;
    }

    static scan(grid: string) {
        const sensors = new Sensors(grid);
        return sensors.scan();
    }
}
