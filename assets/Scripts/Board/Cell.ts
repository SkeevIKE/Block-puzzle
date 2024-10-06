import { _decorator, Color, Component, Enum, Sprite } from 'cc';
import { Content } from './Content';
import { GameSettings } from '../Level/GameSettings';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';

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

    private indexX: number = -1;
    private indexY: number = -1;   
    private cellState: CellState = CellState.Empty;
    private startColor: Color;
    private setting: GameSettings;
    
    public get getIndex(): [x: number, y: number] {
        return [ this.indexX, this.indexY ];
    }   

    public initialize(x: number, y: number): void {
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
        this.indexX = x;
        this.indexY = y;   
    }

    public setStartColor(isZone: boolean): void {
        if (isZone){
            this.sprite.color = this.setting.getZoneColor;
        }

        this.startColor = this.sprite.color.clone();
    }

    public isEmpty(): boolean {
        return this.cellState === CellState.Empty;
    } 

    public setNormalColor(): void {        
        this.sprite.color = this.startColor;
    }
    
    public setShodowColor(): void {
        this.sprite.color = this.setting.getShapeShadowColor;
    }

    public setEmpty(): void {
        this.cellState = CellState.Empty;
        this.content.setDisable();
    }  

    public setOccupied(): void {
        this.cellState = CellState.Occupied;
        this.content.setEnable();
    }    
}