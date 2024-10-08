import { _decorator, Component, Node } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ShapesFactory } from '../Tools/ShapesFactory';
import { GameSettings } from '../Game/GameSettings';
import { ShapeType } from '../Tools/Enams';
import { Shape } from './Shape';
import { EventEmitter } from '../Tools/EventEmitter';
import { Audios } from '../Game/Audios';

const { ccclass, property } = _decorator;

@ccclass('ShapeSpawner')
export class ShapeSpawner extends Component {
    @property({ type: [Node], group: 'Spawner Links', displayName: 'Spawn Positions' })
    private spawnNodes: Node[] = [];

    private gameSettings: GameSettings;
    private shapesFactory: ShapesFactory;
    private audios: Audios;
    private shapes: Shape[] = [];
    private cumulativeProbabilities: { shapeType: ShapeType, cumulativeWeight: number }[] = [];

    public shapeCreated: EventEmitter = new EventEmitter();
    public spaceEnded: EventEmitter = new EventEmitter();

    protected async start() {
        this.gameSettings = ServiceAllocator.get(ServiceKey.GameSettings);
        this.shapesFactory = ServiceAllocator.get(ServiceKey.ShapesFactory);
        this.audios = ServiceAllocator.get(ServiceKey.Audios);
        await this.shapesFactory.loadShapePrefabs();
        this.spawnNewShape();
    }

    private spawnNewShape(): void {
        for (let i = 0; i < this.spawnNodes.length; i++) {
            const spawnTransform = this.spawnNodes[i];
            const shape = this.shapesFactory.createShape(this.getRandomShapeType(), spawnTransform);
            shape.droped.Subscribe(this.onDroped);
            shape.destroed.Subscribe(this.onShapeDestroyd);
            this.shapes.push(shape);
        }
        this.shapeCreated?.Invoke();
        this.checkShapesIsCanPlace();
    }

    private getRandomShapeType(): ShapeType {
        if (this.cumulativeProbabilities.length === 0) {
            this.initCumulativeProbabilities();
        }
        const totalWeight = this.cumulativeProbabilities[this.cumulativeProbabilities.length - 1].cumulativeWeight;
        const randomWeight = Math.random() * totalWeight;

        for (const prob of this.cumulativeProbabilities) {
            if (randomWeight <= prob.cumulativeWeight) {
                return prob.shapeType;
            }
        }

        return this.cumulativeProbabilities[0].shapeType;
    }

    private initCumulativeProbabilities() {
        const probabilities = this.gameSettings.getShapeProbabilities;
        let cumulativeWeight = 0;
        this.cumulativeProbabilities = probabilities.map(prob => {
            cumulativeWeight += prob.weight;
            return { shapeType: prob.shapeType, cumulativeWeight };
        });
    }

    private onDroped = (): void => {
        this.audios.playDropShape();
    }

    private onShapeDestroyd = (shape: Shape) => {
        shape.droped.Unsubscribe(this.onDroped);
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
        let placeCounter = 0;
        this.shapes.forEach(shape => {
            if (shape.checkIsCanPlaceShapeToBord()) {
                placeCounter++;
            }
        });
       
        if (placeCounter === 0){
            this.spaceEnded?.Invoke();
        }
    }
}