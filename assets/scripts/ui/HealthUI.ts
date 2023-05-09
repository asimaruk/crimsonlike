import { Label, Node, _decorator } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('HealthUI')
@menu('UI/HealthUI')
export class HealthUI extends GameComponent {

    @property({
        type: Node
    }) heart: Node;
    @property({
        type: Label
    }) counter: Label;

    public setHealth(health: number) {
        this.counter.string = health.toString();
    }
}

