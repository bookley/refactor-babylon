import * as BABYLON from 'babylonjs';
import Hammer from 'hammerjs';

const CLEAR_COLOR = new BABYLON.Color3(1, 1, 1);

class BabylonHammerController {

    constructor(camera){
        this.camera = camera;
    }

    getSimpleName(){
        return "hammer";
    }

    getTypeName(){
        return "BabylonHammerController";
    }

    attachControl(element, noPreventDefault){
        this.mc = new Hammer(element);
        this.mc.on('pan', (ev) => {
            this.camera.target.x += ev.velocityX;
            this.camera.target.z -= ev.velocityY;
        });
    }

    detachControl(element){

    }

    checkInputs(){

    }
}

function createScene(canvas, engine){
    let scene = new BABYLON.Scene(engine);
    scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    scene.clearColor = CLEAR_COLOR;
    let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(0, 15, 5));
    camera.inputs.clear();
    camera.inputs.add(new BabylonHammerController(camera));
    camera.attachControl(canvas, false);

    let light = new BABYLON.HemisphericLight("hemispheric", new BABYLON.Vector3(0, 1, 1), scene);
    light.intensity = .7;

    let sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
    sun.diffuse = new BABYLON.Color3(.5, .5, .5);
    sun.specular = new BABYLON.Color3(1, 1, 1);

    let shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
    shadowGenerator.bias = 0.01;
    shadowGenerator.useVarianceShadowMap = true;

    let box = BABYLON.Mesh.CreateBox("box", 2.0, scene);
    box.position.y = 1;
    box.material = new BABYLON.StandardMaterial("texture1", scene);
    box.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    box.material.specularColor = new BABYLON.Color3(0, 0, 0);

    shadowGenerator.getShadowMap().renderList.push(box);


    let ground = BABYLON.Mesh.CreateGround("ground1", 500, 500, 1, scene);
    ground.receiveShadows = true;
    return scene;
}

const initialize = (canvas) => {
    let engine = new BABYLON.Engine(canvas, true);
    let scene = createScene(canvas, engine);
    
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}

initialize(document.getElementById('maincanvas'));