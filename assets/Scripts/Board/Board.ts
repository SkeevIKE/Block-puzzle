import { _decorator, Component, Node } from 'cc';
import { Cell } from './Cell';

const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property({ type: [Cell] })
    private grid: Cell[] = [];

    private cells: Cell[][] = [];
    private rows: number = 9;
    private cols: number = 9;

    onEnable() {
        if (this.grid.length !== this.rows * this.cols) {
            console.error(`The number of cells in _grid (${this.grid.length}) does not match the expected (${this.rows * this.cols}).`);
            return;
        }

        for (let row = 0; row < this.rows; row++) {            
            this.cells[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const index = row * this.cols + col;
                const cell = this.grid[index];
                cell.setIndex(row, col);
                this.cells[row][col] = cell;
            }
        }
    }
}