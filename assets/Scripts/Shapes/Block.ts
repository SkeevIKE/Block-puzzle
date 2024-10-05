import { _decorator, Component, Node } from 'cc';
import { Cell } from '../Board/Cell';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {      
    private bottomCell: Cell;  

}