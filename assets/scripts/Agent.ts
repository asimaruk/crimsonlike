import { _decorator, Component, CircleCollider2D, Prefab, instantiate, random, v3, NodePool, director } from 'cc';
import { BloodSplash } from './BloodSplash';
import { BloodSplashManager } from './BloodSplashManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Agent')
@requireComponent(CircleCollider2D)
export class Agent extends Component {

    @property
    speed: number = 10;
    @property
    health: number = 100
    @property({
        type: Prefab
    })
    bloodSplash: Prefab;

    collider: CircleCollider2D;
    isAlive = true;

    private bloodManager: BloodSplashManager;

    onLoad() {
        this.collider = this.getComponent(CircleCollider2D);
        this.bloodManager = director.getScene().getComponentInChildren(BloodSplashManager);
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    private bloodPosition = v3();

    takeBullet(damage: number) {
        this.takeDamage(damage);
        let blood = this.bloodManager.get();
        this.bloodPosition.set(this.node.position);
        let bloodX = this.collider.radius * (random() - 0.5);
        let bloodY = this.collider.radius * (random() - 0.5);
        this.bloodPosition.add3f(bloodX, bloodY, 0);
        blood.setPosition(this.bloodPosition);
        this.node.parent.addChild(blood);
    }

    die() {
        this.isAlive = false;
        this.scheduleOnce(this.onDie, 3);
    }

    onDie() {
        this.node.destroy();
    }
}

