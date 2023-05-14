import { _decorator, director, EventTouch, Input, Node, UITransform, v2, v3, Vec3 } from 'cc';
import { UIManager } from './UIManager';
import { GameComponent } from '../utils/GameComponent';
const { ccclass, property, menu } = _decorator;

@ccclass('Joystick')
@menu('UI/Joystick')
export class Joystick extends GameComponent {

    @property({
        type: Node
    })
    base: Node;

    @property({
        type: Node
    })
    stick: Node;

    private uiTransform: UITransform;
    private stickLocation = v2();
    private stickCanvasCoordinates = v3();
    private ui: Node;
    private stickNodeCoordinates = v3();
    private stickWorldCoordinates = v3();
    private canvasUITransform: UITransform;

    protected onLoad() {
        super.onLoad();
        this.ui = director.getScene().getComponentInChildren(UIManager).node;
        this.uiTransform = this.getComponent(UITransform);
        this.canvasUITransform = this.ui.getComponent(UITransform);
        this.on();
    }

    protected onDestroy() {
        this.off();
    }

    protected onGamePause() {
        this.off();
        this.resetStick();
    }

    protected onGameResume() {
        this.on();
    }

    private on() {
        this.base.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.base.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.base.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.base.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    private off() {
        this.base.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.base.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.base.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.base.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    public getDirection(): Vec3 {
        return this.stick.position.clone().normalize();
    }

    private onTouchStart(event: EventTouch) {
        this.placeStick(event);
    }

    private onTouchMove(event: EventTouch) {
        this.placeStick(event);
    }

    private onTouchEnd(event: EventTouch) {
        this.resetStick();
    }

    private placeStick(event: EventTouch) {
        event.getUILocation(this.stickLocation);
        this.stickCanvasCoordinates.set(
            this.stickLocation.x - this.canvasUITransform.width * this.canvasUITransform.anchorX,
            this.stickLocation.y - this.canvasUITransform.height * this.canvasUITransform.anchorY
        );
        this.canvasUITransform.convertToWorldSpaceAR(this.stickCanvasCoordinates, this.stickWorldCoordinates);
        this.uiTransform.convertToNodeSpaceAR(this.stickWorldCoordinates, this.stickNodeCoordinates);
        this.stick.setPosition(this.stickNodeCoordinates);
    }

    private resetStick() {
        this.stick.setPosition(0, 0);
    }
}

