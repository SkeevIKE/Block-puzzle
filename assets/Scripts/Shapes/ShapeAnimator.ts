import { Node, Quat, Vec3 } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { TweenAnimation } from '../Tools/TweenAnimation';
import { GameSettings } from '../Level/GameSettings';
import { EventEmitter } from '../Tools/EventEmitter';

export class ShapeAnimator {
    private readonly LERP_UPDATE_INTERVAL: number = 0.02;
    private readonly LERP_STEP_INTERVAL_MS: number = 10;

    private _isStopLerping: boolean = false;
    private startNodePosition: Vec3 = new Vec3();  
    private startNodeScale: Vec3 = new Vec3();
    private setting: GameSettings;

    public moveToBoardEnded: EventEmitter = new EventEmitter();

    constructor() {
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
    }

    public animateSpawn(node: Node): void {
        this.startNodePosition.set(node.getWorldPosition());       
        this.startNodeScale.set(node.getWorldScale());
        const scale = this.setting.getDragShapeScale;
        node.worldScale = scale;        
        this.resetPositionAndScale(node);
    }

    public animateTouch(node: Node, position: Vec3): void {
        this._isStopLerping = false;
        this.lerpToPosition(node, position);
        const scale = this.setting.getDragShapeScale;
        TweenAnimation.scaleTo(node, scale);
    }

    public animateDrag(node: Node, position: Vec3): void {
        this.lerpToPosition(node, position);
    }

    public moveToBoard(node: Node, currentBlockPosition: Vec3, bottomCellPosition: Vec3,): void {
        this._isStopLerping = true;
        const offset = node.worldPosition.clone().subtract(currentBlockPosition);
        const targetPosition = bottomCellPosition.clone().add(offset);
        TweenAnimation.moveTo(node, targetPosition, 0.15, 'sineIn', () => this.moveToBoardEnded.Invoke());
    }

    public resetPositionAndScale(node: Node): void {
        this._isStopLerping = true;
        node.setWorldPosition(this.startNodePosition);
        TweenAnimation.scaleTo(node, this.startNodeScale, 0.4, "elasticOut");
    }

    private lerpToPosition(node: Node, targetPosition: Vec3, time: number = 0.1): void {
        let currentTime = 0;
        const offset = this.setting.getDragShapeOffset;
        targetPosition.add(offset)
        const startPosition = node.getWorldPosition().clone();
        const updatePosition = () => {
            if (this._isStopLerping) {
                return;
            }
            currentTime += this.LERP_UPDATE_INTERVAL;
            const t = Math.min(currentTime / time, 1);
            const newPosition = startPosition.clone().lerp(targetPosition, t);
            node.setWorldPosition(newPosition);
            if (t < 1) {
                setTimeout(updatePosition, this.LERP_STEP_INTERVAL_MS);
            } else {
                this._isStopLerping = false;
            }
        };
        updatePosition();
    }
}