export class EventEmitter<T = void> {
    private delegates: Array<(args: T) => void> = [];

    public Invoke(args: T): void {
        this.delegates.forEach(delegate => {
            delegate(args);
        });
    }

    public Subscribe(delegate: (args: T) => void): void {
        this.delegates.push(delegate);
    }

    public Unsubscribe(delegate: (args: T) => void): void {
        this.delegates = this.delegates.filter(d => d !== delegate);
    }
}