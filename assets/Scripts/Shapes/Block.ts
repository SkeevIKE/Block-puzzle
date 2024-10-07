import { _decorator, Component, Node, PhysicsSystem2D, Vec2, BoxCollider2D, Color, Label, instantiate, Sprite } from 'cc';
import { Cell } from '../Board/Cell';

const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    private readonly OPACITY_VALUE = 50;

    @property(Sprite)
    private sprite: Sprite | null = null;

    private indexX: number = -1;
    private indexY: number = -1;
    private startColor: Color;

    public get getIndex(): [x: number, y: number] {
        return [this.indexX, this.indexY];
    }

    public initialize(x: number, y: number): void {
        this.indexX = x;
        this.indexY = y;
        this.startColor = this.sprite.color.clone();
    }

    public setActivatedColor(): void {
        this.sprite.color = this.startColor.clone();
    }

    public setDeactivatedColor(): void {
        const alfaColor = this.sprite.color.clone();
        alfaColor.a = this.OPACITY_VALUE;
        this.sprite.color = alfaColor;
    }

    public checkBottomCell(): Cell | null {
        const origin = new Vec2(this.node.worldPosition.x, this.node.worldPosition.y);
        let colliders = PhysicsSystem2D.instance.testPoint(origin);
        for (let collider of colliders) {
            const cell = collider.node.getComponent(Cell);
            if (!cell || !cell.isEmpty()) {
                continue;
            }
            return cell;
        }
        return null;
    }
}
