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

    private playerController: PlayerController;
    private isGameStarted = false;
    private isGameRunning = false;

    onLoad() {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.playerController = this.player.getComponent(PlayerController);
        director.getScene().getComponentsInChildren(EnemyAI).forEach((ai: EnemyAI) => {
            ai.setDestination(this.player)
        });
        director.pause();
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

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        console.log(`Contact ${selfCollider.node.name} with ${otherCollider.node.name}!`);
    }
}

