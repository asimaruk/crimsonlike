import { _decorator, Component, CircleCollider2D } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Agent')
@requireComponent(CircleCollider2D)
export class Agent extends Component {

    @property
    speed: number = 10;
    @property
    health: number = 100

    collider: CircleCollider2D;
    isAlive = true

    onLoad() {
        this.collider = this.getComponent(CircleCollider2D);
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isAlive = false;
        this.scheduleOnce(this.onDie, 3);
    }

    onDie() {
        this.node.destroy();
    }
}

