import { _decorator, Animation } from 'cc';
import { GameComponent } from './GameComponent';
const { ccclass, requireComponent, menu } = _decorator;

@ccclass('GameAnimation')
@requireComponent(Animation)
@menu('Utils/GameAnimation')
export class GameAnimation extends GameComponent {

    private animation: Animation | null;
    
    protected onLoad() {
        this.animation = this.getComponent(Animation);
    }

    protected onGamePause() {
        this.animation?.pause();
    }

    protected onGameUnpause() {
        this.animation?.resume();
    }
}

