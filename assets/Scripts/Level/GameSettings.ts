import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component {

    @property(Vec3)
    private dragShapeOffset: Vec3 = new Vec3();

    @property(Vec3)
    private dragShapeScale: Vec3 = new Vec3();

    public getDragShapeOffset() {
        return this.dragShapeOffset;
    }

    public getDragShapeScale() {
        return this.dragShapeScale;
    }
}


