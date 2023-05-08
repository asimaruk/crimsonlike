import {
    _decorator,
    CircleCollider2D,
    random,
    v3,
    director,
    Animation,
    Collider2D,
    PolygonCollider2D,
    Vec3,
    AnimationClip,
    Node,
    Sprite,
    Color,
    Contact2DType
} from 'cc';
import { EffectsManager } from './effects/EffectsManager';
import { BoxCollider2D } from 'cc';
import { Projectile } from './guns/Projectile';
import { GameComponent } from './utils/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('Agent')
export class Agent extends GameComponent {

    static readonly DIE = 'die';

    @property
    speed: number = 10;

    @property({
        formerlySerializedAs: 'health'
    })
    fullHealth: number = 100;

    @property({
        type: Node
    })
    skin: Node;

    @property({
        type: Animation
    })
    animation: Animation;

    @property({
        type: AnimationClip
    })
    walkClip: AnimationClip;

    @property({
        type: AnimationClip
    })
    dieClip: AnimationClip | null;

    @property({
        type: AnimationClip
    })
    damageClip: AnimationClip | null;

    isAlive: boolean = true;
    currentHealth: number;

    private effectsManager: EffectsManager;
    private bloodPosition = v3();
    private colliders: Collider2D[];
    private skinSpite: Sprite;

    protected onLoad() {
        super.onLoad();
        this.effectsManager = director.getScene().getComponentInChildren(EffectsManager);
        this.colliders = this.getComponents(Collider2D);
        this.colliders.forEach((collider) => {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        });
        this.skinSpite = this.skin.getComponent(Sprite);
        this.reset();
    }
    
    protected onDestroy() {
        this.colliders.forEach((collider) => {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        });
    }

    protected onPaused() {
        this.animation.pause();
    }

    protected onResumed() {
        this.animation.resume();
    }

    private takeDamage(damage: number) {
        this.currentHealth -= damage;
        if (this.currentHealth <= 0 && this.isAlive) {
            this.die();
        } else {
            let damageClipState = this.animation.getState(this.damageClip.name) || this.animation.createState(this.damageClip);
            damageClipState.setTime(0);
            damageClipState.play();
        }
    }

    private takeBullet(collider: Collider2D, damage: number) {
        if (this.colliders.indexOf(collider) == -1) return;

        this.takeDamage(damage);
        let blood = this.effectsManager.getBloodSplash();
        this.getBloodPosition(collider, this.bloodPosition);
        this.bloodPosition.add(this.node.position);
        blood.setPosition(this.bloodPosition);
        this.node.parent.addChild(blood);
        blood.setSiblingIndex(this.node.getSiblingIndex());
    }

    private die() {
        this.isAlive = false;
        this.stopWalk();
        if (this.dieClip) {
            this.scheduleOnce(this.onDie, this.dieClip.duration);
            this.animation.play(this.dieClip.name);
        } else {
            this.scheduleOnce(this.onDie, 0.3);
        }
        
        let dieLights = this.effectsManager.getDieLights();
        dieLights.setPosition(this.node.position);
        this.node.parent.addChild(dieLights);   
    }

    private onDie() {
        this.node.emit(Agent.DIE);
    }

    public walk() {
        if (this.animation.getState(this.walkClip.name).isPlaying) {
            return;
        }
        this.animation.play(this.walkClip.name);
    }

    public stopWalk() {
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

    public reset() {
        this.isAlive = true;
        this.currentHealth = this.fullHealth;
        this.animation.stop();
        this.skin.setScale(1, 1, 1);
        this.skinSpite.color = Color.WHITE.clone();
    }

    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        let projectile = otherCollider.getComponent(Projectile);
        if (projectile) {
            this.takeBullet(selfCollider, projectile.damage);
            projectile.hit();
        }
    }
}

