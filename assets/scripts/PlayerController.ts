import { 
    _decorator, 
    Component, 
    Node, 
    input, 
    Input, 
    EventMouse, 
    Vec2, 
    v2, 
    EventKeyboard, 
    KeyCode, 
    v3, 
    UITransform, 
    director, 
    Canvas, 
    Camera,
} from 'cc';
import { Agent } from './Agent';
import { Gun } from './guns/Gun';
import { EventTouch } from 'cc';
import { UIManager } from './UIManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(Agent)
export class PlayerController extends Component {

    @property({
        type: UITransform
    })
    groundUITransform: UITransform;

    private agent: Agent;
    private camera: Node;
    private canvas: Node;
    private canvasUITransform: UITransform;
    private cameraPosition = v3();
    private uiFacingPosition = v2();
    private selfPosition = v3();
    private facing = v2();
    private moveDirection = v2();
    private cameraMinX = 0;
    private cameraMaxX = 0;
    private cameraMinY = 0;
    private cameraMaxY = 0;
    private gun: Gun;
    private fireTouchId: number;
    private gunFireCallback = () => this.gun.fire();

    onLoad() {
        this.agent = this.getComponent(Agent);
        let scene = director.getScene();
        // camera in fact is camera carriage with camera and UI, so getting by UIManager
        this.camera = scene.getComponentInChildren(UIManager).node;
        this.canvas = scene.getComponentInChildren(Canvas).node;
        this.canvasUITransform = this.canvas.getComponent(UITransform);
        let canvasWidthHalf = this.canvasUITransform.contentSize.width / 2;
        let canvasHeightHalf = this.canvasUITransform.contentSize.height / 2;
        this.cameraMinX = - this.groundUITransform.contentSize.width / 2 + canvasWidthHalf;
        this.cameraMaxX = this.groundUITransform.contentSize.width / 2 - canvasWidthHalf;
        this.cameraMinY = - this.groundUITransform.contentSize.height / 2 + canvasHeightHalf;
        this.cameraMaxY = this.groundUITransform.contentSize.height / 2 - canvasHeightHalf;
        this.gun = this.getComponentInChildren(Gun);
    }

    onEnable() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    update(deltaTime: number) {
        if (this.moveDirection.x != 0 || this.moveDirection.y != 0) {
            this.move(this.moveDirection, this.agent.speed * deltaTime);
            this.faceMousePosition(this.uiFacingPosition);
        }
    }

    onDisable() {
        this.offInput();
    }

    onDestroy() {
        this.offInput();
    }

    private offInput() {
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch) {
        let touch = event.getTouches()[0];
        this.fireTouchId = touch.getID();
        console.log(`Fire tousch start id: ${this.fireTouchId}`);
        this.faceMousePosition(touch.getUILocation());
        this.uiFacingPosition = touch.getUILocation();
        this.schedule(this.gunFireCallback, this.gun.frequency);
    }

    private onTouchMove(event: EventTouch) {
        let fireTouch = event.getTouches().find((touch) => {
            console.log(`Fire tousch move id: ${touch.getID()}`);
            return touch.getID() == this.fireTouchId;
        });
        if (fireTouch) {
            this.uiFacingPosition = fireTouch.getUILocation();
            this.faceMousePosition(this.uiFacingPosition);
        }
    }

    private onTouchEnd(event: EventTouch) {
        let fireTouch = event.getTouches().find((touch) => {
            console.log(`Fire tousch end id: ${touch.getID()}`);
            return touch.getID() == this.fireTouchId;
        });
        console
        if (fireTouch) {
            this.unschedule(this.gunFireCallback);
        }
    }

    private onMouseMove(event: EventMouse) {
        event.getUILocation(this.uiFacingPosition);
        this.faceMousePosition(this.uiFacingPosition);
    }

    private onMouseDown(event: EventMouse) {
        this.gun.fire();
    }

    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                this.moveDirection.y = 1;
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                this.moveDirection.y = -1;
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                this.moveDirection.x = -1;
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                this.moveDirection.x = 1;
                break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
            case KeyCode.ARROW_UP:
                if (this.moveDirection.y > 0) {
                    this.moveDirection.y = 0;
                }
                break;
            case KeyCode.KEY_S:
            case KeyCode.ARROW_DOWN:
                if (this.moveDirection.y < 0) {
                    this.moveDirection.y = 0;
                }
                break;
            case KeyCode.KEY_A:
            case KeyCode.ARROW_LEFT:
                if (this.moveDirection.x < 0) {
                    this.moveDirection.x = 0;
                }
                break;
            case KeyCode.KEY_D:
            case KeyCode.ARROW_RIGHT:
                if (this.moveDirection.x > 0) {
                    this.moveDirection.x = 0;
                }
                break;
        }
    }

    private faceMousePosition(position: Vec2) {
        this.node.getWorldPosition(this.selfPosition);
        this.camera.getWorldPosition(this.cameraPosition);

        this.facing.set(position.x - this.selfPosition.x, position.y - this.selfPosition.y)
            .subtract2f(
                this.canvasUITransform.width * this.canvasUITransform.anchorX,
                this.canvasUITransform.height * this.canvasUITransform.anchorY
            )
            .add2f(this.cameraPosition.x, this.cameraPosition.y);
        let angle = Math.atan2(this.facing.y, this.facing.x) * 180 / Math.PI;
        this.node.setRotationFromEuler(0, 0, angle);
    }

    private move(direction: Vec2, speed: number) {
        let step = direction.normalize().multiplyScalar(speed);
        this.node.setPosition(
            this.node.position.x + step.x,
            this.node.position.y + step.y
        )
        this.camera.setPosition(
            Math.min(Math.max(this.cameraMinX, this.node.position.x), this.cameraMaxX),
            Math.min(Math.max(this.cameraMinY, this.node.position.y), this.cameraMaxY)
        );
    }
}

