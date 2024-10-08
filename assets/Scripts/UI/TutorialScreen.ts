import { _decorator, Color, Component, Sprite, Node, Vec3, input, Input, BoxCollider2D } from 'cc';
import { TweenAnimation } from '../Tools/TweenAnimation';
import { ShapesFactory } from '../Tools/ShapesFactory';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { Shape } from '../Shapes/Shape';

const { ccclass, property } = _decorator;

@ccclass('TutorialScreen')
export class TutorialScreen extends Component {
    @property(Node)
    private handNode: Node;

    @property(Sprite)
    private handSprite: Sprite;

    @property(Sprite)
    private handShadow: Sprite;

    @property(Node)
    private spawner: Node;

    @property(Node)
    private target: Node;

    private shape: Shape;

    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_START, this.hide, this);
        this.setSpritOpacity(this.handSprite, 0);
    }

    public show(): void {
        const shape = this.spawner.getComponentInChildren(Shape);
        const shapesFactory: ShapesFactory = ServiceAllocator.get(ServiceKey.ShapesFactory);
        this.shape = shapesFactory.createShape(shape.getShapeType, this.handNode);
        this.shape.getComponent(BoxCollider2D).enabled = false;
        this.handSprite.node.setSiblingIndex(this.handNode.children.length - 1);
        this.handShadow.node.setSiblingIndex(this.handNode.children.length - 2);
        this.moveShape();
    }

    private hide(): void {
        input.off(Input.EventType.TOUCH_START, this.hide, this);
        TweenAnimation.stopFadeTween(this.handSprite);
        TweenAnimation.stopFadeTween(this.handShadow);
        TweenAnimation.stopAllTweens(this.handNode);
        this.node.active = false;
    }

    private moveShape = (): void => {
        this.handNode.setWorldPosition(this.spawner.getWorldPosition());
        this.node.active = true;
        this.handNode.setWorldScale(this.spawner.getWorldScale());
        TweenAnimation.fadeTo(this.handSprite, 255, 0.4, `sineOut`);
        TweenAnimation.fadeTo(this.handShadow, 255, 0.3, `sineOut`);
        TweenAnimation.scaleTo(this.handNode, Vec3.ONE, 0.3, `sineOut`);
        TweenAnimation.moveTo(this.handNode, this.target.getWorldPosition(), 1.35, `quadOut`, this.targetAnimation);
    }

    private targetAnimation = (): void => {
        TweenAnimation.fadeTo(this.handSprite, 0, 0.3, 'sineOut', this.moveShape);
        TweenAnimation.fadeTo(this.handShadow, 0, 0.2, 'sineOut', this.moveShape);
    }

    private setSpritOpacity(sprite: Sprite, opacity: number): void {
        const color = sprite.color.clone();
        sprite.color = new Color(color.r, color.g, color.b, opacity);
    }
}