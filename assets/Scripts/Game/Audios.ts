import { _decorator, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Audios')
export class Audios extends Component {
    @property({type: AudioSource, group: 'Links'})
    private takeShapeAudioSource: AudioSource;

    @property({type: AudioSource, group: 'Links'})
    private dropShapeAudioSource: AudioSource;

    @property({type: AudioSource, group: 'Links'})
    private inPositionShapeAudioSource: AudioSource;

    @property({type: AudioSource, group: 'Links'})
    private scoresAudioSource: AudioSource;

    @property({type: AudioSource, group: 'Links'})
    private loseAudioSource: AudioSource;
    
    public playTakeShape(): void{
        this.takeShapeAudioSource.play();
    }

    public playDropShape(): void{
        this.dropShapeAudioSource.play();
    }

    public playInPositionShape(): void{
        this.inPositionShapeAudioSource.play();
    }

    public playScores(): void{
        this.scoresAudioSource.play();
    }

    public playLose(): void{
        this.loseAudioSource.play();
    }
}


