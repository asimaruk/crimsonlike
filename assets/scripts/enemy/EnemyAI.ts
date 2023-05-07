import { _decorator, Node, v3 } from 'cc';
import { Agent } from '../Agent';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, requireComponent, menu } = _decorator;

@ccclass('EnemyAI')
@requireComponent(Agent)
@menu('Enemies/EnemyUI')
export class EnemyAI extends GameComponent {

    private destination: Node;
    private destinationWorld = v3();
    private selfWorld = v3();
    private agent: Agent;
    private move = v3();

    protected onLoad() {
        super.onLoad();
        this.agent = this.getComponent(Agent);
    }

    protected update(deltaTime: number) {
        if (this.destination && this.agent.isAlive && !this.paused) {
            this.move.set(this.destination.getWorldPosition(this.destinationWorld));
            this.move.subtract(this.node.getWorldPosition(this.selfWorld));
            this.move.normalize();
            this.move.multiplyScalar(this.agent.speed * deltaTime);
            this.node.setPosition(this.node.position.add(this.move));
        }
    }

    public setDestination(dest: Node) {
        this.destination = dest;
    }
}

