import {
    _decorator,
    Component,
    CircleCollider2D,
    Prefab,
    random,
    v3,
    director,
    Animation,
    Collider2D,
    PolygonCollider2D,
    Vec3,
    AnimationClip
} from 'cc';
import { BloodSplashManager } from './BloodSplashManager';
import { BoxCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Agent')
export class Agent extends Component {

    @property
    speed: number = 10;

    @property
    health: number = 100;

    @property({
        type: Animation
    })
    animation: Animation;

    @property({
        type: AnimationClip
    })
    walkClip: AnimationClip;

    @property({
        type: Prefab
    })
    bloodSplash: Prefab;
    

    isAlive = true;

    private bloodManager: BloodSplashManager;
    private bloodPosition = v3();
    private collider: Collider2D;

    onLoad() {
        this.bloodManager = director.getScene().getComponentInChildren(BloodSplashManager);
        this.collider = this.getComponent(Collider2D);
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0 && this.isAlive) {
            this.die();
        }
    }

    takeBullet(damage: number) {
        this.takeDamage(damage);
        let blood = this.bloodManager.get();
        this.getBloodPosition(this.bloodPosition);
        this.bloodPosition.add(this.node.position);
        blood.setPosition(this.bloodPosition);
        this.node.parent.addChild(blood);
        blood.setSiblingIndex(this.node.getSiblingIndex())
    }

    die() {
        this.isAlive = false;
        this.stopWalk();
        this.scheduleOnce(this.onDie, 3);
    }

    onDie() {
        this.node.destroy();
    }

    walk() {
        if (this.animation.getState(this.walkClip.name).isPlaying) {
            return;
        }
        this.animation.play(this.walkClip.name);
    }

    stopWalk() {
        let walkState = this.animation.getState(this.walkClip.name);
        walkState.setTime(0);
        this.scheduleOnce(() => walkState.stop());
    }

    private getBloodPosition(out: Vec3 = null) {
        let position = out || v3();
        if (this.collider instanceof CircleCollider2D) {
            position.set(
                this.collider.offset.x + this.collider.radius * (random() - 0.5),
                this.collider.offset.y + this.collider.radius * (random() - 0.5)
            );
        } else if (this.collider instanceof BoxCollider2D) {
            position.set(
                this.collider.offset.x + this.collider.size.width * (random() - 0.5),
                this.collider.offset.y + this.collider.size.height * (random() - 0.5)
            );
        } else if (this.collider instanceof PolygonCollider2D) {
            let points = this.collider.points;
            let xs = points.map((point) => point.x);
            let ys = points.map((point) => point.y);
            let width = Math.max(...xs) - Math.min(...xs);
            let height = Math.max(...ys) - Math.min(...ys);

            position.set(
                this.collider.offset.x + width * (random() - 0.5),
                this.collider.offset.y + height * (random() - 0.5)
            );
        } else {
            position.set(
                this.collider.offset.x,
                this.collider.offset.y
            );
        }
    }
}

