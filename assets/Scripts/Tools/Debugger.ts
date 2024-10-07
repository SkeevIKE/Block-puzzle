import { _decorator, Color, Label, Layers, Node } from 'cc';
import { GameSettings } from "../Level/GameSettings";
import { ServiceAllocator, ServiceKey } from "./ServiceAllocator";

export class Debugger { 
    public static createLabel(node: Node, x: number, y: number) : void{
        if ((ServiceAllocator.get(ServiceKey.GameSettings) as GameSettings).getIsDebag) {
            const labelNode = new Node("label");
            labelNode.setScale(0.7, 0.7, 0.7);
            labelNode.layer = Layers.Enum.UI_2D;
            const label = labelNode.addComponent(Label);
            label.color = Color.RED;
            labelNode.setParent(node);
            label.string = `${x}, ${y}`;
        }
    }
}