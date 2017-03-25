import { Engine } from 'babylonjs';
import * as Hammer from 'hammerjs';

const CLEAR_COLOR = new BABYLON.Color3(1, 1, 1);

class BabylonHammerController implements BABYLON.ICameraInput<BABYLON.ArcRotateCamera> {

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

function addBox(scene: BABYLON.Scene, x: number, z: number, shadowGenerator: BABYLON.IShadowGenerator){
    let box = BABYLON.Mesh.CreateBox("box", 2.0, scene);
    box.position.y = 1;
    let boxMaterial = new BABYLON.StandardMaterial("texture1", scene);
    boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
    boxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    box.material = boxMaterial;
    shadowGenerator.getShadowMap().renderList.push(box);
    return box;
}

function createScene(canvas: HTMLCanvasElement, engine: BABYLON.Engine){
    let scene = new BABYLON.Scene(engine);
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    scene.clearColor = CLEAR_COLOR;
    let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(0, 15, 5));
    camera.inputs.clear();
    camera.inputs.add(new BabylonHammerController());
    camera.attachControl(canvas, false);

    let light = new BABYLON.HemisphericLight("hemispheric", new BABYLON.Vector3(0, 1, 1), scene);
    light.intensity = .7;

    let sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
    sun.diffuse = new BABYLON.Color3(.5, .5, .5);
    sun.specular = new BABYLON.Color3(1, 1, 1);

    let shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
    shadowGenerator.bias = 0.01;
    shadowGenerator.useVarianceShadowMap = true;

    
    let mc = new Hammer(canvas);
    mc.on('tap', (ev) => {
        if(ev.srcEvent.type == "MouseEvent"){
            let mouseEv = ev.srcEvent as MouseEvent;
            var pickResult = scene.pick(mouseEv.clientX, mouseEv.clientY);
            if(pickResult.hit){
                addBox(scene, pickResult.pickedPoint.x, pickResult.pickedPoint.z, shadowGenerator);
            }
        }
    });

    let ground = BABYLON.Mesh.CreateGround("ground1", 500, 500, 1, scene);
    ground.receiveShadows = true;
    return scene;
}

const initialize = (canvas: HTMLCanvasElement) => {
    let engine = new BABYLON.Engine(canvas, true);
    let scene = createScene(canvas, engine);
    
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}

initialize(document.getElementById('maincanvas') as HTMLCanvasElement);
