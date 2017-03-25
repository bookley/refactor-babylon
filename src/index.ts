import 'babylonjs';
import BabylonHammerController from './camera/babylonHammerController';
import SceneInitializer from './scene/sceneInitializer';
import TestSceneInitializer from './scene/testSceneInitializer';

const initialize = (canvas: HTMLCanvasElement) => {
    const engine = new BABYLON.Engine(canvas, true);
    const sceneInitializer: SceneInitializer = new TestSceneInitializer(engine);
    const scene = sceneInitializer.initialize();
    
    engine.runRenderLoop(() => {
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}

initialize(document.getElementById('maincanvas') as HTMLCanvasElement);
