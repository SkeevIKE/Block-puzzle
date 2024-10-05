import { _decorator, Vec2, EventTouch, input, Input, PhysicsSystem2D, Vec3 } from 'cc';
import { Shape } from '../Shapes/Shape';

export class DragAndDrop {

    private selectedShape: Shape = null;

    constructor() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public destroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        this.touch(event.getUILocation());
    }

    private onTouchMove(event: EventTouch): void {
        this.drag(event.getUILocation());
    }

    private onTouchEnd(): void {
        this.drop();
    }

    private touch(position: Vec2) {
        let colliders = PhysicsSystem2D.instance.testPoint(position);        
        for (let collider of colliders) {
            const shape = collider.node.parent.getComponent(Shape);
            if (shape) {
                this.selectedShape = shape;
                const vec3position = new Vec3(position.x, position.y, 0)
                this.selectedShape.touch(vec3position);
            }
        }
    }

    private drag(position: Vec2): void {
        if (this.selectedShape === null)
            return;

        const vec3position = new Vec3(position.x, position.y, 0)
        this.selectedShape.drag(vec3position);
    }

    private drop(): void {
        if (this.selectedShape === null)
            return;   

        this.selectedShape.drop();
        this.selectedShape = null;
    }
}