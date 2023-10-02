import { _decorator, Component, director, ISchedulable, TweenSystem } from 'cc';
import { GameManager } from '../utils/GameManager';
import { GameState } from './GameState';
const { ccclass, menu } = _decorator;

@ccclass('GameComponent')
@menu('Utils/GameComponent')
export class GameComponent extends Component {

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

    protected onEnable() {
        const gm = GameManager.instance;
        gm.node.on(GameState.GAME_LAUNCHED, this._onGameLaunch, this);
        gm.node.on(GameState.GAME_STARTED, this._onGameStart, this);
        gm.node.on(GameState.GAME_PAUSED, this._onGamePause, this);
        gm.node.on(GameState.GAME_RESUMED, this._onGameResume, this);
        gm.node.on(GameState.GAME_RESET, this._onGameReset, this);
        gm.node.on(GameState.GAME_OVER, this._onGameOver, this);
        if (this.gameState != gm.gameState) {
            switch (gm.gameState) {
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
                case GameState.GAME_RESET:
                    this._onGameReset();
                    break;
                case GameState.GAME_OVER:
                    this._onGameOver();
                    break;
            }
        }
    }

    protected onDisable() {
        const gm = GameManager.instance;
        gm.node.off(GameState.GAME_LAUNCHED, this._onGameLaunch, this);
        gm.node.off(GameState.GAME_STARTED, this._onGameStart, this);
        gm.node.off(GameState.GAME_PAUSED, this._onGamePause, this);
        gm.node.off(GameState.GAME_RESUMED, this._onGameResume, this);
        gm.node.off(GameState.GAME_RESET, this._onGameReset, this);
        gm.node.off(GameState.GAME_OVER, this._onGameOver, this);
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

    private _onGameUnpause() {
        this.schedulerTargets.forEach((t) => {
            director.getScheduler().resumeTarget(t);
        });
        this.tweenTargets.forEach((t) => {
            TweenSystem.instance.ActionManager.resumeTarget(t);
        });
        this.onGameUnpause();
    }

    private _onGameResume() {
        this.gameState = GameState.GAME_RESUMED;
        this._onGameUnpause();
        this.onGameResume();
    }

    private _onGameReset() {
        if (this.gameState == GameState.GAME_PAUSED) {
            this._onGameUnpause();
        }
        this.gameState = GameState.GAME_RESET;
        this.onGameReset();
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

    protected onGameUnpause() {

    }

    protected onGameResume() {

    }

    protected onGameReset() {

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

