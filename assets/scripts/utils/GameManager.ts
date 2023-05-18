import { 
    _decorator, 
    Component,
    input, 
    Input, 
    EventKeyboard, 
    KeyCode,
    PhysicsSystem2D,
    Node,
    director,
} from 'cc';
import { GameState } from './GameState';
import { EffectsManager } from '../effects/EffectsManager';
import { AudioManager } from './AudioManager';
const { ccclass, menu } = _decorator;

@ccclass('GameManager')
@menu('Utils/GameManager')
export class GameManager extends Component {

    private static _instance: GameManager | null = null;
    public static get instance() {
        if (this._instance == null) {
            const gameManager = new Node();
            gameManager.name = '__gameManager__';
            director.getScene().addChild(gameManager);
            director.addPersistRootNode(gameManager);
            this._instance = gameManager.addComponent(GameManager);
        }
        return this._instance;
    }

    private _gameState: GameState = GameState.GAME_UNDEFINED;
    private managersLoading: Promise<void>;

    get gameState(): GameState {
        return this._gameState;
    }

    protected onLoad() {
        PhysicsSystem2D.instance.enable = true;
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this._gameState = GameState.GAME_LAUNCHED;
        this.node.emit(GameState.GAME_LAUNCHED);
        this.managersLoading = Promise.all([
            EffectsManager.instance.load(),
            AudioManager.instance.loaded
        ]).then(() => {});
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

    public async startGame() {
        await this.managersLoading;
        this._gameState = GameState.GAME_RESUMED;
        this.node.emit(GameState.GAME_STARTED);
        this.node.emit(GameState.GAME_RESUMED);
    }

    public resumeGame() {
        if (this._gameState == GameState.GAME_RESUMED) return;

        this._gameState = GameState.GAME_RESUMED;
        this.node.emit(GameState.GAME_RESUMED);
        AudioManager.instance.resume();
    }

    public gamePause() {
        if (this._gameState == GameState.GAME_PAUSED) return;

        this._gameState = GameState.GAME_PAUSED;
        this.node.emit(GameState.GAME_PAUSED);
        AudioManager.instance.pause();
    }

    public gameOver() {
        this._gameState = GameState.GAME_OVER;
        this.node.emit(GameState.GAME_OVER);
    }

    public resetGame() {
        this._gameState = GameState.GAME_RESET;
        this.node.emit(GameState.GAME_RESET);
        AudioManager.instance.resume();
    }
}

