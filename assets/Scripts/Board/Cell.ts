import { _decorator, Color, Component, Enum, Sprite } from 'cc';
import { Content } from './Content';

const { ccclass, property } = _decorator;

export enum CellState {
    Empty,
    Occupied
};
Enum(CellState);

@ccclass('Cell')
export class Cell extends Component {
    @property(Sprite)
    private sprite: Sprite | null = null;
    
    @property(Content)
    private content: Content;

    private cellState: CellState;

    private row: number = 0;
    private col: number = 0;

    public get isEmpty(): boolean {
        return this.cellState === CellState.Empty;
    }

    public getIndex(): { row: number; col: number } {
        return { row: this.row, col: this.col };
    }

    public setIndex(row: number, col: number): void {
        this.row = row;
        this.col = col;
    }

    public setColor(color: Color): void {
        if (this.sprite) {
            this.sprite.color = color;
        } else {
            console.warn('Sprite component is not assigned to this cell.');
        }       
    }   
}