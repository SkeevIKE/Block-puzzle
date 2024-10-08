import { _decorator, BoxCollider2D, Component, Vec3 } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { IndexCalculator } from '../Tools/IndexCalculator';
import { EventEmitter } from '../Tools/EventEmitter';
import { ShapeAnimator } from './ShapeAnimator';
import { ShapeType } from '../Tools/Enams';
import { Board } from '../Board/Board';
import { Cell } from '../Board/Cell';
import { Block } from './Block';

const { ccclass, property } = _decorator;

@ccclass('Shape')
export class Shape extends Component {
    @property({ type: ShapeType })
    private shapeType: ShapeType = ShapeType.Point;

    @property(BoxCollider2D)
    private collider: BoxCollider2D;

    @property([Block])
    private blocks: Block[] = [];

    private board: Board;
    private animator: ShapeAnimator;
    private currentBlock: Block;
    private bottomCell: Cell;
    private isHasEmptyBottomCells: boolean;

    public destroed: EventEmitter<[Shape]> = new EventEmitter<[Shape]>();
    public droped: EventEmitter = new EventEmitter();

    // also called by the shapes factory when searching for the required type in the resource folder
    public get getShapeType(): ShapeType {
        return this.shapeType;
    }

    protected onEnable(): void {
        IndexCalculator.calculateIndices(this.blocks);
        this.animator = new ShapeAnimator();
        this.animator.animateSpawn(this.node);
        this.board = ServiceAllocator.get(ServiceKey.Board);
        this.animator.moveToBoardEnded.Subscribe(this.onAnimatorMoveToBoardEnded);
    }

    protected onDestroy(): void {
        this.destroed.Invoke(this);
    }

    public checkIsCanPlaceShapeToBord(): boolean {
        const shapeIndices: [number, number][] = this.blocks.map(block => block.getIndex);
        const isCanPlace = this.board.canPlaceShape(shapeIndices);
        this.blocks.forEach(block => isCanPlace ? block.setNormalColor() : block.setDeactivatedColor());
        this.collider.enabled = isCanPlace;
        return isCanPlace;
    }

    public touch(position: Vec3): void {
        this.animator.animateTouch(this.node, position);
        this.collider.enabled = false;
    }

    public drag(position: Vec3): void {
        this.animator.animateDrag(this.node, position);
        this.updateBottomCells();
    }

    public drop(): void {
        if (this.bottomCell && this.isHasEmptyBottomCells) {
            this.animator.moveToBoard(this.node, this.currentBlock.node.worldPosition, this.bottomCell.node.worldPosition);
        }
        else {
            this.animator.resetPositionAndScale(this.node);
            this.droped?.Invoke();
            this.collider.enabled = true;
        }
    }

    private updateBottomCells(): void {
        if (this.currentBlock) {
            this.updateCurrentBottomCell(this.currentBlock);
        } else {
            for (let i = 0; i < this.blocks.length; i++) {
                if (this.updateCurrentBottomCell(this.blocks[i])) {
                    break;
                }
            }
        }
        const bottomCellIndex = this.bottomCell ? this.bottomCell.getIndex : null;
        const currentBlockIndex = this.bottomCell ? this.currentBlock.getIndex : null;
        const blocks = this.bottomCell ? this.blocks : null;
        this.isHasEmptyBottomCells = this.board.getShapeInCells(bottomCellIndex, currentBlockIndex, blocks);
    }

    private updateCurrentBottomCell(block: Block): boolean {
        const cell = block.checkBottomCell();
        if (cell) {
            if (this.bottomCell != cell) {
                this.bottomCell = cell;
                this.currentBlock = block;
            }
            return true;
        } else {
            this.bottomCell = null;
            this.currentBlock = null;
            return false;
        }
    }

    private onAnimatorMoveToBoardEnded = (): void => {
        this.animator.moveToBoardEnded.Unsubscribe(this.onAnimatorMoveToBoardEnded);
        this.board.addShape();
        this.node.destroy();
    }
}