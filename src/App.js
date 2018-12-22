import { 
	Engine, 
	Scene, 
	FreeCamera, 
	TouchCamera, 
	UniversalCamera,
	HemisphericLight, 
	Vector3, 
	MeshBuilder, 
	Mesh,
	PhysicsImpostor,
	StandardMaterial,
	Color3,
	AssetsManager
} from 'babylonjs';

import {
	SceneLoader
} from 'babylonjs-loaders';

import './objects/lamp.obj';
import './objects/vp.mtl';


export default class App {
	scene = null;
	camera = null;
	engine = null;
	canvas = null;
	vrHelper = null;


	light = null;
	sphere = null;
	box = null;
	ground = null;

	assetsManager = null;

	constructor(canvas, engine)
	{
		this.canvas = canvas;
		this.engine = engine;


		// This creates a basic Babylon Scene object (non-mesh)
		this.scene = new Scene(this.engine);
		// this.vrHelper = this.scene.createDefaultVRExperience();
		

		this.assetsManager = new AssetsManager(this.scene);

    	// Enable Collisions
		this.scene.collisionsEnabled = true;
		
		// add gravity
		this.scene.gravity = new Vector3(0, -9.81, 0);

		// This creates and positions a free camera (non-mesh)
    	this.camera = new UniversalCamera("camera", new Vector3(0, 2, 10), this.scene);

    	this.camera.keysUp = [87];
    	this.camera.keysDown = [83];
    	this.camera.keysLeft = [65];
    	this.camera.keysRight = [68];
    	this.camera.speed = 1;

    	// This targets the camera to scene origin
    	this.camera.setTarget(Vector3.Zero());

    	//Set the ellipsoid around the camera (e.g. your player's size)
		this.camera.ellipsoid = new Vector3(1, 1, 1);
		
    	// This attaches the camera to the canvas
    	this.camera.attachControl(canvas, true);

    	// Then apply collisions and gravity to the active camera
		this.camera.checkCollisions = true;
		this.camera.applyGravity = true;

    	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    	this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);

    	// Default intensity is 1. Let's dim the light a small amount
    	this.light.intensity = 0.7;

		// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
	    this.sphere = Mesh.CreateSphere("sphere1", 16, 2, this.scene);
	    this.sphere.material = new StandardMaterial("Mat", this.scene);
	    this.sphere.material.diffuseColor = new Color3(1, 1, 1);
	    this.sphere.material.backFaceCulling = false;
	    this.sphere.position = new Vector3(0, 10, -10);
	    this.sphere.checkCollisions = true;
	    this.sphere.applyGravity = true;
	    this.sphere.material.wireframe = true;

	    // this.camera.parent = this.sphere;

	    //Simple crate
	    this.box = Mesh.CreateBox("box1", 2, this.scene);
	    this.box.material = new StandardMaterial("Mat", this.scene);
	    this.box.material.diffuseColor = new Color3(1, 1, 1);
	    this.box.material.backFaceCulling = false;
	    this.box.position = new Vector3(10, 10, -15);
	    this.box.checkCollisions = true;
	    this.box.material.wireframe = true;

		// ground
	    this.ground = Mesh.CreatePlane("ground1", 40.0, this.scene);
	    this.ground.checkCollisions = true;
	    this.ground.material = new StandardMaterial("groundMat", this.scene);
	    this.ground.material.diffuseColor = new Color3(1, 1, 1);
	    this.ground.material.backFaceCulling = false;
	    this.ground.position = new Vector3(0, 0, 0);
	    this.ground.rotation = new Vector3(Math.PI / 2, 0, 0);
		

		this.scene.enablePhysics();


		this.ground.physicsImpostor = new PhysicsImpostor(
			this.ground, 
			PhysicsImpostor.BoxImpostor, 
			{ 
				mass: 0, 
				restitution: 0.6
			}, 
			this.scene
		);


	    // objects
	    const meshTask = this.assetsManager.addMeshTask("lampTask", "", "./src/objects/", "lamp.obj");
	    meshTask.onSuccess = function (task) {
	    	for(let i = 0; i < task.loadedMeshes.length; i++)
	    	{
	    		const object = task.loadedMeshes[i];
	    		object.position = new Vector3(5, 5, -10);

				object.material = new StandardMaterial("Mat", this.scene);
			    object.material.diffuseColor = new Color3(1, 1, 1);
			    object.material.backFaceCulling = false;
			    object.checkCollisions = true;
			    object.applyGravity = true;
	    		object.material.wireframe = true;

	    	}
		}

		meshTask.onError = function (task, message, exception) {
		    console.log(message, exception);
		}

		this.assetsManager.load();

// 		SceneLoader.Append('./src/objects/', 'lamp.obj', this.scene, (object) => {
// 
// 			object.material = new StandardMaterial("Mat", this.scene);
// 			    object.material.diffuseColor = new Color3(1, 1, 1);
// 			    object.material.backFaceCulling = false;
// 			    object.position = new Vector3(0, 5, -10);
// 			    object.checkCollisions = true;
// 			    object.applyGravity = true;
// 
// 
// 				// object.physicsImpostor = new PhysicsImpostor(
// 				// 	object, 
// 				// 	PhysicsImpostor.SphereImpostor, 
// 				// 	{
// 				// 		mass: 1, 
// 				// 		restitution: 0.6
// 				// 	}, 
// 				// 	this.scene
// 				// );
// 		});


		
		this.sphere.physicsImpostor = new PhysicsImpostor(
			this.sphere, 
			PhysicsImpostor.SphereImpostor, 
			{
				mass: 1, 
				restitution: 0.6
			}, 
			this.scene
		);

		this.box.physicsImpostor = new PhysicsImpostor(
			this.box, 
			PhysicsImpostor.SphereImpostor, 
			{
				mass: 1, 
				restitution: 0.6
			}, 
			this.scene
		);


	}


	render()
	{
		this.scene.render();


	}
}