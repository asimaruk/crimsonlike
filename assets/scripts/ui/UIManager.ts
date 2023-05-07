import { _decorator, Component, Node } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
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

    protected onPaused() {
        this.setMenuUIVisible(true);
        this.setGameUIVisible(false);
    }

    protected onResumed() {
        this.setMenuUIVisible(false);
        this.setGameUIVisible(true);
    }
}

