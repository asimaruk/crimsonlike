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
    Contact2DType,
} from 'cc';
import { EffectsManager } from './effects/EffectsManager';
import { BoxCollider2D } from 'cc';
import { GameComponent } from './utils/GameComponent';
const { ccclass, property } = _decorator;

@ccclass('Agent')
export class Agent extends GameComponent {

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

    public get isAlive(): boolean { 
        return this.currentHealth > 0; 
    }
    public currentHealth: number;

    protected effectsManager: EffectsManager;
    private fumePosition = v3();
    private colliders: Collider2D[];
    private skinSpite: Sprite;
    private animation: Animation;

    protected onLoad() {
        super.onLoad();
        this.effectsManager = director.getScene().getComponentInChildren(EffectsManager);
        this.colliders = this.getComponents(Collider2D);
        this.colliders.forEach((collider) => {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        });
        this.skinSpite = this.skin.getComponent(Sprite);
        this.animation = this.getComponent(Animation);
        this.reset();

        if (this.walkClip) this.animation.addClip(this.walkClip);
        if (this.dieClip) this.animation.addClip(this.dieClip);
        if (this.damageClip) this.animation.addClip(this.damageClip);
    }
    
    protected onDestroy() {
        this.colliders.forEach((collider) => {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        });
    }

    protected onGamePause() {
        this.animation.pause();
    }

    protected onGameResume() {
        this.animation.resume();
    }

    public takeDamage(damage: number) {
        if (!this.isAlive) return;

        this.currentHealth = damage >= this.currentHealth ? 0 : this.currentHealth - damage;
        if (!this.isAlive) {
            this.die();
        } else {
            let damageClipState = this.animation.getState(this.damageClip.name) || this.animation.createState(this.damageClip);
            damageClipState.setTime(0);
            damageClipState.play();
        }
        this.onTakeDamage();
    }

    protected onTakeDamage() {
        
    }

    public takeBullet(collider: Collider2D, damage: number) {
        if (this.colliders.indexOf(collider) == -1 || !this.isAlive) return;

        this.takeDamage(damage);
        let fume = this.effectsManager.getFume();
        this.getFumePosition(collider, this.fumePosition);
        this.fumePosition.add(this.node.position);
        fume.setPosition(this.fumePosition);
        this.node.parent.addChild(fume);
        fume.setSiblingIndex(this.node.getSiblingIndex());
    }

    private die() {
        this.stopWalk();
        this.onDie();
        if (this.dieClip) {
            this.scheduleOnce(this.wipeOut, this.dieClip.duration);
            this.animation.play(this.dieClip.name);
        } else {
            this.scheduleOnce(this.wipeOut, 0.3);
        }
    }

    protected wipeOut() {
        
    }

    protected onDie() {

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

    private getFumePosition(collider: Collider2D, out: Vec3 = null) {
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
        this.currentHealth = this.fullHealth;
        this.animation.stop();
        this.skin.setScale(1, 1, 1);
        this.skinSpite.color = Color.WHITE.clone();
    }

    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {

    }

    public onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        
    }
}

