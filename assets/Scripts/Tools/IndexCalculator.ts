import { _decorator } from 'cc';
import { Block } from '../Shapes/Block';
import { Debugger } from './Debugger';

const { ccclass } = _decorator;

export class IndexCalculator {
    public static calculateIndices(blocks: Block[]): void {
        if (blocks.length === 0) {
            return;
        }

        let minX = blocks[0].node.position.x;
        let minY = blocks[0].node.position.y;

        blocks.forEach(block => {
            const pos = block.node.position;
            if (pos.x < minX) {
                minX = pos.x;
            }
            if (pos.y < minY) {
                minY = pos.y;
            }
        });

        let cellSizeX = 1;
        let cellSizeY = 1;
        if (blocks.length > 1) {
            const sortedByX = [...blocks].sort((a, b) => a.node.position.x - b.node.position.x);
            for (let i = 1; i < sortedByX.length; i++) {
                const distanceX = sortedByX[i].node.position.x - sortedByX[i - 1].node.position.x;
                if (distanceX > 0) {
                    cellSizeX = distanceX;
                    break;
                }
            }

            const sortedByY = [...blocks].sort((a, b) => a.node.position.y - b.node.position.y);
            for (let i = 1; i < sortedByY.length; i++) {
                const distanceY = sortedByY[i].node.position.y - sortedByY[i - 1].node.position.y;
                if (distanceY > 0) {
                    cellSizeY = distanceY;
                    break;
                }
            }
        }

        blocks.sort((a, b) => {
            const posA = a.node.position;
            const posB = b.node.position;
            if (posA.y !== posB.y) {
                return posA.y - posB.y;
            }
            return posA.x - posB.x;
        });        

        blocks.forEach(block => {
            const localPosition = block.node.position;
            const xIndex = Math.round((localPosition.x - minX) / cellSizeX);
            const yIndex = Math.round((localPosition.y - minY) / cellSizeY);
            block.initialize(yIndex, xIndex);
            Debugger.createLabel(block.node, yIndex, xIndex);            
        });
    }  
}