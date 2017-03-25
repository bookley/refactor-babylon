import * as Hammer from 'hammerjs';

export default class BabylonHammerController implements BABYLON.ICameraInput<BABYLON.ArcRotateCamera> {

    public camera: BABYLON.ArcRotateCamera;
    private hammerManager: HammerManager

    constructor(){

    }

    getSimpleName(){
        return "hammer";
    }

    getTypeName(){
        return "BabylonHammerController";
    }

    attachControl(element: HTMLElement, noPreventDefault: boolean){
        this.hammerManager = new Hammer(element);
        this.hammerManager.on('pan', (ev) => {
            this.camera.target.x += ev.velocityX;
            this.camera.target.z -= ev.velocityY;
        });
    }

    detachControl(element: HTMLElement){}

    checkInputs(){}
}