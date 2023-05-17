import { _decorator, Node, Prefab, CCInteger, UITransform, instantiate, random, NodePool, macro, v3, AudioClip } from 'cc';
import { Agent } from '../Agent';
import { GameComponent } from '../utils/GameComponent';
import { Enemy } from './Enemy';
const { ccclass, property, menu } = _decorator;

@ccclass('EnemySpawner')
@menu('Enemies/EnemySpawner')
export class EnemySpawner extends GameComponent {

    private static INITIAL_SCALE = v3(0.8, 0.8, 0.8); 

    @property({
        type: Node
    })
    player: Node;
    @property({
        type: Prefab
    })
    enemyPrefabs: Prefab[] = [];
    @property({
        type: CCInteger
    })
    spawnIntervalSec = 10;
    @property({
        type: Node
    })
    ground: Node;
    @property({
        type: [AudioClip]
    }) defaultDamageSounds: AudioClip[] = [];
    @property({
        type: [AudioClip]
    }) defaultDeathSounds: AudioClip[] = [];

    private groundUITransform: UITransform;
    private enemyPools: NodePool[];

    protected onLoad() {
        this.groundUITransform = this.ground.getComponent(UITransform);
    }

    protected onGameStart() {
        this.startSpawning();
    }

    protected onGameOver() {
        this.stopSpawning();
    }

    protected onGameReset() {
        this.stopSpawning();
    }

    private startSpawning() {
        this.schedule(this.spawn, this.spawnIntervalSec, macro.REPEAT_FOREVER, 0);
    }

    private stopSpawning() {
        this.unschedule(this.spawn);
    }

    private spawn() {
        let enemy = this.getEnemyFromPool(Math.floor(random() * this.enemyPrefabs.length));
        const enemyComp = enemy.getComponent(Enemy);
        enemyComp.setDestination(this.player);
        let randomSide = random();
        let startX = 0;
        let startY = 0;
        if (randomSide > 0.5) {
            startX = this.groundUITransform.width * (random() - 0.5);
            startY = (this.groundUITransform.height * this.groundUITransform.anchorY + 100) * Math.sign(random() - 0.5);
        } else {
            startX = (this.groundUITransform.width * this.groundUITransform.anchorX + 100) * Math.sign(random() - 0.5);
            startY = this.groundUITransform.height * (random() - 0.5);
        }
        enemy.setPosition(startX, startY);
        enemy.setScale(EnemySpawner.INITIAL_SCALE);
        this.node.addChild(enemy);
        if (enemyComp.damageAudioClips.length == 0) {
            enemyComp.damageAudioClips = this.defaultDamageSounds;
        }
        if (enemyComp.deathAudioClips.length == 0) {
            enemyComp.deathAudioClips = this.defaultDeathSounds;
        }
        enemy.getComponent(Agent).walk();
    }

    private getEnemyFromPool(index: number): Node {
        if (!this.enemyPools) {
            this.enemyPools = Array<NodePool>(this.enemyPrefabs.length).fill(new NodePool('Enemy'));
        }
        let enemyPool = this.enemyPools[index];
        if (enemyPool.size() <= 0) {
            let enemy = instantiate(this.enemyPrefabs[index]);
            console.log(`Create new enemy ${enemy.name}`);
            enemyPool.put(enemy);
        }

        return enemyPool.get(enemyPool);
    }
}

