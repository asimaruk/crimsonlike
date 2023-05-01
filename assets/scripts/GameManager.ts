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
    Collider2D,
    Contact2DType,
} from 'cc';
import { EnemyAI } from './enemy/EnemyAI';
import { PlayerController } from './PlayerController';
import { UIManager } from './ui/UIManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({
        type: Node
    })
    player: Node;
    @property({
        type: UIManager
    })
    uiManager: UIManager;

    private playerController: PlayerController;
    private _isGameStarted = false;
    private _isGameRunning = false;

    get isGameRunning(): boolean {
        return this._isGameRunning;
    }

    get isGameStarted(): boolean {
        return this._isGameStarted;
    }

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.playerController = this.player.getComponent(PlayerController);
        director.getScene().getComponentsInChildren(EnemyAI).forEach((ai: EnemyAI) => {
            ai.setDestination(this.player);
        });
        director.pause();
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                if (this._isGameStarted && !this._isGameRunning) {
                    this.startGame();
                } else {
                    this.pause();
                }
                break;
        }
    }

    startGame() {
        this._isGameStarted = true;
        this._isGameRunning = true;
        this.playerController.enabled = true;
        this.uiManager.setMenuUIVisible(false);
        this.uiManager.setGameUIVisible(true);
        director.resume();
    }

    pause() {
        if (this._isGameStarted && this._isGameRunning) {
            this.playerController.enabled = false;
            this.uiManager.setMenuUIVisible(true);
            this.uiManager.setGameUIVisible(false);
            this._isGameRunning = false;
            director.pause();
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        console.log(`Contact ${selfCollider.node.name} with ${otherCollider.node.name}!`);
    }
}

