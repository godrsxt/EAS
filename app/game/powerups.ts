import * as BABYLON from 'babylonjs';

export type PowerUpType = 'health' | 'ammo' | 'speed' | 'damage';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  position: BABYLON.Vector3;
  mesh: BABYLON.Mesh;
  active: boolean;
  duration: number; // in seconds, 0 = permanent
  spawnTime: number;
}

export class PowerUpSystem {
  private powerUps: Map<string, PowerUp> = new Map();
  private scene: BABYLON.Scene;
  private spawnPoints: BABYLON.Vector3[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
    this.initializeSpawnPoints();
  }

  private initializeSpawnPoints(): void {
    // Define spawn points around the map
    this.spawnPoints = [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
      new BABYLON.Vector3(-30, 1, -30),
      new BABYLON.Vector3(0, 1, 40),
      new BABYLON.Vector3(0, 1, -40),
      new BABYLON.Vector3(40, 1, 0),
      new BABYLON.Vector3(-40, 1, 0),
    ];
  }

  spawnPowerUp(type: PowerUpType, position?: BABYLON.Vector3): PowerUp {
    const spawnPos = position || this.getRandomSpawnPoint();
    const id = `powerup_${Date.now()}_${Math.random()}`;

    // Create visual mesh
    const mesh = this.createPowerUpMesh(type, spawnPos);

    const powerUp: PowerUp = {
      id,
      type,
      position: spawnPos,
      mesh,
      active: true,
      duration: this.getPowerUpDuration(type),
      spawnTime: Date.now(),
    };

    this.powerUps.set(id, powerUp);
    return powerUp;
  }

  private createPowerUpMesh(type: PowerUpType, position: BABYLON.Vector3): BABYLON.Mesh {
    let mesh: BABYLON.Mesh;
    let color: BABYLON.Color3;

    switch (type) {
      case 'health':
        mesh = BABYLON.MeshBuilder.CreateBox('health_powerup', { size: 0.5 }, this.scene);
        color = new BABYLON.Color3(0.2, 1, 0.2); // Green
        break;
      case 'ammo':
        mesh = BABYLON.MeshBuilder.CreateCylinder('ammo_powerup', { height: 0.8, diameter: 0.4 }, this.scene);
        color = new BABYLON.Color3(1, 1, 0.2); // Yellow
        break;
      case 'speed':
        mesh = BABYLON.MeshBuilder.CreateSphere('speed_powerup', { diameter: 0.6 }, this.scene);
        color = new BABYLON.Color3(0.2, 0.8, 1); // Cyan
        break;
      case 'damage':
        mesh = BABYLON.MeshBuilder.CreateBox('damage_powerup', { size: 0.6 }, this.scene);
        color = new BABYLON.Color3(1, 0.2, 0.2); // Red
        break;
    }

    mesh.position = position;
    mesh.checkCollisions = true;

    // Create material
    const material = new BABYLON.StandardMaterial(`${type}_mat`, this.scene);
    material.emissiveColor = color;
    material.wireframe = false;
    mesh.material = material;

    // Add rotation animation
    const animation = new BABYLON.Animation(
      `${type}_rotation`,
      'rotation.y',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keys = [
      { frame: 0, value: 0 },
      { frame: 100, value: Math.PI * 2 },
    ];
    animation.setKeys(keys);
    mesh.animations.push(animation);
    this.scene.beginAnimation(mesh, 0, 100, true);

    return mesh;
  }

  private getPowerUpDuration(type: PowerUpType): number {
    switch (type) {
      case 'health':
        return 0; // Permanent
      case 'ammo':
        return 0; // Permanent
      case 'speed':
        return 10; // 10 seconds
      case 'damage':
        return 15; // 15 seconds
    }
  }

  private getRandomSpawnPoint(): BABYLON.Vector3 {
    const point = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
    // Add some randomness
    return new BABYLON.Vector3(
      point.x + (Math.random() - 0.5) * 5,
      point.y,
      point.z + (Math.random() - 0.5) * 5
    );
  }

  getPowerUpAt(position: BABYLON.Vector3, radius: number = 1): PowerUp | null {
    for (const [, powerUp] of this.powerUps) {
      if (!powerUp.active) continue;

      const distance = BABYLON.Vector3.Distance(powerUp.position, position);
      if (distance < radius) {
        return powerUp;
      }
    }
    return null;
  }

  collectPowerUp(powerUpId: string): PowerUp | null {
    const powerUp = this.powerUps.get(powerUpId);
    if (powerUp && powerUp.active) {
      powerUp.active = false;
      powerUp.mesh.dispose();
      return powerUp;
    }
    return null;
  }

  update(deltaTime: number): void {
    const now = Date.now();

    for (const [id, powerUp] of this.powerUps) {
      if (!powerUp.active) continue;

      // Check if power-up duration has expired
      if (powerUp.duration > 0) {
        const elapsedSeconds = (now - powerUp.spawnTime) / 1000;
        if (elapsedSeconds > powerUp.duration) {
          powerUp.active = false;
          powerUp.mesh.dispose();
          this.powerUps.delete(id);
        }
      }
    }
  }

  dispose(): void {
    for (const [, powerUp] of this.powerUps) {
      powerUp.mesh.dispose();
    }
    this.powerUps.clear();
  }

  getActivePowerUps(): PowerUp[] {
    return Array.from(this.powerUps.values()).filter((p) => p.active);
  }
}

// Power-up effects
export interface PowerUpEffect {
  type: PowerUpType;
  apply: (player: any) => void;
  duration: number;
}

export const powerUpEffects: Record<PowerUpType, PowerUpEffect> = {
  health: {
    type: 'health',
    apply: (player) => {
      player.stats.health = Math.min(player.stats.maxHealth, player.stats.health + 50);
    },
    duration: 0,
  },
  ammo: {
    type: 'ammo',
    apply: (player) => {
      player.stats.ammoReserve += 60;
    },
    duration: 0,
  },
  speed: {
    type: 'speed',
    apply: (player) => {
      player.stats.moveSpeed *= 2;
    },
    duration: 10,
  },
  damage: {
    type: 'damage',
    apply: (player) => {
      player.stats.damageMultiplier = 2;
    },
    duration: 15,
  },
};
