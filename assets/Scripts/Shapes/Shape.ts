import { _decorator, Component, Vec3 } from 'cc';
import { Block } from './Block';
import { ShapeType } from '../Tools/Enams';
import { TweenAnimation } from '../Tools/TweenAnimation';
import { GameSettings } from '../Level/GameSettings';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';

const { ccclass, property } = _decorator;

@ccclass('Shape')
export class Shape extends Component {
    
    private readonly LERP_UPDATE_INTERVAL: number = 0.02;
    private readonly LERP_STEP_INTERVAL_MS: number = 20;

    @property({ type: ShapeType })
    private shapeType: ShapeType = ShapeType.Point;
    
    @property([Block])
    private blocks: Block[] = [];
    
    private _isStopLerping: boolean = false;    
    private setting: GameSettings;
    private startNodePosition: Vec3 = new Vec3();
    private startNodeScale: Vec3 = new Vec3();   

    protected onEnable(): void {
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
    }

    public getShapeType(): ShapeType {
        return this.shapeType;
    }

    public touch(position: Vec3): void {
        this._isStopLerping = false;
        this.startNodePosition.set(this.node.getWorldPosition());
        this.startNodeScale.set(this.node.getWorldScale());         
        const offset = this.setting.getDragShapeOffset();
        this.lerpToPosition(position.add(offset));

        const scale = this.setting.getDragShapeScale();
        TweenAnimation.resizeToScale(this.node, scale);
    }
    
    public drag(position: Vec3): void {
        const offset = this.setting.getDragShapeOffset();       
        this.lerpToPosition(position.add(offset));
    }
    
    public drop(): void {
        this._isStopLerping = true;
        TweenAnimation.stopAnimation(this.node);
        this.node.setWorldPosition(this.startNodePosition);
        TweenAnimation.resizeToScale(this.node, this.startNodeScale);
    }
    
    private lerpToPosition(targetPosition: Vec3, time: number = 0.1): void {
        let currentTime = 0;
        const startPosition = this.node.getWorldPosition().clone();
        const updatePosition = () => {
            if (this._isStopLerping) {                
                return;
            }
            currentTime += this.LERP_UPDATE_INTERVAL;
            const t = Math.min(currentTime / time, 1);
            const newPosition = startPosition.clone().lerp(targetPosition, t);
            this.node.setWorldPosition(newPosition);
            if (t < 1) {
                setTimeout(updatePosition, this.LERP_STEP_INTERVAL_MS);
            } else {
                this._isStopLerping = false;
            }
        };
        updatePosition();
    }
}