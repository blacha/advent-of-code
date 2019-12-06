export class Node {
    parent?: Node;
    level: number;
    name: string;
    children?: Node[];

    constructor(name: string, parent?: Node) {
        this.level = parent ? parent.level + 1 : 0;
        this.parent = parent;
        this.name = name;
    }

    link(node: Node) {
        if (this.children == null) {
            this.children = [node];
            return;
        }

        const existing = this.children.find(f => f.name == node.name);
        if (existing) {
            throw Error('Duplicate Node');
        }
        this.children.push(node);
    }
}

export class Tree {
    tree: Record<string, Node> = {};

    static build(orbits: string[]) {
        const tree = new Tree();
        for (const orb of orbits) {
            const [first, second] = orb.split(')');
            tree.link(first, second);
        }
        return tree;
    }

    get(name: string, parent?: Node): Node {
        let existing = this.tree[name];
        if (existing == null) {
            existing = new Node(name, parent);
            this.tree[name] = existing;
        }
        if (parent) {
            if (existing.parent == null) {
                existing.parent = parent;
            } else if (existing.parent.name != parent.name) {
                console.log(name, parent);
                console.log('ParentMissMatch', parent, existing.parent.name);
            }
        }

        return existing;
    }

    path(nodeA: string, nodeB: string) {
        const nA = this.get(nodeA);
        const nB = this.get(nodeB);

        let level = 0;
        const aSearch: Record<string, number> = {};
        let parent: Node | undefined = nA.parent;
        while (parent != null) {
            aSearch[parent.name] = level++;
            parent = parent.parent;
        }

        level = 0;
        parent = nB.parent;
        while (parent != null) {
            if (aSearch[parent.name]) {
                level += aSearch[parent.name];
                break;
            }
            level++;
            parent = parent.parent;
        }

        return level;
    }

    getOrbits() {
        let count = 0;
        for (const val of Object.values(this.tree)) {
            if (val.parent == null) {
                count += this.getOrbit(val, 0);
            }
        }
        return count;
    }

    getOrbit(node: Node, level = 0): number {
        if (node == null) {
            throw new Error('Root missing');
        }
        if (node.children == null) {
            return level;
        }
        let count = level;
        for (const child of node.children) {
            count += this.getOrbit(child, level + 1);
        }
        return count;
    }

    link(first: string, second: string) {
        const nodeA = this.get(first);
        const nodeB = this.get(second, nodeA);
        nodeA.link(nodeB);
    }
}
