import { _decorator, Component, Node } from 'cc';
import { Agent } from './Agent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('EnemyAI')
@requireComponent(Agent)
export class EnemyAI extends Component {

    private finalDestination: Node;
    private agent: Agent;

    onLoad() {
        this.agent = this.getComponent(Agent);
    }

    update(deltaTime: number) {
        if (this.finalDestination) {
            this.node.setPosition(this.node.position.lerp(this.finalDestination.position, deltaTime));
        }
    }

    setFinalDestination(dest: Node) {
        this.finalDestination = dest;
    }
}

