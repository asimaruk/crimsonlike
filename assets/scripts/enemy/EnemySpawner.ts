import { _decorator, Component, Node, Prefab, CCInteger, UITransform, instantiate, random, NodePool, director } from 'cc';
import { EnemyAI } from './EnemyAI';
import { Agent } from '../Agent';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('EnemySpawner')
@menu('Enemies/EnemySpawner')
export class EnemySpawner extends GameComponent {

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

    private groundUITransform: UITransform;
    private enemyPools: NodePool[];

    onLoad() {
        super.onLoad();
        this.groundUITransform = this.ground.getComponent(UITransform);
    }

    start() {
        this.startSpawning();
        if (this.paused) {
            this.onPaused();
        }
    }

    protected onPaused(): void {
        director.getScheduler().pauseTarget(this);
    }

    protected onResumed(): void {
        director.getScheduler().resumeTarget(this);
    }

    startSpawning() {
        this.unschedule(this.spawn);
        this.schedule(this.spawn, this.spawnIntervalSec);
    }

    stopSpawning() {
        this.unschedule(this.spawn);
    }

    private spawn() {
        let newEnemy = this.getEnemyFromPool(Math.floor(random() * this.enemyPrefabs.length));
        newEnemy.getComponent(EnemyAI).setDestination(this.player);
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
        newEnemy.setPosition(startX, startY);
        this.node.addChild(newEnemy);
        newEnemy.getComponent(Agent).walk();
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

