import { _decorator, Node } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('UIManager')
@menu('UI/UIManager')
export class UIManager extends GameComponent {

    @property({
        type: Node
    })
    menuIU: Node;

    @property({
        type: Node
    })
    gameUI: Node;

    protected onLoad() {
        super.onLoad();
        this.setMenuUIVisible(true);
        this.setGameUIVisible(false);
    }

    public setMenuUIVisible(isVisible: boolean) {
        this.menuIU.active = isVisible;
    }

    public setGameUIVisible(isVisible: boolean) {
        this.gameUI.active = isVisible;
    }

    protected onGameLaunch() {
        this.setMenuUIVisible(true);
        this.setGameUIVisible(false);
    }

    protected onGamePause() {
        this.setMenuUIVisible(true);
    }

    protected onGameUnpause() {
        this.setMenuUIVisible(false);
        this.setGameUIVisible(true);
    }

    protected onGameOver() {
        this.setMenuUIVisible(true);
    }
}

