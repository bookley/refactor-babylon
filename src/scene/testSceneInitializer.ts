import 'babylonjs';
import SceneInitializer from './sceneInitializer';
import BabylonHammerController from '../camera/babylonHammerController';

export default class TestSceneInitializer implements SceneInitializer {

    private readonly CLEAR_COLOR = new BABYLON.Color3(1, 1, 1);

    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;

    constructor(engine: BABYLON.Engine) {
        this._engine = engine;
    }

    public initialize(): BABYLON.Scene {
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        this._scene.clearColor = this.CLEAR_COLOR;
        let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this._scene);
        camera.setPosition(new BABYLON.Vector3(0, 15, 5));
        camera.inputs.clear();
        camera.inputs.add(new BabylonHammerController());
        camera.attachControl(this._engine.getRenderingCanvas() as HTMLElement, false);

        let light = new BABYLON.HemisphericLight("hemispheric", new BABYLON.Vector3(0, 1, 1), this._scene);
        light.intensity = .7;

        let sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), this._scene);
        sun.diffuse = new BABYLON.Color3(.5, .5, .5);
        sun.specular = new BABYLON.Color3(1, 1, 1);

        let shadowGenerator = new BABYLON.ShadowGenerator(1024, sun);
        shadowGenerator.bias = 0.01;
        shadowGenerator.useVarianceShadowMap = true;

        let mc = new Hammer(this._engine.getRenderingCanvas() as HTMLElement);
        mc.on('tap', (ev) => {
            if(ev.srcEvent instanceof PointerEvent){
                let mouseEv = ev.srcEvent as PointerEvent;
                var pickResult = this._scene.pick(mouseEv.clientX, mouseEv.clientY);
                if(pickResult.hit){
                    this.addBox(pickResult.pickedPoint.x, pickResult.pickedPoint.z, shadowGenerator);
                }
            }
        });

        let ground = BABYLON.Mesh.CreateGround("ground1", 500, 500, 1, this._scene);
        ground.receiveShadows = true;
        return this._scene;
    }

    addBox(x: number, z: number, shadowGenerator: BABYLON.IShadowGenerator){
        let box = BABYLON.Mesh.CreateBox("box", 2.0, this._scene);
        box.position = new BABYLON.Vector3(x, 1, z);
        let boxMaterial = new BABYLON.StandardMaterial("texture1", this._scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
        boxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        box.material = boxMaterial;
        shadowGenerator.getShadowMap().renderList.push(box);
        return box;
    }
}