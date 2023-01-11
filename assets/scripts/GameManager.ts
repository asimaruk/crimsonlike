import { _decorator, Component, Node, input, Input, EventKeyboard, KeyCode } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({
        type: PlayerController
    })
    playerController: PlayerController;
    @property({
        type: Node
    })
    menu: Node;

    private isGameStarted = false;
    private isGameRunning = false;

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                this.pause();
                break;
        }
    }

    startGame() {
        this.isGameStarted = true;
        this.isGameRunning = true;
        this.playerController.enabled = true;
        this.menu.active = false;
    }

    pause() {
        if (this.isGameStarted && this.isGameRunning) {
            this.playerController.enabled = false;
            this.menu.active = true;
            this.isGameRunning = false;
        }
    }
}

