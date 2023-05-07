import { _decorator, Component, director, Node } from 'cc';
import { GameManager } from '../GameManager';
const { ccclass,  } = _decorator;

@ccclass('GameComponent')
export abstract class GameComponent extends Component {

    private gm: GameManager;
    private _paused: boolean | undefined = undefined;
    
    get paused() {
        return this._paused;
    }

    protected onLoad(): void {
        this.gm = director.getScene().getComponentInChildren(GameManager);
        this.gm.node.on(GameManager.PAUSED, this.pause, this);
        this.gm.node.on(GameManager.RESUMED, this.resume, this);
    }

    protected onDestroy(): void {
        this.gm.node.off(GameManager.PAUSED, this.pause, this);
        this.gm.node.off(GameManager.RESUMED, this.resume, this);
    }

    protected onEnable(): void {
        if (this._paused != this.gm.isPaused) {
            if (this.gm.isPaused) {
                this.pause();
            } else {
                this.resume();
            }
        }
    }

    private pause() {
        this._paused = true;
        this.onPaused();
    }

    private resume() {
        this._paused = false;
        this.onResumed();
    }

    protected onPaused() {

    }

    protected onResumed() {

    }
}

