import { Cell } from "./Cell";

export const zones = [
    { startRow: 0, endRow: 2, startCol: 3, endCol: 5 },
    { startRow: 3, endRow: 5, startCol: 0, endCol: 2 },
    { startRow: 3, endRow: 5, startCol: 6, endCol: 8 },
    { startRow: 6, endRow: 8, startCol: 3, endCol: 5 },
];

export class ZonesChecker {  
    public static isCanPlaceShape(cells: Cell[][], rows: number, cols: number, shapeIndices: [number, number][]): boolean {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.isCanFitShapeAtPosition(cells, row, col, shapeIndices, rows, cols)) {
                    return true;
                }
            }
        }
        return false;
    }

    private static isCanFitShapeAtPosition(cells: Cell[][], startRow: number, startCol: number, shapeIndices: [number, number][], rows: number, cols: number): boolean {
        for (const [dx, dy] of shapeIndices) {
            const row = startRow + dx;
            const col = startCol + dy;

            if (row < 0 || row >= rows || col < 0 || col >= cols) {
                return false;
            }

            const cell = cells[row][col];
            if (!cell || !cell.isEmpty()) {
                return false;
            }
        }
        return true;
    }
    
    public static checkPattern(cells: Cell[][], rows: number, cols: number): number {
        let matchedPatterns = 0;        
        
        for (let row = 0; row < rows; row++) {
            let isLineOccupied = true;
            for (let col = 0; col < cols; col++) {
                if (cells[row][col].isEmpty()) {
                    isLineOccupied = false;
                    break;
                }
            }
            if (isLineOccupied) {
                matchedPatterns++;
                for (let col = 0; col < cols; col++) {
                    cells[row][col].setEmpty();
                }
            }
        }
        
        for (let col = 0; col < cols; col++) {
            let isLineOccupied = true;
            for (let row = 0; row < rows; row++) {
                if (cells[row][col].isEmpty()) {
                    isLineOccupied = false;
                    break;
                }
            }
            if (isLineOccupied) {
                matchedPatterns++;
                for (let row = 0; row < rows; row++) {
                    cells[row][col].setEmpty();
                }
            }
        }
        
        for (const zone of zones) {
            let isZoneOccupied = true;
            for (let row = zone.startRow; row <= zone.endRow; row++) {
                for (let col = zone.startCol; col <= zone.endCol; col++) {
                    if (cells[row][col].isEmpty()) {
                        isZoneOccupied = false;
                        break;
                    }
                }
                if (!isZoneOccupied) break;
            }
            if (isZoneOccupied) {
                matchedPatterns++;
                for (let row = zone.startRow; row <= zone.endRow; row++) {
                    for (let col = zone.startCol; col <= zone.endCol; col++) {
                        cells[row][col].setEmpty();
                    }
                }
            }
        }

        return matchedPatterns;
    }
}