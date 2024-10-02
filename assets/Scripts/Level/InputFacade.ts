import { _decorator, Component, Vec3, Vec2, EventTouch, input, Input } from 'cc';
import { Delegate } from '../Tools/Delegate';
const { ccclass, property } = _decorator;

@ccclass('InputFacade')
export class InputFacade extends Component {

    @property
    Sensitive: number = 1;

    public DownTouched: Delegate = new Delegate();
    public UpTouched: Delegate = new Delegate();
    public OffsetChanged: Delegate<[Vec2]> = new Delegate<[Vec2]>();
    public DeltaChanged: Delegate<[Vec2]> = new Delegate<[Vec2]>();

    private isTouch: boolean = false;
    private isUpdate: boolean = false;
    private startPoint: Vec2 = new Vec2();
    private lastPosition: Vec2 = new Vec2();
    private delta: Vec2 = new Vec2();
    private offset: Vec2 = new Vec2();

    protected onLoad() {        
        input.on(Input.EventType.TOUCH_START, this.onTouchDown, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchUp, this);
    }

    private onTouchDown(event: EventTouch) {
        const positionScreen = event.getUILocation();
        this.startPoint = new Vec2(positionScreen.x, positionScreen.y);
        this.isTouch = true;
        this.lastPosition.set(positionScreen.x, positionScreen.y);
        this.DownTouched.Invoke();
    }

    private onTouchMove(event: EventTouch) {
        if (!this.isTouch)
            return;

        const positionScreen = event.getUILocation();
        this.offset = positionScreen.clone().subtract(this.startPoint);
        this.delta = positionScreen.clone().subtract(this.lastPosition);
        this.lastPosition = positionScreen;
        let scaledOffset = this.offset.clone().multiplyScalar(this.Sensitive);
        this.OffsetChanged.Invoke(scaledOffset);
        this.isUpdate = true;
    }

    protected update() {
        if (!this.isTouch || !this.isUpdate)
            return;

        let scaledDelta = this.delta.clone().multiplyScalar(this.Sensitive);
        if (!this.delta.equals(Vec2.ZERO)) {
            this.DeltaChanged.Invoke(scaledDelta);
            this.delta.set(0, 0);
        } else {
            this.DeltaChanged.Invoke(scaledDelta);
            this.isUpdate = false;
        }       
    }

    private onTouchUp(_: EventTouch) {
        this.isTouch = false;
        this.UpTouched.Invoke();
        this.OffsetChanged.Invoke(Vec2.ZERO);
        this.DeltaChanged.Invoke(Vec2.ZERO);

        this.isUpdate = false;
        this.delta.set(0, 0);
        this.offset.set(0, 0);
    }

    protected onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchDown, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchUp, this);
    }
}