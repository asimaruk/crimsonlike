import { _decorator, Component, director, ISchedulable, TweenSystem } from 'cc';
import { GameManager } from '../GameManager';
import { GameState } from './GameState';
const { ccclass } = _decorator;

@ccclass('GameComponent')
export class GameComponent extends Component {

    private _gm: GameManager | null = null;
    private gameState: GameState = GameState.GAME_UNDEFINED;

    private _schedulerTargets: ISchedulable[] = [];
    private _tweenTargets: any[] = [];

    private get schedulerTargets(): ISchedulable[] {
        if (this._schedulerTargets.length == 0) {
            this._schedulerTargets = this.getSchedulerTargets();
        }
        return this._schedulerTargets;
    }

    private get tweenTargets(): any[] {
        if (this._tweenTargets.length == 0) {
            this._tweenTargets = this.getTweenTargets();
        }
        return this._tweenTargets;
    }

    public get resumed() {
        return this.gameState == GameState.GAME_RESUMED;
    }

    protected get gm() {
        return this._gm;
    }

    protected onLoad() {
        this._gm = director.getScene().getComponentInChildren(GameManager);
    }

    protected onEnable() {
        this._gm.node.on(GameState.GAME_LAUNCHED, this._onGameLaunch, this);
        this._gm.node.on(GameState.GAME_STARTED, this._onGameStart, this);
        this._gm.node.on(GameState.GAME_PAUSED, this._onGamePause, this);
        this._gm.node.on(GameState.GAME_RESUMED, this._onGameResume, this);
        this._gm.node.on(GameState.GAME_RESTARTED, this._onGameRestart, this);
        this._gm.node.on(GameState.GAME_OVER, this._onGameOver, this);
        if (this.gameState != this._gm.gameState) {
            switch (this._gm.gameState) {
                case GameState.GAME_LAUNCHED: 
                    this._onGameLaunch(); 
                    break;
                case GameState.GAME_STARTED:
                    this._onGameStart();
                    break;
                case GameState.GAME_PAUSED: 
                    this._onGamePause(); 
                    break;
                case GameState.GAME_RESUMED:
                    this._onGameResume();
                    break;
                case GameState.GAME_RESTARTED:
                    this._onGameRestart();
                    break;
                case GameState.GAME_OVER:
                    this._onGameOver();
                    break;
            }
        }
    }

    protected onDisable() {
        this._gm.node.off(GameState.GAME_LAUNCHED, this._onGameLaunch, this);
        this._gm.node.off(GameState.GAME_STARTED, this._onGameStart, this);
        this._gm.node.off(GameState.GAME_PAUSED, this._onGamePause, this);
        this._gm.node.off(GameState.GAME_RESUMED, this._onGameResume, this);
        this._gm.node.off(GameState.GAME_RESTARTED, this._onGameRestart, this);
        this._gm.node.off(GameState.GAME_OVER, this._onGameOver, this);
    }

    private _onGameLaunch() {
        this.gameState = GameState.GAME_LAUNCHED;
        this.onGameLaunch();
    }

    private _onGameStart() {
        this.gameState = GameState.GAME_STARTED;
        this.onGameStart();
    }

    private _onGamePause() {
        this.gameState = GameState.GAME_PAUSED;
        this.schedulerTargets.forEach((t) => {
            director.getScheduler().pauseTarget(t);
        });
        this.tweenTargets.forEach((t) => {
            TweenSystem.instance.ActionManager.pauseTarget(t);
        });
        this.onGamePause();
    }

    private _onGameResume() {
        this.gameState = GameState.GAME_RESUMED;
        this.schedulerTargets.forEach((t) => {
            director.getScheduler().resumeTarget(t);
        });
        this.tweenTargets.forEach((t) => {
            TweenSystem.instance.ActionManager.resumeTarget(t);
        });
        this.onGameResume();
    }

    private _onGameRestart() {
        this.gameState = GameState.GAME_RESTARTED;
        this.onGameRestart();
    }

    private _onGameOver() {
        this.gameState = GameState.GAME_OVER;
        this.onGameOver();
    }

    protected onGameLaunch() {

    }

    protected onGameStart() {

    }

    protected onGamePause() {

    }

    protected onGameResume() {

    }

    protected onGameRestart() {

    }

    protected onGameOver() {

    }

    protected getSchedulerTargets(): ISchedulable[] {
        return [this];
    }

    protected getTweenTargets(): any[] {
        return [this.node];
    }
}

