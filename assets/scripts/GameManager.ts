import { 
    _decorator, 
    Component,
    input, 
    Input, 
    EventKeyboard, 
    KeyCode,
    PhysicsSystem2D,
} from 'cc';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    public static PAUSED = 'paused';
    public static RESUMED = 'resumed';

    private _isPaused = true;

    get isPaused(): boolean {
        return this._isPaused;
    }

    protected onLoad() {
        PhysicsSystem2D.instance.enable = true;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.onPause();
    }

    protected onDestroy() {
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

    private startGame() {
        if (!this._isPaused) return;

        this._isPaused = false;
        this.node.emit(GameManager.RESUMED);
    }

    private pause() {
        if (this._isPaused) return;

        this.onPause();
    }

    private onPause() {
        this._isPaused = true;
        this.node.emit(GameManager.PAUSED);
    }

    public gameOver() {
        
    }
}

