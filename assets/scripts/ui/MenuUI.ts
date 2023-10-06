import { _decorator, Animation, Enum, Label, Node } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { GameManager } from '../utils/GameManager';
import { AudioManager } from '../utils/AudioManager';
import { ApiManager } from '../utils/ApiManager';
import { RecordsRepository } from 'records-repository-api';
import { RecordsMenuUI } from './RecordsMenuUI';
import { ProfileMenuUI } from './ProfileMenuUI';
const { ccclass, property, menu, executeInEditMode } = _decorator;

enum MenuState {
    LAUNCH,
    PAUSE,
    GAME_OVER,
    RECORDS,
    PROFILE,
}

@ccclass('MenuUI')
@menu('UI/MenuUI')
@executeInEditMode(true)
export class MenuUI extends GameComponent {

    private static TITLE = 'Swampland';
    private static PAUSE = 'Pause';
    private static GAME_OVER = 'Game Over';
    private static START = 'Start';
    private static RESUME = 'Resume';

    @property
    private _stateStack: MenuState[] = [MenuState.LAUNCH];
    @property({
        type: Enum(MenuState)
    })
    get state(): MenuState {
        return this._stateStack[this._stateStack.length - 1];
    }
    set state(value: MenuState) {
        this._stateStack[this._stateStack.length - 1] = value;
        this.updateState(value);
    }
    @property({
        type: Node
    }) mainUI;
    @property({
        type: RecordsMenuUI
    }) recordsUI: RecordsMenuUI;
    @property({
        type: ProfileMenuUI
    }) profileUI: ProfileMenuUI;
    @property({
        type: Node
    }) title: Node;
    @property({
        type: Node
    }) startBtn: Node;
    @property({
        type: Node
    }) restartBtn: Node;
    @property({
        type: Node
    }) yourScore: Node;
    @property({
        type: Label
    }) scoreLabel: Label;

    private titleLabel: Label;
    private startLabel: Label;
    private startAnimation: Animation;
    private restartAnimation: Animation;

    protected onLoad() {
        this.titleLabel = this.title.getComponent(Label);
        this.startLabel = this.startBtn.getComponentInChildren(Label);
        this.startAnimation = this.startBtn.getComponent(Animation);
        this.restartAnimation = this.restartBtn.getComponent(Animation);
    }

    protected onGameLaunch() {
        this._stateStack = [MenuState.LAUNCH];
        this.updateState(MenuState.LAUNCH);
    }

    protected onGameOver() {
        this._stateStack = [MenuState.GAME_OVER];
        this.scoreLabel.string = GameManager.instance.maxScore.toString();
        this.updateState(MenuState.GAME_OVER);
    }

    protected onGamePause() {
        this._stateStack = [MenuState.PAUSE];
        this.updateState(MenuState.PAUSE);
    }

    private updateState(state: MenuState) {
        switch (state) {
            case MenuState.LAUNCH:
                this.mainUI.active = true;
                this.recordsUI.node.active = false;
                this.profileUI.node.active = false;
                this.titleLabel.string = MenuUI.TITLE;
                this.startLabel.string = MenuUI.START;
                this.startBtn.active = true;
                this.restartBtn.active = false;
                this.yourScore.active = false;
                this.startAnimation.play();
                break;
            case MenuState.PAUSE:
                this.mainUI.active = true;
                this.recordsUI.node.active = false;
                this.profileUI.node.active = false;
                this.yourScore.active = false;
                this.titleLabel.string = MenuUI.PAUSE;
                this.startLabel.string = MenuUI.RESUME;
                this.startBtn.active = true;
                this.restartBtn.active = true;
                this.startAnimation.stop();
                this.restartAnimation.stop();
                break;
            case MenuState.GAME_OVER:
                this.mainUI.active = true;
                this.recordsUI.node.active = false;
                this.profileUI.node.active = false;
                this.yourScore.active = true;
                this.titleLabel.string = MenuUI.GAME_OVER;
                this.startBtn.active = false;
                this.restartBtn.active = true;
                this.restartAnimation.play();
                break;
            default:
                this.mainUI.active = false;
                this.recordsUI.node.active = state == MenuState.RECORDS;
                this.profileUI.node.active = state == MenuState.PROFILE;
                break;
        }
    }

    public onStartClick() {
        switch (this._stateStack[this._stateStack.length - 1]) {
            case MenuState.LAUNCH:
                GameManager.instance.startGame();
                break;
            case MenuState.PAUSE:
                GameManager.instance.resumeGame();
                break;
            case MenuState.GAME_OVER:
                GameManager.instance.resetGame();
                break;
        }
        AudioManager.instance.playOneShot(AudioManager.Sounds.UI_CLICK, 1);
    }

    public onRestartClick() {
        GameManager.instance.resetGame();
        AudioManager.instance.playOneShot(AudioManager.Sounds.UI_CLICK, 1);
    }

    public onRecordsClick() {
        this._stateStack.push(MenuState.RECORDS);
        this.updateState(MenuState.RECORDS);
        this.recordsUI.showLoading();
        ApiManager.instance.refreshRecords().then((records: RecordsRepository.Record[]) => {
            console.log(`Records: ${records}`);
            this.recordsUI.showResult(records);
        }).catch((e) => {
            console.log(`Records request error: ${e}`);
            this.recordsUI.showError("Loading records error");
        });
    }

    public onProfileClicked() {
        this._stateStack.push(MenuState.PROFILE);
        this.updateState(MenuState.PROFILE);
    }

    public onBack() {
        if (this._stateStack.length > 1) {
            this._stateStack.pop();
            this.updateState(this._stateStack[this._stateStack.length - 1]);
        }
    }
}



