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
    Vec3, 
    v3, 
    PhysicsSystem2D,
    Graphics,
    UITransform,
    Canvas
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
        this.playerController.node.on(PlayerController.FIRE, this.onPlayerFire, this);
        this.debugUITransform = this.debugGraphics.getComponent(UITransform);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.playerController.node.off(PlayerController.FIRE, this.onPlayerFire, this);
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

    private playerWorldPosition = v3();
    private fireDirection0 = v3();
    private fireDirection = v3();
    private tempV3 = v3();

    private onPlayerFire(gunPosition: Vec3) {
        this.playerController.node.getWorldPosition(this.playerWorldPosition);
        this.debugUITransform.convertToNodeSpaceAR(gunPosition, this.fireDirection0);
        this.debugGraphics.moveTo(this.fireDirection0.x, this.fireDirection0.y);
        this.tempV3.set(gunPosition).subtract(this.playerWorldPosition).multiplyScalar(10);
        this.fireDirection.set(gunPosition).add(this.tempV3);
        this.debugUITransform.convertToNodeSpaceAR(this.fireDirection, this.fireDirection);
        this.debugGraphics.lineTo(this.fireDirection.x, this.fireDirection.y);
        this.debugGraphics.stroke();
    }
}

