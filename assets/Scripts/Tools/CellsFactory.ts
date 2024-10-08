import { _decorator, instantiate, Prefab, resources, Node } from 'cc';
import { Cell } from '../Board/Cell';
import { spawnBorderZones } from '../Board/CheckerLogic';
import { Debugger } from './Debugger';

export class CellsFactory {
    private readonly PATH: string = 'Prefabs/Cells/Cell';    

    private cellPrefab: Prefab | null = null;
    private isLoaded: boolean = false;
    private loadingPromise: Promise<void> | null = null;    

    public async loadCellPrefab(): Promise<void> {
        if (this.isLoaded) {
            console.warn('Cell prefab is already loaded. Skipping loading process.');
            return;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise<void>((resolve, reject) => {
            resources.load(this.PATH, Prefab, (err, prefab) => {
                if (err) {
                    console.error(`Error loading cell prefab from path: ${this.PATH}`, err);
                    this.loadingPromise = null;
                    reject(err);
                    return;
                }

                this.isLoaded = true;
                this.cellPrefab = prefab;
                resolve();
            });
        });

        return this.loadingPromise;
    }

    public isReady(): boolean {
        return this.isLoaded;
    }

    public createCells(rows: number, cols: number, parentTransform: Node): Cell[][] {
        if (!this.isLoaded || !this.cellPrefab) {
            throw new Error('CellsFactory is not loaded yet. Please wait for the load to complete before creating cells.');
        }

        const cells: Cell[][] = [];
        for (let row = 0; row < rows; row++) {
            cells[row] = [];
            for (let col = 0; col < cols; col++) {
                const cellNode = instantiate(this.cellPrefab);
                cellNode.setParent(parentTransform);
                const cell = cellNode.getComponent(Cell);
                if (!cell) {
                    throw new Error('Cell component not found on instantiated prefab.');
                }
                cell.initialize(row, col);
                cells[row][col] = cell;
                Debugger.createLabel(cell.node, row, col);         
            }
        }
        
        this.highlightZones(rows, cols, cells);
        return cells;
    }

    private highlightZones(rows: number, cols: number, cells: Cell[][]): void {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let isInZone = false;
                for (const zone of spawnBorderZones) {
                    if (row >= zone.startRow && row <= zone.endRow && col >= zone.startCol && col <= zone.endCol) {
                        isInZone = true;
                        break;
                    }
                }
                cells[row][col].setStartColor(isInZone);
            }
        }
    }      

    public destroy(): void {
        this.isLoaded = false;
        this.cellPrefab = null;
        this.loadingPromise = null;        
    }
}
