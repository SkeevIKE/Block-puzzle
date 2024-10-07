import { _decorator, Component } from 'cc';
import { ServiceAllocator, ServiceKey } from '../Tools/ServiceAllocator';
import { ShapesFactory } from '../Tools/ShapesFactory';
import { CellsFactory } from '../Tools/CellsFactory';
import { DragAndDrop } from './DragAndDrop';
import { GameSettings } from './GameSettings';
import { Board } from '../Board/Board';
import { ScoresScreen } from '../UI/ScoresScreen';
import { PlayerScores } from './PlayerScores';
import { ShapeSpawner } from '../Shapes/ShapeSpawner';
import { LoseScreen } from '../UI/LoseScreen';
import { Audios } from './Audios';
import { TutorialScreen } from '../UI/TutorialScreen';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {   
    @property(GameSettings)
    private setting: GameSettings;

    @property(Board)
    private board: Board; 

    @property(ShapeSpawner)
    private shapeSpawner: ShapeSpawner; 
    
    @property(ScoresScreen)
    private scoresScreen: ScoresScreen;

    @property(TutorialScreen)
    private tutorialScreen: TutorialScreen;

    @property(LoseScreen)
    private loseScreen: LoseScreen;
    
    @property(Audios)
    private audios: Audios;    

    private playerScores: PlayerScores;
    private dragAndDrop: DragAndDrop = new DragAndDrop();

    onLoad() {
        ServiceAllocator.register(ServiceKey.GameSettings, this.setting);  
        ServiceAllocator.register(ServiceKey.ShapesFactory, new ShapesFactory());
        ServiceAllocator.register(ServiceKey.CellsFactory, new CellsFactory());
        ServiceAllocator.register(ServiceKey.Board, this.board);
        ServiceAllocator.register(ServiceKey.DragAndDrop, this.dragAndDrop);
        ServiceAllocator.register(ServiceKey.Audios, this.audios);
        this.playerScores = new PlayerScores(this.board);
        this.dragAndDrop.shapeTaked.Subscribe(this.onShapeTaked);
        this.playerScores.scoresAdded.Subscribe(this.scoresScreen.updateVictoryScore);
        this.shapeSpawner.shapeCreated.Subscribe(this.showTutorial);
        this.shapeSpawner.spaceEnded.Subscribe(this.onLose);    
    }
    
    protected onDestroy(): void {
        (ServiceAllocator.get(ServiceKey.GameSettings) as GameSettings).destroy();       
        (ServiceAllocator.get(ServiceKey.ShapesFactory) as ShapesFactory).destroy();       
        (ServiceAllocator.get(ServiceKey.CellsFactory) as CellsFactory).destroy();       
        (ServiceAllocator.get(ServiceKey.Board) as Board).destroy();       
        (ServiceAllocator.get(ServiceKey.Audios) as Audios).destroy();       
        ServiceAllocator.unregister(ServiceKey.GameSettings);
        ServiceAllocator.unregister(ServiceKey.DragAndDrop);
        ServiceAllocator.unregister(ServiceKey.ShapesFactory);
        ServiceAllocator.unregister(ServiceKey.CellsFactory);
        ServiceAllocator.unregister(ServiceKey.Board);
        ServiceAllocator.unregister(ServiceKey.Audios);
        this.dragAndDrop.destroy();       
        this.dragAndDrop.shapeTaked.Unsubscribe(this.onShapeTaked); 
        this.shapeSpawner.shapeCreated.Unsubscribe(this.showTutorial);
        this.shapeSpawner.spaceEnded.Unsubscribe(this.onLose);
        this.playerScores.scoresAdded.Unsubscribe(this.scoresScreen.updateVictoryScore);
        this.playerScores.destroy();
        this.playerScores = null;
    }
    
    private showTutorial = (): void => { 
        this.shapeSpawner.shapeCreated.Unsubscribe(this.showTutorial);
        this.tutorialScreen.show();
    }

    private onShapeTaked = (): void => { 
        this.audios.playTakeShape();
    }

    public onLose = (): void => {        
        this.playerScores.scoresAdded.Unsubscribe(this.onLose);
        this.dragAndDrop.destroy();
        this.loseScreen.show();
        this.audios.playLose();
    }
}