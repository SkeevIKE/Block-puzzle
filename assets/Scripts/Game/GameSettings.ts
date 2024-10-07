import { _decorator, Color, Component, Vec3 } from 'cc';
import { ShapeProbability } from '../Shapes/ShapeProbability';
const { ccclass, property } = _decorator;

@ccclass('GameSettings')
export class GameSettings extends Component {

    @property({ type: [ShapeProbability], group: 'Spawner settings' })
    private shapeProbabilities: ShapeProbability[] = [];

    @property({ group: 'Game settings' })
    private dragShapeOffset: Vec3 = new Vec3();

    @property({ group: 'Game settings' })
    private dragShapeScale: Vec3 = new Vec3();

    @property({ group: 'Game settings' })
    private zoneColor: Color = new Color();

    @property({ group: 'Game settings' })
    private shapeShadowColor: Color = new Color();

    @property({ group: 'Game settings' })
    private contentPaternColor: Color = new Color();

    @property({ group: 'Game settings' })
    private isDebag: boolean = false;   

    public get getShapeProbabilities() {
        return this.shapeProbabilities;
    }

    public get getDragShapeOffset() {
        return this.dragShapeOffset;
    }

    public get getDragShapeScale() {
        return this.dragShapeScale;
    }

    public get getZoneColor() {
        return this.zoneColor;
    }

    public get getShapeShadowColor() {
        return this.shapeShadowColor;
    }

    public get getContentPaternColor() {
        return this.contentPaternColor;
    }

    public get getIsDebag(): boolean {
        return this.isDebag;
    }
}


