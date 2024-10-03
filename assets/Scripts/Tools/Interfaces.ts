import { Vec2 } from "cc";
import { EventEmitter } from "./EventEmitter";

export interface IInputService {  
    DownTouched: EventEmitter<[Vec2]>;
    UpTouched: EventEmitter<[Vec2]>;    
    Dragging: EventEmitter<[Vec2]>;
    destroy(): void;
}