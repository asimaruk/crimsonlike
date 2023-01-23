import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

@ccclass('AgentRenderSkin')
@requireComponent(Graphics)
@executeInEditMode(true)
export class AgentRenderSkin extends Component {

    @property
    size = 100
    @property({
        type: Color
    })
    bodyColor: Color
    @property
    aim = false
    @property({
        type: Color,
        visible: function() { return this.aim }
    })
    aimColor: Color


    private g: Graphics | undefined;

    onLoad() {
        this.g = this.getComponent(Graphics);
    }

    onEnable() {
        this.g.strokeColor = this.bodyColor;
        this.g.circle(0, 0, this.size / 2);
        this.g.stroke();

        if (this.aim) {
            this.g.strokeColor = this.aimColor;
            this.g.moveTo(this.size / 4, 0);
            this.g.lineTo(this.size * 0.7, 0);
            this.g.stroke();
        }
    }

    onDisable() {
        this.g.clear();
    }

    update(deltaTime: number) {
        
    }
}

