import { _decorator, Node, Prefab, CCInteger, UITransform, instantiate, random, NodePool, macro } from 'cc';
import { Agent } from '../Agent';
import { GameComponent } from '../utils/GameComponent';
import { Enemy } from './Enemy';
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
    private isSpawning: boolean = false;

    protected onLoad() {
        super.onLoad();
        this.groundUITransform = this.ground.getComponent(UITransform);
    }

    protected onResumed() {
        if (!this.isSpawning) {
            this.startSpawning();
        }
    }

    private startSpawning() {
        this.schedule(this.spawn, this.spawnIntervalSec, macro.REPEAT_FOREVER, 0);
        this.isSpawning = true;
    }

    private stopSpawning() {
        this.unschedule(this.spawn);
        this.isSpawning = false;
    }

    private spawn() {
        let newEnemy = this.getEnemyFromPool(Math.floor(random() * this.enemyPrefabs.length));
        newEnemy.getComponent(Enemy).setDestination(this.player);
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

