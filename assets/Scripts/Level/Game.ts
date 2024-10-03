import { _decorator, Component, Node } from 'cc';
import { ServiceAllocator } from '../Tools/ServiceAllocator';
import { IInputService } from '../Tools/Interfaces';
import { InputService } from './InputService';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
private inputService: IInputService;

    start() {
        this.inputService = new InputService();
        ServiceAllocator.register<IInputService>(this.inputService);

        
    }
   
}


