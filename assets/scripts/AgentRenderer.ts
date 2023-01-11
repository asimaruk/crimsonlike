import { _decorator, Component, Node, Graphics, Color } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('AgentRenderer')
@requireComponent(Graphics)
@executeInEditMode(true)
export class AgentRenderer extends Component {

    private g: Graphics | undefined

    onLoad() {
        this.g = this.getComponent(Graphics);
    }

    onEnable() {
        this.g.strokeColor = Color.GREEN;
        this.g.circle(0, 0, 50);
        this.g.stroke();

        this.g.strokeColor = Color.RED;
        this.g.moveTo(25, 0);
        this.g.lineTo(70, 0);
        this.g.stroke();
    }

    update(deltaTime: number) {
        
    }
}

