import { 
    _decorator, 
    Component,
    input, 
    Input, 
    EventKeyboard, 
    KeyCode,
    PhysicsSystem2D,
} from 'cc';
import { GameState } from './utils/GameState';
const { ccclass } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private _gameState: GameState = GameState.GAME_UNDEFINED;

    get gameState(): GameState {
        return this._gameState;
    }

    protected onLoad() {
        PhysicsSystem2D.instance.enable = true;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._gameState = GameState.GAME_LAUNCHED;
        this.node.emit(GameState.GAME_LAUNCHED);
    }

    protected onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                switch (this._gameState) {
                    case GameState.GAME_LAUNCHED:
                    case GameState.GAME_PAUSED:
                        this.resumeGame();
                        break;
                    case GameState.GAME_RESUMED:
                        this.gamePause();
                        break;
                }
                break;
        }
    }

    public startGame() {
        if (this._gameState == GameState.GAME_STARTED) return;

        this._gameState = GameState.GAME_RESUMED;
        this.node.emit(GameState.GAME_STARTED);
        this.node.emit(GameState.GAME_RESUMED);
    }

    public resumeGame() {
        if (this._gameState == GameState.GAME_RESUMED) return;

        this._gameState = GameState.GAME_RESUMED;
        this.node.emit(GameState.GAME_RESUMED);
    }

    public gamePause() {
        if (this._gameState == GameState.GAME_PAUSED) return;

        this._gameState = GameState.GAME_PAUSED;
        this.node.emit(GameState.GAME_PAUSED);
    }

    public gameOver() {
        this._gameState = GameState.GAME_OVER;
        this.node.emit(GameState.GAME_OVER);
    }

    public restartGame() {
        this.node.emit(GameState.GAME_RESTARTED);
    }
}

