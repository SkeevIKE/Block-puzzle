import { DelegateFunction } from './DelegateFunction';

export class Delegate<T extends any[] = []> {
    private _delegates: DelegateFunction<T>[] = [];

    public Invoke(...args: T) {
        this._delegates.forEach(delegate => {
            delegate(...args);
        });
    }

    public Subscribe(delegate: DelegateFunction<T>): void {
        this._delegates.push(delegate);
    }

    public Unsubscribe(delegate: DelegateFunction<T>): void {
        this._delegates = this._delegates.filter(d => d !== delegate);
    }
}