import { _decorator } from "cc";
import { ShapeType } from "../Tools/Enams";
const { ccclass, property } = _decorator;

@ccclass('ShapeProbability')
export class ShapeProbability {

    @property({ type: ShapeType })
    shapeType: ShapeType = ShapeType.Point;

    @property({ min: 0, max: 100, slide: true })
    weight: number = 0;
}