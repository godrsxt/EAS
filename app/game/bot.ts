import * as BABYLON from 'babylonjs';

export interface BotState {
  id: string;
  position: BABYLON.Vector3;
  rotation: BABYLON.Vector3;
  health: number;
  maxHealth: number;
  isDead: boolean;
  behavior: 'idle' | 'patrol' | 'chase' | 'shoot';
}

export class Bot {
  private id: string;
  private mesh: BABYLON.Mesh;
  private scene: BABYLON.Scene;
  private state: BotState;
  private targetPosition: BABYLON.Vector3;
  private moveSpeed = 0.15;
  private detectionRange = 50;
  private shootRange = 40;
  private shootCooldown = 500;
  private lastShotTime = 0;
  private patrolPoints: BABYLON.Vector3[] = [];
  private currentPatrolIndex = 0;
  private playerPosition: BABYLON.Vector3 | null = null;
  private respawnTime = 5000;
  private deathTime = 0;

  constructor(id: string, position: BABYLON.Vector3, scene: BABYLON.Scene) {
    this.id = id;
    this.scene = scene;
    this.state = {
      id,
      position: position.clone(),
      rotation: new BABYLON.Vector3(0, 0, 0),
      health: 100,
      maxHealth: 100,
      isDead: false,
      behavior: 'patrol',
    };

    // Create bot mesh (simple capsule)
    this.mesh = BABYLON.MeshBuilder.CreateCapsule(`bot_${id}`, { height: 1.8, radius: 0.3 }, scene);
    this.mesh.position = position;
    this.mesh.checkCollisions = true;

    // Bot material
    const material = new BABYLON.StandardMaterial(`botMat_${id}`, scene);
    material.emissiveColor = new BABYLON.Color3(1, 0.2, 0.2);
    this.mesh.material = material;

    this.targetPosition = position.clone();
    this.setupPatrolPoints();
  }

  private setupPatrolPoints(): void {
    // Create patrol points around the map
    this.patrolPoints = [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(-30, 1, -30),
      new BABYLON.Vector3(30, 1, -30),
      new BABYLON.Vector3(0, 1, 0),
    ];
  }

  public update(deltaTime: number, playerPosition: BABYLON.Vector3): void {
    if (this.state.isDead) {
      this.updateRespawn();
      return;
    }

    this.playerPosition = playerPosition;

    // Calculate distance to player
    const distanceToPlayer = BABYLON.Vector3.Distance(this.mesh.position, playerPosition);

    // Determine behavior
    if (distanceToPlayer < this.detectionRange) {
      this.state.behavior = 'chase';
      this.targetPosition = playerPosition.clone();
    } else {
      this.state.behavior = 'patrol';
      this.updatePatrol();
    }

    // Move towards target
    this.updateMovement(deltaTime);

    // Shoot if in range
    if (this.state.behavior === 'chase' && distanceToPlayer < this.shootRange) {
      this.shoot();
    }

    // Update state
    this.state.position = this.mesh.position.clone();
    this.state.rotation = this.mesh.rotation.clone();
  }

  private updatePatrol(): void {
    const currentPoint = this.patrolPoints[this.currentPatrolIndex];
    const distance = BABYLON.Vector3.Distance(this.mesh.position, currentPoint);

    if (distance < 2) {
      this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    }

    this.targetPosition = this.patrolPoints[this.currentPatrolIndex].clone();
  }

  private updateMovement(deltaTime: number): void {
    const direction = this.targetPosition.subtract(this.mesh.position);
    direction.y = 0; // Only move horizontally
    const distance = direction.length();

    if (distance > 0.1) {
      direction.normalize();
      const movement = direction.scale(this.moveSpeed * deltaTime);
      this.mesh.position.addInPlace(movement);

      // Rotate to face movement direction
      this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
    }
  }

  private shoot(): void {
    const now = Date.now();
    if (now - this.lastShotTime < this.shootCooldown) {
      return;
    }

    this.lastShotTime = now;

    // 70% accuracy
    if (Math.random() > 0.7) {
      return;
    }

    // Raycast from bot position
    const origin = this.mesh.position.add(new BABYLON.Vector3(0, 0.5, 0));
    const direction = this.playerPosition!.subtract(origin);
    direction.normalize();

    const ray = new BABYLON.Ray(origin, direction, 100);
    const hit = this.scene.pickWithRay(ray);

    // Emit shot event (will be handled by game manager)
  }

  private updateRespawn(): void {
    const now = Date.now();
    if (now - this.deathTime >= this.respawnTime) {
      this.respawn();
    }
  }

  public takeDamage(amount: number): void {
    if (this.state.isDead) return;

    this.state.health -= amount;
    if (this.state.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.state.isDead = true;
    this.deathTime = Date.now();
    this.mesh.dispose();
  }

  private respawn(): void {
    // Recreate mesh
    this.mesh = BABYLON.MeshBuilder.CreateCapsule(
      `bot_${this.id}`,
      { height: 1.8, radius: 0.3 },
      this.scene
    );
    this.mesh.position = this.patrolPoints[0].clone();
    this.mesh.checkCollisions = true;

    const material = new BABYLON.StandardMaterial(`botMat_${this.id}`, this.scene);
    material.emissiveColor = new BABYLON.Color3(1, 0.2, 0.2);
    this.mesh.material = material;

    this.state.health = this.state.maxHealth;
    this.state.isDead = false;
    this.state.behavior = 'patrol';
    this.currentPatrolIndex = 0;
  }

  public getState(): BotState {
    return this.state;
  }

  public getMesh(): BABYLON.Mesh {
    return this.mesh;
  }

  public dispose(): void {
    this.mesh.dispose();
  }
}
