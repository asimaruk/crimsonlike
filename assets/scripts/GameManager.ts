import { 
    _decorator, 
    Component, 
    Node, 
    input, 
    Input, 
    EventKeyboard, 
    KeyCode, 
    director,
    PhysicsSystem2D,
} from 'cc';
import { EnemyAI } from './enemy/EnemyAI';
import { PlayerController } from './PlayerController';
import { UIManager } from './ui/UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    public static PAUSED = 'paused';
    public static RESUMED = 'resumed';

    @property({
        type: Node
    })
    player: Node;
    @property({
        type: UIManager
    })
    uiManager: UIManager;

    private playerController: PlayerController;
    private _isPaused = true;

    get isPaused(): boolean {
        return this._isPaused;
    }

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.playerController = this.player.getComponent(PlayerController);
        
        let scene = director.getScene();
        scene.getComponentsInChildren(EnemyAI).forEach((ai: EnemyAI) => {
            ai.setDestination(this.player);
        });


        this.onPause();
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                if (this._isPaused) {
                    this.startGame();
                } else {
                    this.pause();
                }
                break;
        }
    }

    startGame() {
        if (!this._isPaused) return;

        this._isPaused = false;
        this.playerController.enabled = true;
        this.uiManager.setMenuUIVisible(false);
        this.uiManager.setGameUIVisible(true);
        this.node.emit(GameManager.RESUMED);
    }

    pause() {
        if (this._isPaused) return;

        this.onPause();
    }

    private onPause() {
        this._isPaused = true;
        this.playerController.enabled = false;
        this.uiManager.setMenuUIVisible(true);
        this.uiManager.setGameUIVisible(false);
        this.node.emit(GameManager.PAUSED);
    }
}

