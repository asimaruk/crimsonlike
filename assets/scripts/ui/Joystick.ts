import { Canvas, Vec3, director, v2, v3 } from 'cc';
import { _decorator, Component, EventTouch, Input, Node, UITransform } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {

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
    private canvas: Node;
    private stickNodeCoordinates = v3();
    private stickWorldCoordinates = v3();
    private canvasUITransform: UITransform;

    onLoad() {
        this.canvas = director.getScene().getComponentInChildren(UIManager).node;
        this.uiTransform = this.getComponent(UITransform);
        this.canvasUITransform = this.canvas.getComponent(UITransform);
        this.base.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.base.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.base.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.base.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    onDestroy() {
        this.base.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.base.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.base.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.base.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    getDirection(): Vec3 {
        return this.stick.position.clone().normalize();
    }

    private onTouchStart(event: EventTouch) {
        this.placeStick(event);
    }

    private onTouchMove(event: EventTouch) {
        this.placeStick(event);
    }

    private onTouchEnd(event: EventTouch) {
        this.stick.setPosition(0, 0);
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
}

