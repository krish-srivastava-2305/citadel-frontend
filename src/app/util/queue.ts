class Queue {
    private items: string[] = [];

    enqueue(item: string): void {
        this.items.push(item);
    }

    dequeue(): string | undefined {
        return this.items.shift();
    }

    peek(): string | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

export default Queue