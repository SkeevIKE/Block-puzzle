import { _decorator, Component, Node, PhysicsSystem2D, Vec2, Color, Sprite } from 'cc';
import { Cell } from '../Board/Cell';
import { GameSettings } from '../Game/GameSettings';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';

const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    private readonly OPACITY_VALUE = 50;

    @property(Sprite)
    private sprite: Sprite;

    private indexX: number = -1;
    private indexY: number = -1;
    private underBoardIndexX: number = -1;
    private underBoardIndexY: number = -1;
    private setting: GameSettings;
    private startColor: Color;

    public get getIndex(): [x: number, y: number] {
        return [this.indexX, this.indexY];
    }

    public get underBoardIndex(): [x: number, y: number] {
        return [this.underBoardIndexX, this.underBoardIndexY];
    }

    public initialize(x: number, y: number): void {
        this.indexX = x;
        this.indexY = y;
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
        this.startColor = this.sprite.color.clone();
    }

    public setBoardIndex(x: number, y: number): void {
        this.underBoardIndexX = x;
        this.underBoardIndexY = y;
    }

    public setNormalColor(): void {
        this.sprite.color = this.startColor;
    }

    public setHighlightColor(): void {
        this.sprite.color = this.setting.getContentPaternColor;
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
            if (!cell || !cell.isEmpty) {
                continue;
            }
            return cell;
        }
        return null;
    }
}
