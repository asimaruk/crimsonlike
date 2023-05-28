import { _decorator, Node, Tween, tween, v3, Vec3 } from 'cc';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, menu, property } = _decorator;

@ccclass('Popping')
@menu('UI/Popping')
export class Popping extends GameComponent {

    @property
    _popScale = 1.2;
    @property
    get popScale() {
        return this._popScale;
    }
    set popScale(value) {
        this._popScale = value;
        this.scalePopped = v3(value, value, value);
    }

    private scalePopped: Vec3;
    private scaleNormal = v3(1, 1, 1);
    private tween: Tween<Node>;

    protected onLoad(): void {
        this.scalePopped = v3(this.popScale, this.popScale, this.popScale);
    }

    public pop() {
        this.tween?.stop();
        this.tween = tween(this.node).to(0.2, { 
            scale: this.scalePopped 
        }).to(0.2, { 
            scale: this.scaleNormal 
        }).start();
    }
}

