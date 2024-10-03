type Constructor<T> = new (...args: unknown[]) => T;

export class ServiceAllocator {
    private static services = new Map<Constructor<unknown>, unknown>();
    
    public static register<T>(service: T): void {
        const constructor = service.constructor as Constructor<T>;
        this.services.set(constructor, service);
    }
    
    public static get<T>(ctor: Constructor<T>): T {
        const service = this.services.get(ctor);
        if (service) {
            return service as T;
        }
        throw new Error(`Service of type ${ctor.name} is not registered.`);
    }
    
    public static unregister<T>(ctor: Constructor<T>): void {
        this.services.delete(ctor);
    }
}