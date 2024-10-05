import { _decorator, Component, Node, UITransform } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ShapesFactory } from '../Tools/ShapesFactory';
import { CellsFactory } from '../Tools/CellsFactory';
import { DragAndDrop } from './DragAndDrop';
import { GameSettings } from './GameSettings';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
   
    @property(GameSettings)
    private setting: GameSettings;

    onLoad() {
        ServiceAllocator.register(ServiceKey.GameSettings, this.setting);
        ServiceAllocator.register(ServiceKey.ShapesFactory, new ShapesFactory());
        ServiceAllocator.register(ServiceKey.CellsFactory, new CellsFactory());
        ServiceAllocator.register(ServiceKey.DragAndDrop, new DragAndDrop());
    }

    protected onDestroy(): void {
        (ServiceAllocator.get(ServiceKey.GameSettings) as GameSettings).destroy();       
        (ServiceAllocator.get(ServiceKey.ShapesFactory) as ShapesFactory).destroy();       
        (ServiceAllocator.get(ServiceKey.CellsFactory) as CellsFactory).destroy();       
        (ServiceAllocator.get(ServiceKey.DragAndDrop) as DragAndDrop).destroy();       
        ServiceAllocator.unregister(ServiceKey.GameSettings);
        ServiceAllocator.unregister(ServiceKey.ShapesFactory);
        ServiceAllocator.unregister(ServiceKey.CellsFactory);
        ServiceAllocator.unregister(ServiceKey.DragAndDrop);
    }
}


