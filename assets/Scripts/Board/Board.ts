import { _decorator, Component, Node } from 'cc';
import { CellsFactory } from '../Tools/CellsFactory';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { CheckerLogic } from './CheckerLogic';
import { Cell } from './Cell';
import { EventEmitter } from '../Tools/EventEmitter';
import { Audios } from '../Game/Audios';
import { Block } from '../Shapes/Block';

const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property({ type: Node, displayName: 'Spawn Positions' })
    private spawnNode: Node;

    private rows: number = 9;
    private cols: number = 9;
    private matchedPatternsCounter: number = 0;
    private cellsFactory: CellsFactory;
    private audios: Audios;
    private cells: Cell[][] = [];
    private patternCells: Cell[] = [];
    private unmatchedCells: Cell[] = [];
    private underBlocks: Block[] = [];

    public patternsMatched: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

    protected async start() {
        this.cellsFactory = ServiceAllocator.get(ServiceKey.CellsFactory);
        this.audios = ServiceAllocator.get(ServiceKey.Audios);
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

    public canPlaceShape(shapeIndices: [number, number][]): boolean {
        return CheckerLogic.isCanPlaceShape(this.cells, this.rows, this.cols, shapeIndices);
    }

    public getShapeInCells(cellIndex: [number, number] | null, currentBlockIndex: [number, number] | null, blocks: Block[] | null): boolean {
        const shapeInCells = CheckerLogic.findShapeInCells(this, cellIndex, currentBlockIndex, blocks);

        if (this.underBlocks.length > 0) {
            this.underBlocks.forEach(block => block.setNormalColor());
            this.underBlocks = [];
        }

        if (shapeInCells !== null) {
            this.underBlocks = blocks;
        }

        this.findePattern(shapeInCells);
        return shapeInCells !== null;
    }

    public findePattern(cellsIndices: [number, number][] | null): void {
        if (this.patternCells.length > 0) {
            this.patternCells.forEach(cell => cell.setNormalColor());
            this.patternCells = [];
        }

        if (this.unmatchedCells.length > 0) {
            this.unmatchedCells.forEach(cell => cell.setNormalColor());
            this.unmatchedCells = [];
        }

        if (!cellsIndices) {
            return;
        }

        const matched = CheckerLogic.findMatchingPatterns(this.cells, cellsIndices, this.rows, this.cols);
        matched.matchedCells.forEach(cell => cell.setHighlightColor());

        if (matched.matchedPatternsCounter > 0) {
            this.underBlocks.forEach(block => {
                if (matched.matchedCells.some(matchedCell => matchedCell.getIndex[0] === block.underBoardIndex[0] &&
                    matchedCell.getIndex[1] === block.underBoardIndex[1])) {
                    block.setHighlightColor();
                }
            });
        }
        
        cellsIndices.forEach(indices => {
            const cell = this.getCell(indices);
            if (!matched.matchedCells.some(matchedCell => matchedCell === cell)) {
                this.unmatchedCells.push(cell);
                cell.setHighlightColor();
            }
        });

        this.patternCells = matched.matchedCells;
        this.matchedPatternsCounter = matched.matchedPatternsCounter;
    }

    public addShape(): void {
        if (this.underBlocks.length > 0) {
            this.underBlocks.forEach(block => block.setNormalColor());
            this.underBlocks = [];
        }

        if (this.matchedPatternsCounter > 0) {
            this.patternCells.forEach(cell => cell.setEmpty());

            if (this.unmatchedCells.length > 0) {
                this.unmatchedCells.forEach(cell => cell.setOccupied());
            }

            this.patternsMatched?.Invoke(this.matchedPatternsCounter, this.patternCells.length);
            this.audios.playScores();
        } else {
            this.patternCells.forEach(cell => cell.setOccupied());
            this.audios.playInPositionShape();
        }
    }
}