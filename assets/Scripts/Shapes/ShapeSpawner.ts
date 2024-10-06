import { _decorator, Component, Node } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ShapesFactory } from '../Tools/ShapesFactory';
import { GameSettings } from '../Level/GameSettings';
import { ShapeType } from '../Tools/Enams';
import { Shape } from './Shape';

const { ccclass, property } = _decorator;

@ccclass('ShapeSpawner')
export class ShapeSpawner extends Component {
    @property({ type: [Node], group: 'Spawner Links', displayName: 'Spawn Positions' })
    private spawnNodes: Node[] = [];

    private shapes: Shape[] = [];
    private gameSettings: GameSettings;
    private shapesFactory: ShapesFactory;

    protected async start() {
        this.gameSettings = ServiceAllocator.get(ServiceKey.GameSettings);
        this.shapesFactory = ServiceAllocator.get(ServiceKey.ShapesFactory);
        await this.shapesFactory.loadShapePrefabs();
        this.spawnNewShape();
    }

    private spawnNewShape(): void {
        for (let i = 0; i < this.spawnNodes.length; i++) {
            const spawnTransform = this.spawnNodes[i];
            const shape = this.shapesFactory.createShape(this.getRandomShapeType(), spawnTransform);
            shape.destroed.Subscribe(this.onShapeDestroyd);
            this.shapes.push(shape);
        }        
        this.checkShapesIsCanPlace();
    }

    private getRandomShapeType(): ShapeType {
        const probabilities = this.gameSettings.getShapeProbabilities;
        const totalWeight = probabilities.reduce((total, prob) => total + prob.weight, 0);
        let randomWeight = Math.random() * totalWeight;
        for (const prob of probabilities) {
            if (randomWeight < prob.weight) {
                return prob.shapeType;
            }
            randomWeight -= prob.weight;
        }
        return probabilities[probabilities.length - 1].shapeType;
    }

    private onShapeDestroyd = (shape: Shape) => {
        shape.destroed.Unsubscribe(this.onShapeDestroyd);
        const index = this.shapes.indexOf(shape);
        if (index > -1) {
            this.shapes.splice(index, 1);
        }

        if (this.shapes.length === 0) {
            this.spawnNewShape();
        } else {
            this.checkShapesIsCanPlace();
        }
    }

    private checkShapesIsCanPlace(): void {
        this.shapes.forEach(shape => shape.checkIsCanPlaceShapeToBord());
    }
}