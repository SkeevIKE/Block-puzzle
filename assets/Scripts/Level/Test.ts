import { _decorator, Component, Node, PhysicsSystem2D, Sprite, input, Vec2, Input, EventTouch, Vec3, Camera, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property(UITransform)
    private uiTransform: UITransform;

    protected onLoad() {
        input.on(Input.EventType.TOUCH_MOVE, this.Check, this);
    }

    private Check(event: EventTouch) {
        const positionScreen = event.getUILocation();        
        
      //  const localPosition = this.uiTransform.convertToNodeSpaceAR(new Vec3(positionScreen.x, positionScreen.y, 0));
        
       // this.node.setPosition(localPosition);   
        
       
        let colliders = PhysicsSystem2D.instance.testPoint(positionScreen);

        for (let collider of colliders) {
            if (collider.node.getComponent(Sprite)) {
                console.log("Sprite найден");
            }
        }
    }
}
