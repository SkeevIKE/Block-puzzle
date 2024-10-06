import { _decorator, Component, Node } from 'cc';
import { CellsFactory } from '../Tools/CellsFactory';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ZonesChecker } from './Zones';
import { Cell } from './Cell';

const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property({ type: Node, displayName: 'Spawn Positions' })
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

    public getCell(value: [x: number, y: number]): Cell | null {
        if (value[0] < 0 || value[1] < 0 || value[0] >= this.rows || value[1] >= this.cols) {
            return null;
        }
        const cell = this.cells[value[0]][value[1]];
        return cell !== null ? cell : null;
    }

    public checkPattern(): number {
        return ZonesChecker.checkPattern(this.cells, this.rows, this.cols);
    }

    public canPlaceShape(shapeIndices: [number, number][]): boolean {
        return ZonesChecker.isCanPlaceShape(this.cells, this.rows, this.cols, shapeIndices);
    }
}