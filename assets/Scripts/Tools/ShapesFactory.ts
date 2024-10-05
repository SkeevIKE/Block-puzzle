import { _decorator, Node, instantiate, Prefab, resources, UITransform } from 'cc';
import { ShapeType } from './Enams';
import { Shape } from '../Shapes/Shape';

export class ShapesFactory {
    private path: string = 'Prefabs/Shapes';
    private shapePrefabMap: { [key in ShapeType]?: Prefab } = {};
    private isLoaded: boolean = false;
    private loadingPromise: Promise<void> | null = null;

    public async loadShapePrefabs(): Promise<void> {
        if (this.isLoaded) {
            console.warn('Shape prefabs are already loaded. Skipping loading process.');
            return;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }
       
        this.loadingPromise = new Promise<void>((resolve, reject) => {
            resources.loadDir(this.path, Prefab, (err, prefabs) => {
                if (err) {
                    console.error(`Error loading prefabs from path: ${this.path}`, err);
                    this.loadingPromise = null;
                    reject(err);
                    return;
                }

                this.isLoaded = true;
                for (const prefab of prefabs) {
                    const shapeComponent = prefab.data.getComponent(Shape);
                    if (shapeComponent) {
                        const shapeType = shapeComponent.getShapeType();
                        this.shapePrefabMap[shapeType] = prefab;
                    }
                }
                resolve();
            });
        });

        return this.loadingPromise;
    }

    public isReady(): boolean {
        return this.isLoaded;
    }

    public createShape(shapeType: ShapeType, parentTransform: Node): Shape {
        if (!this.isLoaded) {
            throw new Error('ShapeFactory is not loaded yet. Please wait for the load to complete before creating shapes.');
        }

        const prefab = this.shapePrefabMap[shapeType];
        if (!prefab) {
            throw new Error(`Prefab for ShapeType ${shapeType} not found`);
        }
        const newShapeNode = instantiate(prefab);
        newShapeNode.setParent(parentTransform);
        const shapeComponent = newShapeNode.getComponent(Shape);
        if (!shapeComponent) {
            throw new Error(`Shape component not found on instantiated prefab for ShapeType ${shapeType}`);
        }        
        return shapeComponent;
    }

    public destroy(): void {
        this.isLoaded = false;
        this.shapePrefabMap = {};
        this.loadingPromise = null;
    }
}
