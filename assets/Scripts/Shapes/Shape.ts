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
    private bottomCells: Cell[] = [];

    public destroed: EventEmitter<Shape> = new EventEmitter<Shape>();

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

    // called by the shapes factory when searching for the required type in the resource folder
    public getShapeType(): ShapeType {
        return this.shapeType;
    }

    public checkIsCanPlaceShapeToBord(): void {
        const shapeIndices: [number, number][] = this.blocks.map(block => block.getIndex);
        const isCanPlace = this.board.canPlaceShape(shapeIndices);    
        this.blocks.forEach(block => isCanPlace ? block.setActivatedColor() : block.setDeactivatedColor());
        this.collider.enabled = isCanPlace;
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
        if (this.bottomCells.length > 0) {
            this.animator.moveToBoard(this.node, this.currentBlock.node.worldPosition, this.bottomCell.node.worldPosition);
        }
        else {
            this.resetShadow();
            this.animator.resetPositionAndScale(this.node);
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
        this.checkCells();
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

    private checkCells(): void {
        if (!this.bottomCell) {
            this.resetShadow();
            return;
        }

        const bottomCells: Cell[] = [];
        const currentBlockIndex = this.currentBlock.getIndex;
        const bottomCellIndex = this.bottomCell.getIndex;
        let isEmpty = true;

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            let checkIndex: [x: number, y: number] = bottomCellIndex;

            if (block !== this.currentBlock) {
                const blockIndex = block.getIndex;
                checkIndex = [
                    bottomCellIndex[0] - (currentBlockIndex[0] - blockIndex[0]),
                    bottomCellIndex[1] - (currentBlockIndex[1] - blockIndex[1])
                ];
            }

            const cell = this.board.getCell(checkIndex);
            if (cell && cell.isEmpty()) {
                bottomCells.push(cell);
            } else {
                isEmpty = false;
                break;
            }
        }

        if (isEmpty) {
            this.resetShadow();
            bottomCells.forEach(cell => cell.setShodowColor());
            this.bottomCells = bottomCells;
        } else {
            this.resetShadow();
        }
    }

    private resetShadow(): void {
        if (this.bottomCells.length > 0) {
            this.bottomCells.forEach(cell => cell.setNormalColor());
            this.bottomCells = [];
        }
    }

    private onAnimatorMoveToBoardEnded = () => {
        this.animator.moveToBoardEnded.Unsubscribe(this.onAnimatorMoveToBoardEnded);
        if (this.bottomCells.length > 0) {
            this.bottomCells.forEach(cell => {  cell.setNormalColor(); cell.setOccupied(); });
        }
        this.node.destroy();
        this.board.checkPattern();
    }
}