import { 
    _decorator, 
    Component, 
    Node, 
    input, 
    Input, 
    EventKeyboard, 
    KeyCode, 
    Prefab, 
    director,
    PhysicsSystem2D,
    Graphics,
    UITransform,
} from 'cc';
import { EnemyAI } from './EnemyAI';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({
        type: Node
    })
    player: Node;
    @property({
        type: Node
    })
    menu: Node;
    @property({
        type: Prefab
    })
    enemyPrefab: Prefab;
    @property({
        type: Graphics
    })
    debugGraphics: Graphics;

    private playerController: PlayerController;
    private isGameStarted = false;
    private isGameRunning = false;
    private debugUITransform: UITransform;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.playerController = this.player.getComponent(PlayerController);
        director.getScene().getComponentsInChildren(EnemyAI).forEach((ai: EnemyAI) => {
            ai.setDestination(this.player)
        });
        director.pause();
        this.debugUITransform = this.debugGraphics.getComponent(UITransform);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                if (this.isGameStarted && !this.isGameRunning) {
                    this.startGame();
                } else {
                    this.pause();
                }
                break;
        }
    }

    startGame() {
        this.isGameStarted = true;
        this.isGameRunning = true;
        this.playerController.enabled = true;
        this.menu.active = false;
        director.resume();
    }

    pause() {
        if (this.isGameStarted && this.isGameRunning) {
            this.playerController.enabled = false;
            this.menu.active = true;
            this.isGameRunning = false;
            director.pause();
        }
    }
}

