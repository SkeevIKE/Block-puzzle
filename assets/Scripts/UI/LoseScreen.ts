import { _decorator, Color, Component, Sprite } from 'cc';
import { TweenAnimation } from '../Tools/TweenAnimation';

const { ccclass, property } = _decorator;

@ccclass('LoseScreen')
export class LoseScreen extends Component {
    @property(Sprite)
    private group: Sprite;

    @property(Sprite)
    private background: Sprite;

    protected onLoad(): void {
        this.setSpritOpacity(this.group, 0);
        this.setSpritOpacity(this.background, 0);            
        this.node.active = false;
    }

    public show = (): void => {
        this.node.active = true;
        TweenAnimation.fadeTo(this.group, 255, 0.6);
        TweenAnimation.fadeTo(this.background, 230, 0.6);         
    }

    private setSpritOpacity(sprite: Sprite, opacity: number): void {
        const color = sprite.color.clone();
        sprite.color = new Color(color.r, color.g, color.b, opacity);
    }
}