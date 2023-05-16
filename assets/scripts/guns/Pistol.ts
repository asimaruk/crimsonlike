import { 
    _decorator, 
    Prefab, 
    instantiate,
    v3,
    CCInteger,
    Node,
    NodePool,
    Animation,
    director,
    UITransform,
    Vec3,
    AudioClip,
} from 'cc';
import { Gun } from './Gun';
import { Projectile } from './Projectile';
import { Projectiles } from './Projectiles';
import { AudioManager } from '../utils/AudioManager';
const { ccclass, property, menu } = _decorator;

@ccclass('Pistol')
@menu('Guns/Pistol')
export class Pistol extends Gun {

    @property({
        type: Node
    })
    projectileSpawn: Node;

    @property({
        type: Prefab
    })
    projectile: Prefab;

    @property({
        type: CCInteger,
        min: 0
    })
    range = 1000;

    @property({
        type: CCInteger,
        min: 0
    })
    damage = 20;
    @property({
        type: AudioClip
    }) shotSoundClip: AudioClip;

    private projectileWorldPosition = v3();
    private projectileNodePosition = v3();
    private projectileDirectionWorldPosition = v3();
    private projectileDirectionNodePosition = v3();
    private projectilePool = new NodePool('Projectile');
    private animation: Animation;
    private projectiles: Projectiles;
    private projectilesUITransform: UITransform;
    private projectileSpawnUITransform: UITransform;
    private vRange = v3();

    protected onLoad() {
        super.onLoad();
        this.animation = this.getComponent(Animation);
        this.projectiles = director.getScene().getComponentInChildren(Projectiles);
        this.projectilesUITransform = this.projectiles.getComponent(UITransform);
        this.projectileSpawnUITransform = this.projectileSpawn.getComponent(UITransform);
    }

    protected onGamePause() {
        this.animation.pause();
    }

    protected onGameUnpause() {
        this.animation.resume();
    }

    protected fireShot() {
        this.animation.play();
        this.animation.once(Animation.EventType.FINISHED, () => {
            if (this.projectilePool.size() <= 0) {
                this.projectilePool.put(instantiate(this.projectile));
            }
            let projectile = this.projectilePool.get(this.projectilePool).getComponent(Projectile);
            this.vRange.set(this.range, 0, 0);
            this.projectileSpawnUITransform.convertToWorldSpaceAR(Vec3.ZERO, this.projectileWorldPosition);
            this.projectileSpawnUITransform.convertToWorldSpaceAR(this.vRange, this.projectileDirectionWorldPosition);
            this.projectilesUITransform.convertToNodeSpaceAR(this.projectileWorldPosition, this.projectileNodePosition);
            this.projectilesUITransform.convertToNodeSpaceAR(this.projectileDirectionWorldPosition, this.projectileDirectionNodePosition);
            this.projectiles.node.addChild(projectile.node);
            projectile.fly(this.projectileNodePosition, this.projectileDirectionNodePosition, this.range);
            if (this.shotSoundClip) {
                AudioManager.instance.playOneShot(this.shotSoundClip);
            }
        });
    }
}

