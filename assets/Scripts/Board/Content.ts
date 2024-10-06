import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { TweenAnimation } from '../Tools/TweenAnimation';

const { ccclass, property } = _decorator;

@ccclass('Content')
export class Content extends Component {
    private startRotatio: Quat;
    private startScale: Vec3;

    protected start(): void {
        this.startRotatio = this.node.rotation.clone();
        this.startScale = this.node.scale.clone();
    }

    public setEnable(): void {
        this.node.active = true;
    }

    public setDisable(): void {
        const rotation180 = new Quat();       
        TweenAnimation.rotateTo(this.node, Quat.fromEuler(rotation180, 0, 0, 180), 0.4, 'sineIn');
        TweenAnimation.scaleTo(this.node, Vec3.ZERO, 0.4, 'sineIn', this.onHideAnimationEnded);
    }

    private onHideAnimationEnded = () => {       
        this.node.setRotation(this.startRotatio);
        this.node.setScale(this.startScale);
        this.node.active = false;
    }
}