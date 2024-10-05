import { _decorator, instantiate, Prefab, resources, Color, Node } from 'cc';
import { Cell } from '../Board/Cell';
import { zones } from '../Board/Zones';

export class CellsFactory {
    private path: string = 'Prefabs/Cells/Cell';
    private zoneColor = new Color(200, 200, 200); 
    private cellPrefab: Prefab | null = null;
    private isLoaded: boolean = false;
    private loadingPromise: Promise<void> | null = null;
    private cells: Cell[][] = [];

    public async loadCellPrefab(): Promise<void> {
        if (this.isLoaded) {
            console.warn('Cell prefab is already loaded. Skipping loading process.');
            return;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise<void>((resolve, reject) => {
            resources.load(this.path, Prefab, (err, prefab) => {
                if (err) {
                    console.error(`Error loading cell prefab from path: ${this.path}`, err);
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

        this.cells = [];
        for (let row = 0; row < rows; row++) {
            this.cells[row] = [];
            for (let col = 0; col < cols; col++) {
                const cellNode = instantiate(this.cellPrefab);
                cellNode.setParent(parentTransform);
                const cell = cellNode.getComponent(Cell);
                if (!cell) {
                    throw new Error('Cell component not found on instantiated prefab.');
                }
                cell.setIndex(row, col);
                this.cells[row][col] = cell;
            }
        }
        
        this.highlightZones(rows, cols);
        return this.cells;
    }

    private highlightZones(rows: number, cols: number): void { 
        for (const zone of zones) {
            for (let row = zone.startRow; row <= zone.endRow; row++) {
                for (let col = zone.startCol; col <= zone.endCol; col++) {
                    if (row < rows && col < cols) {
                        const cell = this.cells[row][col];
                        if (cell) {
                            cell.setColor(this.zoneColor);
                        }
                    }
                }
            }
        }
    }      

    public destroy(): void {
        this.isLoaded = false;
        this.cellPrefab = null;
        this.loadingPromise = null;
        this.cells = [];
    }
}
