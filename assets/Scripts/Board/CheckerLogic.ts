import { Block } from "../Shapes/Block";
import { Board } from "./Board";
import { Cell } from "./Cell";

export const spawnBorderZones = [
    { startRow: 0, endRow: 2, startCol: 3, endCol: 5 },
    { startRow: 3, endRow: 5, startCol: 0, endCol: 2 },
    { startRow: 3, endRow: 5, startCol: 6, endCol: 8 },
    { startRow: 6, endRow: 8, startCol: 3, endCol: 5 },
];

export class CheckerLogic {
    public static isCanPlaceShape(cells: Cell[][], rows: number, cols: number, shapeIndices: [number, number][]): boolean {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (cells[row][col].isEmpty && this.isCanFitShapeAtPosition(cells, row, col, shapeIndices, rows, cols)) {
                    return true;
                }
            }
        }
        return false;
    }

    public static findShapeInCells(board: Board, cellIndex: [number, number] | null, currentBlockIndex: [number, number] | null, blocks: Block[] | null): [number, number][] | null {
        if (!cellIndex || !currentBlockIndex || !blocks) return null;

        const bottomCells: [number, number][] = [];
        for (const block of blocks) {
            const blockIndex = block.getIndex;
            const checkIndex: [number, number] = [
                cellIndex[0] - (currentBlockIndex[0] - blockIndex[0]),
                cellIndex[1] - (currentBlockIndex[1] - blockIndex[1])
            ];
            
            const cell = board.getCell(checkIndex);
            block.setBoardIndex(checkIndex[0], checkIndex[1]);
            if (cell && cell.isEmpty) {
                bottomCells.push(cell.getIndex);
            } else {
                return null;
            }
        }
        return bottomCells;
    }

    public static findMatchingPatterns(cells: Cell[][], cellsIndices: [number, number][], rows: number, cols: number): { matchedCells: Cell[], matchedPatternsCounter: number } {
        const matchedCells: Set<Cell> = new Set();
        let counter = 0;

        const rowOccupancy = new Array(rows).fill(0);
        const colOccupancy = new Array(cols).fill(0);
        const clusterOccupancy = new Array(9).fill(0);

        this.updateOccupancy(cells, rowOccupancy, colOccupancy, clusterOccupancy);
        this.updateOccupancyForNewCells(cellsIndices, rowOccupancy, colOccupancy, clusterOccupancy);

        const checkedRows = new Set<number>();
        const checkedCols = new Set<number>();
        const checkedClusters = new Set<number>();

        for (const [row, col] of cellsIndices) {
            if (!checkedRows.has(row) && rowOccupancy[row] === cols) {
                counter++;
                for (let c = 0; c < cols; c++) {
                    matchedCells.add(cells[row][c]);
                }
                checkedRows.add(row);
            }

            if (!checkedCols.has(col) && colOccupancy[col] === rows) {
                counter++;
                for (let r = 0; r < rows; r++) {
                    matchedCells.add(cells[r][col]);
                }
                checkedCols.add(col);
            }

            const clusterIndex = this.getClusterIndex(row, col);
            if (!checkedClusters.has(clusterIndex) && clusterOccupancy[clusterIndex] === 9) {
                counter++;
                this.addClusterCellsToMatched(cells, row, col, matchedCells);
                checkedClusters.add(clusterIndex);
            }
        }

        if (counter === 0) {
            cellsIndices.forEach(([row, col]) => {
                if (cells[row] && cells[row][col]) {
                    matchedCells.add(cells[row][col]);
                }
            });
        }

        return { matchedCells: Array.from(matchedCells), matchedPatternsCounter: counter };
    }

    private static isCanFitShapeAtPosition(cells: Cell[][], startRow: number, startCol: number, shapeIndices: [number, number][], rows: number, cols: number): boolean {
        for (const [dx, dy] of shapeIndices) {
            const row = startRow + dx;
            const col = startCol + dy;

            if (row < 0 || row >= rows || col < 0 || col >= cols || !cells[row][col].isEmpty) {
                return false;
            }
        }
        return true;
    }

    private static updateOccupancy(cells: Cell[][], rowOccupancy: number[], colOccupancy: number[], clusterOccupancy: number[]): void {
        for (let row = 0; row < cells.length; row++) {
            for (let col = 0; col < cells[row].length; col++) {
                if (!cells[row][col].isEmpty) {
                    rowOccupancy[row]++;
                    colOccupancy[col]++;
                    clusterOccupancy[this.getClusterIndex(row, col)]++;
                }
            }
        }
    }

    private static updateOccupancyForNewCells(cellsIndices: [number, number][], rowOccupancy: number[], colOccupancy: number[], clusterOccupancy: number[]): void {
        for (const [row, col] of cellsIndices) {
            rowOccupancy[row]++;
            colOccupancy[col]++;
            clusterOccupancy[this.getClusterIndex(row, col)]++;
        }
    }

    private static getClusterIndex(row: number, col: number): number {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    private static addClusterCellsToMatched(cells: Cell[][], row: number, col: number, matchedCells: Set<Cell>): void {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                matchedCells.add(cells[r][c]);
            }
        }
    }
}