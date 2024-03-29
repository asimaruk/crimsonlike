import { 
    _decorator,
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
    macro,
    Vec3,
    sys,
} from 'cc';
import { Gun } from '../guns/Gun';
import { EventTouch } from 'cc';
import { UIManager } from '../ui/UIManager';
import { Joystick } from '../ui/Joystick';
import { GameComponent } from '../utils/GameComponent';
import { Player } from './Player';
const { ccclass, property, requireComponent, menu } = _decorator;

@ccclass('PlayerController')
@requireComponent(Player)
@menu('Player/PlayerController')
export class PlayerController extends GameComponent {

    @property({
        type: UITransform
    })
    groundUITransform: UITransform;

    @property({
        type: Node
    })
    gunSlot: Node;

    @property({
        type: Joystick
    })
    joystick: Joystick;

    private player: Player;
    private camera: Node;
    private canvas: Node;
    private canvasUITransform: UITransform;
    private cameraWorldPosition = v3();
    private uiFacingPosition = v2();
    private gunWorldPosition = v3();
    private facing = v2();
    private moveDirection = v2();
    private cameraMinX = 0;
    private cameraMaxX = 0;
    private cameraMinY = 0;
    private cameraMaxY = 0;
    private gun: Gun;
    private fireTouchId: number;
    private gunFireCallback = () => this.gun.fire();

    protected onLoad() {
        this.player = this.getComponent(Player);
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

    protected update(deltaTime: number) {
        if (!this.resumed) return;

        let joystickDirection = this.joystick.getDirection();
        if (joystickDirection.x != 0 || joystickDirection.y != 0) {
            this.player.walk();
            this.move(joystickDirection, this.player.speed * deltaTime);
        } else if (this.moveDirection.x != 0 || this.moveDirection.y != 0) {
            this.player.walk();
            this.move(this.moveDirection, this.player.speed * deltaTime);
            this.faceMousePosition(this.uiFacingPosition);
        } else {
            this.player.stopWalk();
        }
    }

    protected onGameResume() {
        this.onInput();
    }

    protected onGamePause() {
        this.offInput();
        this.unschedule(this.gunFireCallback);
    }

    protected onGameOver(): void {
        this.offInput();
        this.unschedule(this.gunFireCallback);
    }

    protected onGameReset() {
        this.offInput();
        this.unschedule(this.gunFireCallback);
    }

    protected onDestroy() {
        this.offInput();
    }

    private onInput() {
        if (sys.hasFeature(sys.Feature.INPUT_TOUCH)) {
            this.joystick.node.active = true;
            input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        } else {
            this.joystick.node.active = false;
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
            input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
            input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    private offInput() {
        this.offMouseInput();
        this.offTouchInput();
    }

    private offTouchInput() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    private offMouseInput() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    private onTouchStart(event: EventTouch) {
        let touch = event.getTouches()[0];
        this.fireTouchId = touch.getID();
        this.faceMousePosition(touch.getUILocation());
        this.uiFacingPosition = touch.getUILocation();
        this.faceMousePosition(this.uiFacingPosition);
        this.gun.fire();
        this.schedule(this.gunFireCallback, this.gun.frequency, macro.REPEAT_FOREVER, this.gun.frequency);
    }

    private onTouchMove(event: EventTouch) {
        let fireTouch = event.getTouches().find((touch) => {
            return touch.getID() == this.fireTouchId;
        });
        if (fireTouch) {
            this.uiFacingPosition = fireTouch.getUILocation();
            this.faceMousePosition(this.uiFacingPosition);
        }
    }

    private onTouchEnd(event: EventTouch) {
        let fireTouch = event.getTouches().find((touch) => {
            return touch.getID() == this.fireTouchId;
        });
        if (fireTouch) {
            this.unschedule(this.gunFireCallback);
        }
    }

    private onMouseMove(event: EventMouse) {
        event.getUILocation(this.uiFacingPosition);
        this.faceMousePosition(this.uiFacingPosition);
    }

    private onMouseDown() {
        this.gun.fire();
        this.schedule(this.gunFireCallback, this.gun.frequency, macro.REPEAT_FOREVER, this.gun.frequency);
    }

    private onMouseUp() {
        this.unschedule(this.gunFireCallback);
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
        this.gunSlot.getWorldPosition(this.gunWorldPosition);
        this.camera.getWorldPosition(this.cameraWorldPosition);

        this.facing.set(position.x - this.gunWorldPosition.x, position.y - this.gunWorldPosition.y)
            .subtract2f(
                this.canvasUITransform.width * this.canvasUITransform.anchorX,
                this.canvasUITransform.height * this.canvasUITransform.anchorY
            )
            .add2f(this.cameraWorldPosition.x, this.cameraWorldPosition.y);
        let angle = Math.atan2(this.facing.y, this.facing.x) * 180 / Math.PI;
        this.gunSlot.setRotationFromEuler(0, 0, angle);
    }

    private move(direction: Vec2 | Vec3, speed: number) {
        let step = direction.normalize().multiplyScalar(speed);
        this.node.setPosition(
            this.node.position.x + step.x,
            this.node.position.y + step.y
        )
        if (direction.x != 0) {
            this.player.skin.setScale(Math.sign(direction.x), 1, 1);
        }
        this.camera.setPosition(
            Math.min(Math.max(this.cameraMinX, this.node.position.x), this.cameraMaxX),
            Math.min(Math.max(this.cameraMinY, this.node.position.y), this.cameraMaxY)
        );
    }
}

