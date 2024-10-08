import { _decorator, Color, Component, Enum, Sprite } from 'cc';
import { Content } from './Content';
import { GameSettings } from '../Game/GameSettings';
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
    private sprite: Sprite;

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

    public get isEmpty(): boolean {
        return this.cellState === CellState.Empty;
    }  

    public initialize(x: number, y: number): void {
        this.setting = ServiceAllocator.get(ServiceKey.GameSettings);
        this.indexX = x;
        this.indexY = y;  
        this.content.initialize(); 
    }

    public setStartColor(isZone: boolean): void {
        if (isZone){
            this.sprite.color = this.setting.getZoneColor;
        }

        this.startColor = this.sprite.color.clone();
    }      

    public setHighlightColor(): void {      
        this.content.setHighlightColor();
        this.sprite.color = this.setting.getShapeShadowColor; 
    }

    public setNormalColor(): void { 
        this.sprite.color = this.startColor;
        this.content.setNormalColor();
    }

    public setEmpty(): void {        
        this.sprite.color = this.startColor;
        this.cellState = CellState.Empty;
        this.content.setDisable();
    }  

    public setOccupied(): void {
        this.cellState = CellState.Occupied;
        this.content.setEnable();
    }    
}