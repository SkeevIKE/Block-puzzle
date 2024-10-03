import { _decorator, Component } from 'cc';
import { CellState } from '../Tools/Enams';
import { Block } from './Block';

const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    @property(Block)
    private block: Block;

    private cellState: CellState;

    private row: number = 0;
    private col: number = 0;

    public get isEmpty(): boolean {
        return this.cellState === CellState.Empty;
    }

    public setIndex(row: number, col: number): void {
        this.row = row;
        this.col = col;
    }

    public getIndex(): { row: number; col: number } {
        return { row: this.row, col: this.col };
    }
}