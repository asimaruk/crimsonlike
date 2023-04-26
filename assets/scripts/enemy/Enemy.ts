import { _decorator, Component, Node, NodePool } from 'cc';
import { Agent } from '../Agent';
const { ccclass, property, menu } = _decorator;

@ccclass('Enemy')
@menu('Enemies/Enemy')
export class Enemy extends Component {

    private pool: NodePool;
    private agent: Agent;

    protected onLoad(): void {
        this.agent = this.getComponent(Agent);
        this.node.on(Agent.DIE, () => this.toPool());
    }

    protected onDestroy(): void {
        this.node.off(Agent.DIE, () => this.toPool());
    }

    private reset() {
        this.agent.reset()
    }

    private toPool() {
        this.node.removeFromParent();
        this.reset();
        this.pool.put(this.node);
    }

    reuse() {
        if (arguments.length > 0 && arguments[0][0] instanceof NodePool) {
            this.pool = arguments[0][0];
        }
        console.log(`Enemy ${this.node.name} reused from pool`);
    }
}

