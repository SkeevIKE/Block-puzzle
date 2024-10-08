import { Board } from '../Board/Board';
import { EventEmitter } from '../Tools/EventEmitter';

export class PlayerScores {
    private board: Board;
    private currentScores: number = 0;

    public scoresAdded: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

    constructor(board: Board) {
        this.board = board;
        this.board.patternsMatched.Subscribe(this.updateVictoryScore);
    }

    public destroy(): void {
        if (this.board)
            this.board.patternsMatched.Unsubscribe(this.updateVictoryScore);
    }

    public updateVictoryScore = (matchedCount: number, cellsCount: number): void => {        
        this.currentScores += (cellsCount * matchedCount);
        this.scoresAdded?.Invoke(this.currentScores, matchedCount);
    }
}


