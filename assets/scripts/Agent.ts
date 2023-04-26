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

    static readonly DIE = 'die';

    @property
    speed: number = 10;

    @property({
        formerlySerializedAs: 'health'
    })
    fullHealth: number = 100;

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
    

    isAlive: boolean = true;
    currentHealth: number;

    private bloodManager: BloodSplashManager;
    private bloodPosition = v3();
    private colliders: Collider2D[];

    onLoad() {
        this.bloodManager = director.getScene().getComponentInChildren(BloodSplashManager);
        this.colliders = this.getComponents(Collider2D);
        this.reset();
    }

    takeDamage(damage: number) {
        this.currentHealth -= damage;
        if (this.currentHealth <= 0 && this.isAlive) {
            this.die();
        }
    }

    takeBullet(collider: Collider2D, damage: number) {
        if (this.colliders.indexOf(collider) == -1) return;

        this.takeDamage(damage);
        let blood = this.bloodManager.get();
        this.getBloodPosition(collider, this.bloodPosition);
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
        this.node.emit(Agent.DIE);
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

    private getBloodPosition(collider: Collider2D, out: Vec3 = null) {
        let position = out || v3();
        if (collider instanceof CircleCollider2D) {
            position.set(
                collider.offset.x + collider.radius * (random() - 0.5),
                collider.offset.y + collider.radius * (random() - 0.5)
            );
        } else if (collider instanceof BoxCollider2D) {
            position.set(
                collider.offset.x + collider.size.width * (random() - 0.5),
                collider.offset.y + collider.size.height * (random() - 0.5)
            );
        } else if (collider instanceof PolygonCollider2D) {
            let points = collider.points;
            let xs = points.map((point) => point.x);
            let ys = points.map((point) => point.y);
            let width = Math.max(...xs) - Math.min(...xs);
            let height = Math.max(...ys) - Math.min(...ys);

            position.set(
                collider.offset.x + width * (random() - 0.5),
                collider.offset.y + height * (random() - 0.5)
            );
        } else {
            position.set(
                collider.offset.x,
                collider.offset.y
            );
        }
    }

    reset() {
        this.isAlive = true;
        this.currentHealth = this.fullHealth;
        this.animation.stop();
    }
}

