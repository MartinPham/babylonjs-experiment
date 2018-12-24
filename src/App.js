import { 
	Engine, 
	Scene, 
	FreeCamera, 
	TouchCamera, 
	UniversalCamera,
	HemisphericLight, 
	Vector3, 
	Mesh,
	MeshBuilder,
	Axis,
	Space,
	PhysicsImpostor,
	StandardMaterial,
	Color3,
	AssetsManager,
	SkyMaterial
} from 'babylonjs';

import {
	SceneLoader
} from 'babylonjs-loaders';

import './objects/rainbow/Rainbow_01.gltf';
import './objects/rainbow/Rainbow_01.bin';

import './objects/cloud2/cloud_02.gltf';
import './objects/cloud2/cloud_02.bin';

import './objects/blimp/Blimp.gltf';
import './objects/blimp/Blimp.bin';
import './objects/blimp/Blimp tex.png';

import './objects/falibu/model.gltf';
import './objects/falibu/model.bin';

import './objects/ghost/ghost02.gltf';
import './objects/ghost/ghost02.bin';

import './objects/book/scene.gltf';
import './objects/book/scene.bin';
import './objects/book/textures/Texture-base_baseColor.jpg';
import './objects/book/textures/Texture-base-gloss-jpg_baseColor.jpg';
import './objects/book/textures/Book-tittle_baseColor.png';
import './objects/book/textures/Book-tittle_emissive.jpg';


export default class App {
	scene = null;
	camera = null;
	engine = null;
	canvas = null;
	vrHelper = null;


	light = null;
	sphere = null;
	blimp = null;
	ground = null;

	isJumping = false;

	// plane = null;
	sky = null;
	falibu = null;
	falibuY = 0;
	falibuMovingUp = false;

	assetsManager = null;
	move = {
		x: 0,
		y: 0,
		z: 0
	};

	cameraSpeed = 0.2;

	constructor(canvas, engine)
	{
		this.canvas = canvas;
		this.engine = engine;

		SceneLoader.Load('/src/objects/book/', 'scene.gltf', this.engine, (newScene) => { 
			// console.log(newScene.meshes.length)
			for(let i = 0; i < newScene.meshes.length; i++)
	    	{
	    		const object = newScene.meshes[i];

			    object.checkCollisions = true;
			    object.applyGravity = true;

			    // if(i == 2)
			    // {
				   //  object.material = new StandardMaterial("Mat", newScene);
				   //  object.material.wireframe = true;
			    // }
	    	}

	    	// this.plane = newScene.meshes[2];

			this.scene = newScene;

			this.assetsManager = new AssetsManager(this.scene);


			// Enable Collisions
			this.scene.collisionsEnabled = true;

			// add gravity
			this.scene.gravity = new Vector3(0, -0.0981 * 2, 0);

			this.vrHelper = this.scene.createDefaultVRExperience();

			this.camera = this.vrHelper.currentVRCamera;

			this.scene.clearColor = new Color3(91/255, 169/255, 229/255);

			this.camera.onCollide = (mesh) => {
				// console.log(mesh.id)
				// if(mesh.id ==='Scene_Texture-base_0' || mesh.id ==='Scene_Texture-base-gloss-jpg_0' || mesh.id ==='Waterfall_Texture-base-gloss-jpg_0')
				// {
					this.isJumping = false;
				// }
			}

			// this.camera.position = new Vector3(-100, 30, 100);
			// this.cameraSpeed = this.camera.speed = 3;
			// this.camera.speed = 100;
			
			this.camera.position = new Vector3(-8, 2, -10);
			this.camera._needMoveForGravity = true;
			this.camera.applyGravity = true;

	    	// this.camera.keysUp = [87];
	    	// this.camera.keysDown = [83];
	    	// this.camera.keysLeft = [65];
	    	// this.camera.keysRight = [68];
	    	this.camera.speed = this.cameraSpeed;

	    	// This targets the camera to scene origin
	    	this.camera.setTarget(Vector3.Zero());

	    	//Set the ellipsoid around the camera (e.g. your player's size)
			this.camera.ellipsoid = new Vector3(0.5, 1.2, 0.5);
			
	    	// This attaches the camera to the canvas
	    	this.camera.attachControl(canvas, true);

	    	// Then apply collisions and gravity to the active camera
			this.camera.checkCollisions = true;

	    	// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
	    	this.light = new HemisphericLight("light1", new Vector3(0, 1, 0.2), this.scene);

	    	// Default intensity is 1. Let's dim the light a small amount
	    	this.light.intensity = 2.3;

	    	this.scene.enablePhysics();




	    	// load stuffs
	    	var rainbowTask = this.assetsManager.addMeshTask("rainbow", "", "./src/objects/rainbow/", "Rainbow_01.gltf");
	    	rainbowTask.onSuccess = function (task) {
		    	for(let i = 0; i < task.loadedMeshes.length; i++)
		    	{
		    		const object = task.loadedMeshes[i];
		    		object.position = new Vector3(50, 25, -60);
		    		object.scaling = new Vector3(1.5, 1.5, 1.5);
		    		object.rotation = new Vector3(0, Math.PI / 4, 0);

		    		return;
		    	}
			}

	    	var cloudTask = this.assetsManager.addMeshTask("cloud", "", "./src/objects/cloud2/", "cloud_02.gltf");
	    	cloudTask.onSuccess = function (task) {
		    	for(let i = 0; i < task.loadedMeshes.length; i++)
		    	{
		    		const object = task.loadedMeshes[i];
		    		object.position = new Vector3(50, 22, -20);
		    		object.scaling = new Vector3(0.03, 0.03, 0.07);
		    		object.rotation = new Vector3(0, -Math.PI / 4, 0);

		    		return;
		    	}
			}


	    	var ghostTask = this.assetsManager.addMeshTask("ghost", "", "./src/objects/ghost/", "ghost02.gltf");
	    	ghostTask.onSuccess = function (task) {
		    	for(let i = 0; i < task.loadedMeshes.length; i++)
		    	{
		    		const object = task.loadedMeshes[i];
		    		object.position = new Vector3(-15, 0, -13);
		    		object.scaling = new Vector3(0.03, 0.03, 0.03);
		    		object.rotation = new Vector3(0, -Math.PI, 0);

		    		return;
		    	}
			}

	    	var falibuTask = this.assetsManager.addMeshTask("falibu", "", "./src/objects/falibu/", "model.gltf");
	    	falibuTask.onSuccess = (task) => {
		    	for(let i = 0; i < task.loadedMeshes.length; i++)
		    	{
		    		const object = task.loadedMeshes[i];
		    		object.position = new Vector3(160, -10, 150);
		    		object.scaling = new Vector3(50, 50, 50);
		    		object.rotation = new Vector3(0, -Math.PI / 4, 0);

		    		this.falibu = object;
		    		return;
		    	}
			}

		    this.blimp = Mesh.CreateBox("box1", 0.0001, this.scene);
		    this.blimp.isVisible = false;
		    this.blimp.position = new Vector3(70, 70, -120);
		    this.blimp.rotation = new Vector3(0, Math.PI/4, 0);
	    
	    	var blimpTask = this.assetsManager.addMeshTask("blimp", "", "./src/objects/blimp/", "Blimp.gltf");
	    	blimpTask.onSuccess = (task) => {

		    	for(let i = 0; i < task.loadedMeshes.length; i++)
		    	{

		    		const object = task.loadedMeshes[i];
		    		object.scaling = new Vector3(0.03, 0.03, 0.03);
		    		object.parent = this.blimp;
		    	}
		    	
			}



			// wall
			const wallMaterial = new StandardMaterial("Mat", this.scene);
			wallMaterial.alpha = 0.0;
			let wall = MeshBuilder.CreateBox("wall", {height: 30, width: 100, depth: 2}, this.scene);
	    	wall.material = wallMaterial;
	    	wall.position = new Vector3(0, 0, 35);
	    	wall.checkCollisions = true;

			let wall2 = MeshBuilder.CreateBox("wall2", {height: 30, width: 100, depth: 2}, this.scene);
	    	wall2.material = wallMaterial;
	    	wall2.position = new Vector3(0, 0, -35);
	    	wall2.checkCollisions = true;

			let wall3 = MeshBuilder.CreateBox("wall3", {height: 30, width: 100, depth: 2}, this.scene);
	    	wall3.material = wallMaterial;
	    	wall3.position = new Vector3(50, 0, 0);
	    	wall3.rotation = new Vector3(0, -Math.PI/2, 0);
	    	wall3.checkCollisions = true;

			let wall4 = MeshBuilder.CreateBox("wall4", {height: 30, width: 100, depth: 2}, this.scene);
	    	wall4.material = wallMaterial;
	    	wall4.position = new Vector3(-40, 0, 0);
	    	wall4.rotation = new Vector3(0, -Math.PI/2, 0);
	    	wall4.checkCollisions = true;

			this.assetsManager.load();
		});



		// small api
		window.addEventListener('message', (event) => {
			if(event.data.type ==='App/Camera/StartMoving')
			{
				const {x, y, z} = event.data.direction;

				this.move = {x, y, z};

			}else if(event.data.type ==='App/Camera/EndMoving')
			{
				this.move = {
					x: 0,
					y: 0,
					z: 0
				};
			}
		}, false);

		document.addEventListener('keydown', (event) => {
			if(event.keyCode === 32)
			{

				this._jump();
			}else if(event.keyCode === 87)
			{
				this.move = {
					...this.move,
					z: this.cameraSpeed
				};
			}else if(event.keyCode === 83)
			{
				this.move = {
					...this.move,
					z: -this.cameraSpeed
				};
			}else if(event.keyCode === 65)
			{
				this.move = {
					...this.move,
					x: -this.cameraSpeed
				};
			}else if(event.keyCode === 68)
			{
				this.move = {
					...this.move,
					x: this.cameraSpeed
				};
			}
		});
		document.addEventListener('keyup', (event) => {
			if(event.keyCode === 32)
			{

			} else if(event.keyCode === 87)
			{
				this.move = {
					...this.move,
					z: 0
				};
			}else if(event.keyCode === 83)
			{
				this.move = {
					...this.move,
					z: 0
				};
			}else if(event.keyCode === 65)
			{
				this.move = {
					...this.move,
					x: 0
				};
			}else if(event.keyCode === 68)
			{
				this.move = {
					...this.move,
					x: 0
				};
			}
		});

		this.canvas.addEventListener('touchstart', (event) => {
			const touches = event.touches;

			let x = 0;
			let y = 0;
			let z = 0;

			for(let i = 0; i < touches.length; i++)
			{
				const touch = touches[i];


				const speed = 0.1;

				const {pageX, pageY} = touch;
				/*
				+-------------------+
				|    |    U    |    |
				| L  +----J----+  R |
				|    |    D    |    |
				+-------------------+
				*/
			
				if(pageX < window.innerWidth / 4)
				{
					x -= speed;
				}else if(pageX > window.innerWidth * 3 / 4)
				{
					x += speed;
				}else if(pageY < window.innerHeight / 3)
				{
					z += speed;
				}else if(pageY < window.innerHeight * 2 / 3)
				{

					this._jump();
				}else
				{
					z -= speed;
				}
			}

			window.postMessage(
				{
					type: 'App/Camera/StartMoving',
					direction: {
						x, y, z
					}
				},
				location.href
			);
		}, false);


		this.canvas.addEventListener('touchend', (event) => {
			window.postMessage(
				{
					type: 'App/Camera/EndMoving'
				},
				location.href
			);
		}, false);



	}

	_moveCamera(x, y, z)
	{
		this.camera.cameraDirection = Vector3.TransformNormal(
			new Vector3(x, y, z), 
			this.camera.getWorldMatrix()
		);		

	}

	_jump()
	{
		if(this.isJumping)
		{
			return;
		}

		this.isJumping = true;
				

		this._moveCamera(0, 1, 0);
	}


	render()
	{
		if(this.scene !== null)
		{
			this.scene.render();

			// console.log(this.camera.intersectsMesh(this.plane, false));

			if(this.blimp !==null)
			{
				this.blimp.translate(Axis.Z, 0.1, Space.LOCAL);
				this.blimp.rotate(Axis.Y, -Math.PI/3000, Space.WORLD);
			}

			if(this.falibu !==null)
			{
				if(this.falibuMovingUp)
				{
					this.falibuY++;
				} else {
					this.falibuY--;
				}

				if(this.falibuY > 100 || this.falibuY < -100)
				{
					this.falibuMovingUp = !this.falibuMovingUp;
				}

				this.falibu.translate(Axis.Y, this.falibuY/30000, Space.LOCAL);
			}
			

			if (
				this.move.x !==0 || this.move.y !==0 || this.move.z !==0
			) {
				let {x, y, z} = this.move;

				this._moveCamera(x, y, z);

			}
		}

	}
}