import * as BABYLON from 'babylonjs';

export interface PlayerStats {
  health: number;
  maxHealth: number;
  ammo: number;
  magazineCapacity: number;
  reserve: number;
  isReloading: boolean;
  kills: number;
  deaths: number;
}

export class Player {
  private camera: BABYLON.UniversalCamera;
  private scene: BABYLON.Scene;
  private engine: BABYLON.Engine;
  private stats: PlayerStats;
  private moveDirection = new BABYLON.Vector3(0, 0, 0);
  private moveSpeed = 0.2;
  private reloadTime = 2000; // 2 seconds
  private reloadStartTime = 0;
  private lastShotTime = 0;
  private fireRate = 100; // milliseconds between shots
  private isShooting = false;
  private keysPressed: { [key: string]: boolean } = {};

  constructor(camera: BABYLON.UniversalCamera, scene: BABYLON.Scene, engine: BABYLON.Engine) {
    this.camera = camera;
    this.scene = scene;
    this.engine = engine;
    this.stats = {
      health: 100,
      maxHealth: 100,
      ammo: 30,
      magazineCapacity: 30,
      reserve: 300,
      isReloading: false,
      kills: 0,
      deaths: 0,
    };

    this.setupControls();
  }

  private setupControls(): void {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keysPressed[e.key.toLowerCase()] = true;

      if (e.key.toLowerCase() === 'r') {
        this.reload();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
    });

    // Mouse click for shooting
    window.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        // Left click
        this.isShooting = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isShooting = false;
      }
    });

    // Pointer lock for desktop
    if (typeof document !== 'undefined') {
      document.addEventListener('click', () => {
        const canvas = this.scene.getEngine().getRenderingCanvas();
        if (canvas) {
          canvas.requestPointerLock = canvas.requestPointerLock || (canvas as any).mozRequestPointerLock;
          canvas.requestPointerLock?.();
        }
      });
    }
  }

  public update(deltaTime: number): void {
    // Update movement
    this.updateMovement(deltaTime);

    // Update shooting
    this.updateShooting(deltaTime);

    // Update reload
    this.updateReload(deltaTime);
  }

  private updateMovement(deltaTime: number): void {
    const moveVector = new BABYLON.Vector3(0, 0, 0);

    // Get camera forward and right vectors
    const forward = BABYLON.Vector3.Forward();
    const right = BABYLON.Vector3.Right();

    // Transform to camera space
    const cameraMatrix = BABYLON.Matrix.RotationYawPitchRoll(
      this.camera.rotation.y,
      this.camera.rotation.x,
      this.camera.rotation.z
    );

    const cameraForward = BABYLON.Vector3.TransformCoordinates(forward, cameraMatrix);
    const cameraRight = BABYLON.Vector3.TransformCoordinates(right, cameraMatrix);

    // Remove Y component for ground-based movement
    cameraForward.y = 0;
    cameraRight.y = 0;
    cameraForward.normalize();
    cameraRight.normalize();

    // WASD movement
    if (this.keysPressed['w']) moveVector.addInPlace(cameraForward);
    if (this.keysPressed['s']) moveVector.subtractInPlace(cameraForward);
    if (this.keysPressed['a']) moveVector.subtractInPlace(cameraRight);
    if (this.keysPressed['d']) moveVector.addInPlace(cameraRight);

    // Normalize and apply speed
    if (moveVector.length() > 0) {
      moveVector.normalize();
      this.camera.position.addInPlace(moveVector.scale(this.moveSpeed * deltaTime));
    }
  }

  private updateShooting(deltaTime: number): void {
    if (!this.isShooting || this.stats.isReloading || this.stats.ammo <= 0) {
      return;
    }

    const now = Date.now();
    if (now - this.lastShotTime < this.fireRate) {
      return;
    }

    this.lastShotTime = now;
    this.stats.ammo--;
    this.shoot();

    if (this.stats.ammo <= 0) {
      this.reload();
    }
  }

  private shoot(): void {
    // Raycast from camera center
    const origin = this.camera.position;
    const direction = BABYLON.Vector3.Forward();

    // Transform direction to camera space
    const cameraMatrix = BABYLON.Matrix.RotationYawPitchRoll(
      this.camera.rotation.y,
      this.camera.rotation.x,
      this.camera.rotation.z
    );
    const worldDirection = BABYLON.Vector3.TransformCoordinates(direction, cameraMatrix);

    const length = 1000;
    const ray = new BABYLON.Ray(origin, worldDirection, length);

    // Get hit information
    const hit = this.scene.pickWithRay(ray, (mesh: BABYLON.AbstractMesh) => {
      return mesh && mesh.name !== 'player' && mesh.name !== 'skybox';
    }, false);

    if (hit && hit.hit) {
      // Shooting event - hit registered
      console.log('Shot fired at:', hit.pickedPoint);
    }
  }

  private updateReload(deltaTime: number): void {
    if (!this.stats.isReloading) return;

    const elapsed = Date.now() - this.reloadStartTime;
    if (elapsed >= this.reloadTime) {
      // Reload complete
      const ammoToReload = Math.min(
        this.stats.magazineCapacity - this.stats.ammo,
        this.stats.reserve
      );
      this.stats.ammo += ammoToReload;
      this.stats.reserve -= ammoToReload;
      this.stats.isReloading = false;
    }
  }

  public reload(): void {
    if (this.stats.isReloading || this.stats.ammo === this.stats.magazineCapacity) {
      return;
    }

    this.stats.isReloading = true;
    this.reloadStartTime = Date.now();
  }

  public takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
    if (this.stats.health <= 0) {
      this.stats.deaths++;
    }
  }

  public heal(amount: number): void {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  public getStats(): PlayerStats {
    return this.stats;
  }

  public getPosition(): BABYLON.Vector3 {
    return this.camera.position.clone();
  }

  public getRotation(): { yaw: number; pitch: number } {
    return {
      yaw: this.camera.rotation.y,
      pitch: this.camera.rotation.x,
    };
  }

  public setPosition(position: BABYLON.Vector3): void {
    this.camera.position = position;
  }

  public setRotation(yaw: number, pitch: number): void {
    this.camera.rotation.y = yaw;
    this.camera.rotation.x = pitch;
  }

  public isShooting_(): boolean {
    return this.isShooting;
  }

  public dispose(): void {
    // Cleanup
  }
}
