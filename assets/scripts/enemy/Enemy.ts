import { _decorator, CCFloat, CCInteger, Collider2D, macro, Node, NodePool, v3 } from 'cc';
import { Agent } from '../Agent';
import { Projectile } from '../guns/Projectile';
import { Player } from '../player/Player';
import { EffectsManager } from '../effects/EffectsManager';
import { AudioManager } from '../utils/AudioManager';
const { ccclass, menu, property } = _decorator;

@ccclass('Enemy')
@menu('Enemies/Enemy')
export class Enemy extends Agent {

    @property({
        type: CCInteger,
        min: 0,
    }) damage = 5;

    @property({
        type: CCFloat,
        min: 0,
    }) damageRate = 1;

    private pool: NodePool;
    private scheduledPlayerDamage: (() => void) | null = null;
    private destination: Node;
    private destinationWorld = v3();
    private selfWorld = v3();
    private move = v3();
    private damageSounds = [AudioManager.Sounds.BULLET_HIT_1, AudioManager.Sounds.BULLET_HIT_2];
    private deathSounds = [AudioManager.Sounds.ENEMY_DEATH_1, AudioManager.Sounds.ENEMY_DEATH_2];

    protected update(deltaTime: number) {
        if (this.destination && this.isAlive && this.resumed) {
            this.move.set(this.destination.getWorldPosition(this.destinationWorld));
            this.move.subtract(this.node.getWorldPosition(this.selfWorld));
            this.move.normalize();
            this.move.multiplyScalar(this.speed * deltaTime);
            this.node.setPosition(this.node.position.add(this.move));
        }
    }

    public setDestination(dest: Node) {
        this.destination = dest;
    }

    protected onTakeDamage() {
        if (this.isAlive) {
            AudioManager.instance.playOneShot(this.damageSounds[Math.floor(Math.random() * this.damageSounds.length)]);
        }
    }

    protected onDie() {
        let dieLights = EffectsManager.instance.getDieLights();
        dieLights.setPosition(this.node.position);
        this.node.parent.addChild(dieLights);
        this.unschedule(this.scheduledPlayerDamage);
        AudioManager.instance.playOneShot(this.deathSounds[Math.floor(Math.random() * this.deathSounds.length)]);   
    }

    protected wipeOut() {
        this.node.removeFromParent();
        this.reset();
        this.pool.put(this.node);
    }

    public reuse() {
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
        console.log(`Enemy ${this.node.name} reused from pool`);
    }

    public onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const projectile = otherCollider.getComponent(Projectile);
        if (projectile) {
            this.takeBullet(selfCollider, projectile.damage);
            projectile.hit();
        }

        const otherPlayer = otherCollider.getComponent(Player);
        if (otherPlayer && !this.scheduledPlayerDamage) {
            otherPlayer.takeDamage(this.damage);
            this.scheduledPlayerDamage = () => otherPlayer.takeDamage(this.damage);
            this.schedule(this.scheduledPlayerDamage, this.damageRate, macro.REPEAT_FOREVER, this.damageRate);
        }
    }

    public onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        const selfEnemy = selfCollider.getComponent(Enemy);
        const otherPlayer = otherCollider.getComponent(Player);
        if (selfEnemy && otherPlayer && this.scheduledPlayerDamage) {
            this.unschedule(this.scheduledPlayerDamage);
            this.scheduledPlayerDamage = null;
        }
    }

    protected onGameReset() {
        this.die(false);
    }
}

