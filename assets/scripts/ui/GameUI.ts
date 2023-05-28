import { Label, Node, _decorator } from 'cc';
import { GameComponent } from '../utils/GameComponent';
import { GameManager } from '../utils/GameManager';
import { Popping } from './Popping';
const { ccclass, property, menu } = _decorator;

@ccclass('GameUI')
@menu('UI/GameUI')
export class GameUI extends GameComponent {

    @property({
        type: Node
    }) heart: Node;
    @property({
        type: Label,
        formerlySerializedAs: 'counter'
    }) health: Label;
    @property({
        type: Label
    }) score: Label;

    private heartPoppong: Popping;
    private healthPopping: Popping;
    private scorePopping: Popping;

    protected onLoad() {
        GameManager.instance.on(GameManager.PLAYER_HEALTH_CHANGED, this.setHealth, this);
        GameManager.instance.on(GameManager.SCORE_CHANGED, this.setScore, this);

        this.healthPopping = this.health.getComponent(Popping);
        this.heartPoppong = this.heart.getComponent(Popping);
        this.scorePopping = this.score.getComponent(Popping);
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
        this.health.string = health.toString();
        this.heartPoppong.pop();
        this.healthPopping.pop();
    }

    public setScore(score: number) {
        this.score.string = score.toString();
        this.scorePopping.pop();
    }
}

