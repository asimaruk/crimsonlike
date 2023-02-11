import { _decorator, Component, CircleCollider2D, Prefab, instantiate, UITransform } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Agent')
@requireComponent(CircleCollider2D)
@requireComponent(UITransform)
export class Agent extends Component {

    @property
    speed: number = 10;
    @property
    health: number = 100
    @property({
        type: Prefab
    })
    bloodSplash: Prefab;

    private uiTransform: UITransform;

    collider: CircleCollider2D;
    isAlive = true

    onLoad() {
        this.collider = this.getComponent(CircleCollider2D);
        this.uiTransform = this.getComponent(UITransform);
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    takeBullet(damage: number, x: number, y: number) {
        this.takeDamage(damage);
        let blood = instantiate(this.bloodSplash);
        this.node.addChild(blood);
    }

    die() {
        this.isAlive = false;
        this.scheduleOnce(this.onDie, 3);
    }

    onDie() {
        this.node.destroy();
    }
}

