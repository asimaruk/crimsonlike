import { _decorator, Component, Node, v3, Vec3 } from 'cc';
import { Agent } from './Agent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('EnemyAI')
@requireComponent(Agent)
export class EnemyAI extends Component {

    private destination: Node;
    private destinationWorld = v3();
    private selfWorld = v3();
    private agent: Agent;
    private move = v3();

    onLoad() {
        this.agent = this.getComponent(Agent);
    }

    update(deltaTime: number) {
        if (this.destination && this.agent.isAlive) {
            this.move.set(this.destination.getWorldPosition(this.destinationWorld));
            this.move.subtract(this.node.getWorldPosition(this.selfWorld));
            this.move.normalize();
            this.move.multiplyScalar(this.agent.speed * deltaTime);
            this.node.setPosition(this.node.position.add(this.move));
        }
    }

    setDestination(dest: Node) {
        this.destination = dest;
    }
}

