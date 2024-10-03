import { _decorator, Vec2, EventTouch, input, Input } from 'cc';
import { EventEmitter } from "../Tools/EventEmitter";
import { IInputService } from '../Tools/Interfaces';

const { ccclass, property } = _decorator;

@ccclass('InputFacade')
export class InputService implements IInputService {
    public DownTouched: EventEmitter<[Vec2]> = new EventEmitter<[Vec2]>();
    public UpTouched: EventEmitter<[Vec2]> = new EventEmitter<[Vec2]>();
    public Dragging: EventEmitter<[Vec2]> = new EventEmitter<[Vec2]>();

    constructor() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        const positionScreen = event.getUILocation();
        this.DownTouched.Invoke(positionScreen);
    }

    private onTouchMove(event: EventTouch): void {
        const positionScreen = event.getUILocation();
        this.Dragging.Invoke(positionScreen);
    }

    private onTouchEnd(event: EventTouch): void {
        const positionScreen = event.getUILocation();
        this.UpTouched.Invoke(positionScreen);
    }

    public destroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}