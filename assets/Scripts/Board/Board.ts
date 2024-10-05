import { _decorator, Component, Node } from 'cc';
import { CellsFactory } from '../Tools/CellsFactory';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { Cell } from './Cell';

const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property({ type: Node, group: 'Board Settings', displayName: 'Spawn Positions' })
    private spawnNode: Node;

    private rows: number = 9;
    private cols: number = 9; 
    private cellsFactory: CellsFactory;
    private cells: Cell[][] = [];    

    protected async start() { 
        this.cellsFactory = ServiceAllocator.get(ServiceKey.CellsFactory);      
        await this.cellsFactory.loadCellPrefab();
        this.cells = this.cellsFactory.createCells(this.rows, this.cols, this.spawnNode);      
    }
}