import { _decorator, Component, Node } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ShapeProbability } from './ShapeProbability';
import { ShapesFactory } from '../Tools/ShapesFactory';


const { ccclass, property } = _decorator;

@ccclass('ShapeSpawner')
export class ShapeSpawner extends Component {
    @property({ type: [ShapeProbability], group: 'Spawner Settings' })
    private shapeProbabilities: ShapeProbability[] = [];

    @property({ type: [Node], group: 'Spawner Settings', displayName: 'Spawn Positions' })
    private spawnNode: Node[] = [];

    private shapesFactory: ShapesFactory;

    protected async start() {        
        this.shapesFactory = ServiceAllocator.get(ServiceKey.ShapesFactory);      
        await this.shapesFactory.loadShapePrefabs();
     
        for (let index = 0; index < 3; index++) {
            const spawnTransform = this.spawnNode[index % this.spawnNode.length];
            this.shapesFactory.createShape(this.shapeProbabilities[index].shapeType, spawnTransform);
        }
    }
}