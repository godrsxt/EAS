import * as BABYLON from 'babylonjs';
import '@babylonjs/loaders';

export interface GameConfig {
  canvasId: string;
  width: number;
  height: number;
  mode: 'single' | 'multiplayer';
}

export class GameEngine {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private camera: BABYLON.UniversalCamera | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private config: GameConfig;
  private isRunning = false;
  private gameState: 'menu' | 'playing' | 'paused' | 'gameover' = 'menu';

  constructor(config: GameConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Get canvas element
    this.canvas = document.getElementById(this.config.canvasId) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${this.config.canvasId}" not found`);
    }

    // Create Babylon.js engine with WebGPU support
    try {
      // Try WebGPU first, fall back to WebGL
      this.engine = new BABYLON.Engine(this.canvas, true, {
        antialias: true,
        adaptToDeviceRatio: true,
        preserveDrawingBuffer: true,
      });
    } catch (e) {
      console.warn('WebGPU not supported, falling back to WebGL');
      this.engine = new BABYLON.Engine(this.canvas, true);
    }

    // Create scene
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.collisionsEnabled = true;
    this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    // Setup lighting
    this.setupLighting();

    // Create camera
    this.setupCamera();

    // Create basic environment
    this.createEnvironment();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.engine?.resize();
    });

    // Start render loop
    this.startRenderLoop();
  }

  private setupLighting(): void {
    if (!this.scene) return;

    // Directional light (sun)
    const light = new BABYLON.DirectionalLight(
      'sun',
      new BABYLON.Vector3(-0.5, 1, -0.5),
      this.scene
    );
    light.intensity = 1.2;
    light.range = 500;

    // Shadow generator
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurKernel = 32;

    // Ambient light
    const ambientLight = new BABYLON.HemisphericLight(
      'ambient',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.5;
  }

  private setupCamera(): void {
    if (!this.scene || !this.canvas) return;

    // Create universal camera (works on desktop and mobile)
    this.camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(0, 1.7, -10),
      this.scene
    );

    this.camera.attachControl(this.canvas, true);
    this.camera.inertia = 0.7;
    this.camera.angularSensibility = 1000;
    this.camera.speed = 0;
    this.camera.keysUp = [];
    this.camera.keysDown = [];
    this.camera.keysLeft = [];
    this.camera.keysRight = [];

    // Set camera collision
    this.camera.checkCollisions = true;
    this.camera.inertia = 0.7;
  }

  private createEnvironment(): void {
    if (!this.scene) return;

    // Create ground
    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground',
      { width: 200, height: 200 },
      this.scene
    );
    ground.material = new BABYLON.StandardMaterial('groundMat', this.scene);
    const groundMat = ground.material as BABYLON.StandardMaterial;
    groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.5, 0.2);
    ground.checkCollisions = true;

    // Create some obstacles
    const box1 = BABYLON.MeshBuilder.CreateBox('box1', { size: 5 }, this.scene);
    box1.position = new BABYLON.Vector3(20, 2.5, 20);
    box1.material = new BABYLON.StandardMaterial('boxMat1', this.scene);
    const boxMat1 = box1.material as BABYLON.StandardMaterial;
    boxMat1.emissiveColor = new BABYLON.Color3(0.8, 0.6, 0.4);
    box1.checkCollisions = true;

    const box2 = BABYLON.MeshBuilder.CreateBox('box2', { size: 3 }, this.scene);
    box2.position = new BABYLON.Vector3(-30, 1.5, 30);
    box2.material = new BABYLON.StandardMaterial('boxMat2', this.scene);
    const boxMat2 = box2.material as BABYLON.StandardMaterial;
    boxMat2.emissiveColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    box2.checkCollisions = true;

    // Create sky
    const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 1000 }, this.scene);
    const skyMaterial = new BABYLON.StandardMaterial('skyMat', this.scene);
    skyMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.7, 1);
    skybox.material = skyMaterial;
  }

  private startRenderLoop(): void {
    if (!this.engine || !this.scene) return;

    this.isRunning = true;
    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });
  }

  public getScene(): BABYLON.Scene | null {
    return this.scene;
  }

  public getCamera(): BABYLON.UniversalCamera | null {
    return this.camera;
  }

  public getEngine(): BABYLON.Engine | null {
    return this.engine;
  }

  public setGameState(state: 'menu' | 'playing' | 'paused' | 'gameover'): void {
    this.gameState = state;
  }

  public getGameState(): string {
    return this.gameState;
  }

  public dispose(): void {
    this.isRunning = false;
    if (this.engine) {
      this.engine.dispose();
      this.engine = null;
    }
  }

  public resize(): void {
    if (this.engine) {
      this.engine.resize();
    }
  }
}
