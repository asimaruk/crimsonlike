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
    sys,
} from 'cc';
import { GameState } from './GameState';
import { EffectsManager } from '../effects/EffectsManager';
import { AudioManager } from './AudioManager';
import { EDITOR } from 'cc/env';
import { ApiManager } from './ApiManager';
import { UsersRepository } from 'users-repository-api';

export class GameManager extends Component {

    public static readonly SCORE_CHANGED = 'score_changed';
    public static readonly MAX_SCORE_CHANGED = 'max_score_changed';
    public static readonly PLAYER_HEALTH_CHANGED = 'player_health_changed';
    public static readonly PLAYER_FULL_HEALTH = 100;
    public static readonly LOCAL_RECORDS_LIST = 'local_records_list';

    private static _instance: GameManager | null = null;
    public static get instance() {
        if (this._instance == null) {
            const gameManager = new Node();
            gameManager.name = '__gameManager__';
            if (!EDITOR) {
                director.getScene()?.addChild(gameManager);
                director.addPersistRootNode(gameManager);
            }
            this._instance = gameManager.addComponent(GameManager);
        }
        return this._instance;
    }

    private _gameState: GameState = GameState.GAME_UNDEFINED;
    private managersLoading: Promise<void>;
    private _score = 0;
    private _playerHealth = GameManager.PLAYER_FULL_HEALTH;

    public get gameState(): GameState {
        return this._gameState;
    }

    public get score() {
        return this._score;
    }

    public get playerHealth() {
        return this._playerHealth;
    }

    public get maxScore(): number {
        const records = this.localRecords;
        const currentUser = ApiManager.instance.currentUser();
        return records.find(e => currentUser ? e.uid == currentUser.id : !e.uid)?.score ?? 0;
    }

    private get localRecords(): Array<{ uid?: string | null, score: number }> {
        const item = sys.localStorage.getItem(GameManager.LOCAL_RECORDS_LIST);
        if (!item) {
            return [];
        }
        const records = JSON.parse(item);
        if (records instanceof Array) {
            return records.filter((r) => 'score' in r);
        }

        return [];
    }

    private set localRecords(records: Array<{ uid?: string | null, score: number }>) {
        sys.localStorage.setItem(GameManager.LOCAL_RECORDS_LIST, JSON.stringify(records));
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
        ApiManager.instance.on(ApiManager.CURRENT_USER, this.onCurrentUser, this);
    }

    protected onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        ApiManager.instance.off(ApiManager.CURRENT_USER, this.onCurrentUser, this);
        this.node.removeFromParent();
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
        this.saveScore();
        this._gameState = GameState.GAME_OVER;
        this.node.emit(GameState.GAME_OVER);
    }

    private saveScore() {
        const api = ApiManager.instance;
        const currentUser = api.currentUser();
        const records = this.localRecords;

        const recordIndex = records.findIndex(e => currentUser ? e.uid == currentUser.id : !e.uid);
        if (recordIndex == -1) {
            sys.localStorage.setItem(GameManager.LOCAL_RECORDS_LIST, JSON.stringify(
                records.concat({
                    uid: currentUser?.id,
                    score: this._score,
                })
            ));
        } else if (records[recordIndex].score < this._score) {
            records[recordIndex].score = this._score;
            sys.localStorage.setItem(GameManager.LOCAL_RECORDS_LIST, JSON.stringify(records));
        }

        if (api.isLoggedIn() && this._score > api.currentUser()!.score) {
            api.newRecord({
                uid: currentUser!.id,
                score: this._score,
            });
        }
    }

    public resetGame() {
        this._gameState = GameState.GAME_RESET;
        this.node.emit(GameState.GAME_RESET);
        this._score = 0;
        this.node.emit(GameManager.SCORE_CHANGED, this._score);
        this._playerHealth = GameManager.PLAYER_FULL_HEALTH;
        this.node.emit(GameManager.PLAYER_HEALTH_CHANGED, this._playerHealth);
        AudioManager.instance.resume();
    }

    public on(event: string, callback: Function, target: unknown) {
        this.node.on(event, callback, target);
    }

    public off(event: string, callback: Function, target: unknown) {
        this.node.off(event, callback, target);
    }

    public once(event: string, callback: Function, target: unknown) {
        this.node.once(event, callback, target);
    }

    public incScore(value: number) {
        this._score += value;
        this.node.emit(GameManager.SCORE_CHANGED, this._score);
    }

    public decPlayerHealth(value: number) {
        this._playerHealth = Math.max(this._playerHealth - value, 0);
        this.node.emit(GameManager.PLAYER_HEALTH_CHANGED, this._playerHealth);
    }

    public incPlayerHealth(value: number) {
        this._playerHealth += value;
        this.node.emit(GameManager.PLAYER_HEALTH_CHANGED, this._playerHealth);
    }

    private onCurrentUser(currentUser: UsersRepository.CurrentUser | null) {
        if (currentUser == null) {
            return;
        }

        const records = this.localRecords;
        if (records.length == 0) {
            return;
        }

        const userLocalScore = records.find((r) => r.uid == currentUser.id)?.score;
        const anonLocalScore = records.find((r) => !r.uid)?.score;
        if (userLocalScore && userLocalScore > currentUser.score) {
            ApiManager.instance.newRecord({
                uid: currentUser.id,
                score: userLocalScore,
            });
        } else if (anonLocalScore && anonLocalScore > currentUser.score) {
            ApiManager.instance.newRecord({
                uid: currentUser.id,
                score: anonLocalScore,
            });
        }
    }
}

