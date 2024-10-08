import { _decorator, Color, Component, Quat, Sprite, Vec3 } from 'cc';
import { TweenAnimation } from '../Tools/TweenAnimation';
import { GameSettings } from '../Game/GameSettings';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';

const { ccclass, property } = _decorator;

@ccclass('Content')
export class Content extends Component {
    @property(Sprite)
    private sprite: Sprite | null = null;

    private startColor: Color;
    private startRotatio: Quat;
    private startScale: Vec3;
    private setting: GameSettings;

    public initialize(): void {
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
        this.startColor = this.sprite.color.clone();
        this.startRotatio = this.node.rotation.clone();
        this.startScale = this.node.scale.clone();
    }

    public setEnable(): void {
        this.node.active = true;
    }

    public setHighlightColor(): void {
        if (this.node.active) {
            this.sprite.color = this.setting.getContentPaternColor;
        }
    }

    public setNormalColor(): void {
        if (this.node.active) {
            this.sprite.color = this.startColor;
        }
    }

    public setDisable(): void {
        if (!this.node.active)
            this.node.active = true;

        const rotation180 = new Quat();
        TweenAnimation.rotateTo(this.node, Quat.fromEuler(rotation180, 0, 0, 180), 0.4, 'sineIn');
        TweenAnimation.scaleTo(this.node, Vec3.ZERO, 0.4, 'sineIn', this.onHideAnimationEnded);
    }

    private onHideAnimationEnded = (): void => {
        this.node.setRotation(this.startRotatio);
        this.node.setScale(this.startScale);
        this.sprite.color = this.startColor;
        this.node.active = false;
    }
}