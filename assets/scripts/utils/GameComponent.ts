import { _decorator, Component, director, ISchedulable, TweenSystem } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass } = _decorator;

@ccclass('GameComponent')
export class GameComponent extends Component {

    private gm: GameManager | null = null;
    private _paused: boolean | null = null;

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

    public get paused() {
        return this._paused;
    }

    protected onLoad() {
        this.gm = director.getScene().getComponentInChildren(GameManager);
    }

    protected onEnable() {
        this.gm.node.on(GameManager.PAUSED, this.pause, this);
        this.gm.node.on(GameManager.RESUMED, this.resume, this);
        if (this._paused != this.gm.isPaused) {
            if (this.gm.isPaused) {
                this.pause();
            } else {
                this.resume();
            }
        }
    }

    protected onDisable() {
        this.gm.node.off(GameManager.PAUSED, this.pause, this);
        this.gm.node.off(GameManager.RESUMED, this.resume, this);
    }

    private pause() {
        this._paused = true;
        this.schedulerTargets.forEach((t) => {
            director.getScheduler().pauseTarget(t);
        });
        this.tweenTargets.forEach((t) => {
            TweenSystem.instance.ActionManager.pauseTarget(t);
        });
        this.onPaused();
    }

    private resume() {
        this._paused = false;
        this.schedulerTargets.forEach((t) => {
            director.getScheduler().resumeTarget(t);
        });
        this.tweenTargets.forEach((t) => {
            TweenSystem.instance.ActionManager.resumeTarget(t);
        });
        this.onResumed();
    }

    protected onPaused() {

    }

    protected onResumed() {

    }

    protected getSchedulerTargets(): ISchedulable[] {
        return [this];
    }

    protected getTweenTargets(): any[] {
        return [this.node];
    }
}

