import { Label, Node, _decorator } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { GameManager } from '../utils/GameManager';
const { ccclass, property, menu } = _decorator;

@ccclass('GameUI')
@menu('UI/GameUI')
export class GameUI extends GameComponent {

    @property({
        type: Node
    }) heart: Node;
    @property({
        type: Label
    }) counter: Label;
    @property({
        type: Label
    }) score: Label;

    protected onLoad() {
        GameManager.instance.on(GameManager.PLAYER_HEALTH_CHANGED, this.setHealth, this);
        GameManager.instance.on(GameManager.SCORE_CHANGED, this.setScore, this);
    }

    protected onDestroy(): void {
        GameManager.instance.off(GameManager.PLAYER_HEALTH_CHANGED, this.setHealth, this);
        GameManager.instance.off(GameManager.SCORE_CHANGED, this.setScore, this);
    }

    protected onGameStart(): void {
        this.setHealth(GameManager.instance.playerHealth);
        this.setScore(0);
    }

    public setHealth(health: number) {
        this.counter.string = health.toString();
    }

    public setScore(score: number) {
        this.score.string = score.toString();
    }
}

