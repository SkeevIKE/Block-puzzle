import { _decorator, Component, Label, Animation } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScoresScreen')
export class ScoresScreen extends Component {
    @property(Label)
    private scoreText: Label;  

    @property(Label)
    private bosstText: Label; 

    @property(Animation)
    private boostPanelAnimation: Animation;       

    public updateVictoryScore = (score: number, matchedCount: number) => {       
        if (this.scoreText) {           
            this.scoreText.string = `${score}`;         
        }

        this.bosstText.string = `${matchedCount}`; 
        this.boostPanelAnimation.play();
    }    
}