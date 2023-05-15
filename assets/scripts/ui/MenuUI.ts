import { _decorator, Animation, Enum, Label, Node } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

enum MenuState {
    LAUNCH,
    PAUSE,
    GAME_OVER,
}

@ccclass('MenuUI')
@menu('UI/MenuUI')
export class MenuUI extends GameComponent {

    private static TITLE = 'Swampland';
    private static PAUSE = 'Pause';
    private static GAME_OVER = 'Game Over';
    private static START = 'Start';
    private static RESUME = 'Resume';
    private static RESTART = 'Restart';
    
    @property 
    private _state: MenuState = MenuState.LAUNCH
    @property({
        type: Enum(MenuState)
    }) 
    get state() {
        return this._state;
    }
    set state(value: MenuState) {
        this.updateState(value);
    }
    @property({
        type: Node
    }) title: Node;
    @property({
        type: Node
    }) startBtn: Node;
    @property({
        type: Node
    }) restartBtn: Node;

    private titleLabel: Label;
    private startLabel: Label;
    private startAnimation: Animation;
    private restartAnimation: Animation;

    protected onLoad() {
        super.onLoad();
        this.titleLabel = this.title.getComponent(Label);
        this.startLabel = this.startBtn.getComponentInChildren(Label);
        this.startAnimation = this.startBtn.getComponent(Animation);
        this.restartAnimation = this.restartBtn.getComponent(Animation);
    }

    protected onGameLaunch() {
        this.updateState(MenuState.LAUNCH);
    }

    protected onGameOver() {
        this.updateState(MenuState.GAME_OVER);
    }

    protected onGamePause() {
        this.updateState(MenuState.PAUSE);
    }

    private updateState(state: MenuState) {
        this._state = state;
        switch (state) {
            case MenuState.LAUNCH:
                this.titleLabel.string = MenuUI.TITLE;
                this.startLabel.string = MenuUI.START;
                this.startBtn.active = true;
                this.restartBtn.active = false;
                this.startAnimation.play();
                break;
            case MenuState.PAUSE:
                this.titleLabel.string = MenuUI.PAUSE;
                this.startLabel.string = MenuUI.RESUME;
                this.startBtn.active = true;
                this.restartBtn.active = true;
                this.startAnimation.stop();
                this.restartAnimation.stop();
                break;
            case MenuState.GAME_OVER:
                this.titleLabel.string = MenuUI.GAME_OVER;
                this.startBtn.active = false;
                this.restartBtn.active = true;
                this.restartAnimation.play();
                break;
        }
    }

    public onStartClick() {
        switch (this._state) {
            case MenuState.LAUNCH:
                this.gm.startGame();
                break;
            case MenuState.PAUSE:
                this.gm.resumeGame();
                break;
            case MenuState.GAME_OVER:
                this.gm.resetGame();
                break;
        }
    }

    public onRestartClick() {
        this.gm.resetGame();
    }
}



