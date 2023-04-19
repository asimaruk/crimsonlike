import { _decorator, Color, Component, Graphics, Node } from 'cc';
const { ccclass, property, executeInEditMode, requireComponent, menu } = _decorator;

@ccclass('Circle')
@executeInEditMode(true)
@requireComponent(Graphics)
@menu('Shapes/Circle')
export class Circle extends Component {

    @property({
        formerlySerializedAs: "_size"
    })
    protected _radius = 100;
    @property
    protected _color: Color = Color.BLACK.clone();

    @property
    get radius() {
        return this._radius;
    }
    set radius(value: number) {
        this._radius = value;
        this.render();
    }

    @property
    get color() {
        return this._color;
    }
    set color(value: Color) {
        this._color = value;
        this.render();
    }

    private g: Graphics;

    onLoad() {
        this.g = this.getComponent(Graphics);
        this.render();
    }

    private render() {
        this.g.clear();
        this.g.fillColor.set(this._color);
        this.g.circle(0, 0, this.radius);
        this.g.fill();
    }
}

