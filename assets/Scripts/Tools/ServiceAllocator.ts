export enum ServiceKey {  
    GameSettings,  
    DragAndDrop,
    ShapesFactory,
    CellsFactory
};

export class ServiceAllocator {
    private static services = new Map<ServiceKey, any>();

    /**
     * Registers a service.
     * @param key - The service key from the enum ServiceKey.
     * @param service - The service instance.
     */
    public static register<T>(key: ServiceKey, service: T): void {
        if (this.services.has(key)) {
            throw new Error(`Service with key ${ServiceKey[key]} is already registered.`);
        }
        this.services.set(key, service);
    }

    /**
     * Retrieves a registered service.
     * @param key - The service key from the enum ServiceKey.
     * @returns The service instance.
     */
    public static get<T>(key: ServiceKey): T {
        const service = this.services.get(key);
        if (service === undefined) {
            throw new Error(`Service with key ${ServiceKey[key]} is not registered.`);
        }
        return service as T;
    }

    /**
     * Unregisters a service.
     * @param key - The service key from the enum ServiceKey.
     */
    public static unregister(key: ServiceKey): void {
        if (!this.services.has(key)) {
            throw new Error(`Service with key ${ServiceKey[key]} is not registered.`);
        }
        this.services.delete(key);
    }
}
