import * as BABYLON from 'babylonjs';

export type MapType = 'island' | 'desert' | 'forest' | 'urban' | 'bunker';

export interface MapConfig {
  name: string;
  description: string;
  groundSize: number;
  groundColor: BABYLON.Color3;
  skyColor: BABYLON.Color3;
  lightIntensity: number;
  ambientIntensity: number;
  obstacles: ObstacleConfig[];
  botSpawnPoints: BABYLON.Vector3[];
  playerSpawnPoint: BABYLON.Vector3;
  powerUpSpawnPoints: BABYLON.Vector3[];
}

interface ObstacleConfig {
  type: 'box' | 'sphere' | 'cylinder';
  position: BABYLON.Vector3;
  size: number | { width: number; height: number; depth: number };
  color: BABYLON.Color3;
}

export const mapConfigs: Record<MapType, MapConfig> = {
  island: {
    name: 'Survival Island',
    description: 'A tropical island with scattered rocks',
    groundSize: 200,
    groundColor: new BABYLON.Color3(0.8, 0.7, 0.5),
    skyColor: new BABYLON.Color3(0.5, 0.8, 1),
    lightIntensity: 1.2,
    ambientIntensity: 0.6,
    obstacles: [
      { type: 'box', position: new BABYLON.Vector3(20, 2.5, 20), size: 5, color: new BABYLON.Color3(0.6, 0.5, 0.4) },
      { type: 'box', position: new BABYLON.Vector3(-30, 1.5, 30), size: 3, color: new BABYLON.Color3(0.7, 0.6, 0.5) },
      { type: 'sphere', position: new BABYLON.Vector3(40, 1.5, 10), size: 4, color: new BABYLON.Color3(0.5, 0.5, 0.5) },
      { type: 'box', position: new BABYLON.Vector3(-20, 2, -40), size: 6, color: new BABYLON.Color3(0.65, 0.55, 0.45) },
    ],
    botSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
    ],
    playerSpawnPoint: new BABYLON.Vector3(0, 1, 0),
    powerUpSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
      new BABYLON.Vector3(-30, 1, -30),
    ],
  },
  desert: {
    name: 'Desert Wasteland',
    description: 'A vast desert with sand dunes and rock formations',
    groundSize: 250,
    groundColor: new BABYLON.Color3(1, 0.9, 0.6),
    skyColor: new BABYLON.Color3(1, 0.9, 0.7),
    lightIntensity: 1.5,
    ambientIntensity: 0.8,
    obstacles: [
      { type: 'box', position: new BABYLON.Vector3(50, 3, 50), size: 8, color: new BABYLON.Color3(0.8, 0.7, 0.5) },
      { type: 'sphere', position: new BABYLON.Vector3(-50, 2, 50), size: 6, color: new BABYLON.Color3(0.7, 0.6, 0.4) },
      { type: 'cylinder', position: new BABYLON.Vector3(50, 2, -50), size: 5, color: new BABYLON.Color3(0.75, 0.65, 0.45) },
      { type: 'box', position: new BABYLON.Vector3(-50, 2.5, -50), size: 7, color: new BABYLON.Color3(0.8, 0.7, 0.5) },
      { type: 'sphere', position: new BABYLON.Vector3(0, 1.5, 60), size: 4, color: new BABYLON.Color3(0.7, 0.6, 0.4) },
    ],
    botSpawnPoints: [
      new BABYLON.Vector3(50, 1, 50),
      new BABYLON.Vector3(-50, 1, 50),
      new BABYLON.Vector3(50, 1, -50),
    ],
    playerSpawnPoint: new BABYLON.Vector3(0, 1, 0),
    powerUpSpawnPoints: [
      new BABYLON.Vector3(50, 1, 50),
      new BABYLON.Vector3(-50, 1, 50),
      new BABYLON.Vector3(50, 1, -50),
      new BABYLON.Vector3(-50, 1, -50),
      new BABYLON.Vector3(0, 1, 60),
    ],
  },
  forest: {
    name: 'Dark Forest',
    description: 'A dense forest with trees and vegetation',
    groundSize: 200,
    groundColor: new BABYLON.Color3(0.3, 0.5, 0.2),
    skyColor: new BABYLON.Color3(0.4, 0.6, 0.3),
    lightIntensity: 0.8,
    ambientIntensity: 0.4,
    obstacles: [
      { type: 'cylinder', position: new BABYLON.Vector3(20, 3, 20), size: 2, color: new BABYLON.Color3(0.4, 0.3, 0.1) },
      { type: 'cylinder', position: new BABYLON.Vector3(-20, 3, 20), size: 2, color: new BABYLON.Color3(0.4, 0.3, 0.1) },
      { type: 'cylinder', position: new BABYLON.Vector3(20, 3, -20), size: 2, color: new BABYLON.Color3(0.4, 0.3, 0.1) },
      { type: 'cylinder', position: new BABYLON.Vector3(-20, 3, -20), size: 2, color: new BABYLON.Color3(0.4, 0.3, 0.1) },
      { type: 'box', position: new BABYLON.Vector3(0, 2, 40), size: 4, color: new BABYLON.Color3(0.5, 0.4, 0.2) },
    ],
    botSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
    ],
    playerSpawnPoint: new BABYLON.Vector3(0, 1, 0),
    powerUpSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
      new BABYLON.Vector3(-30, 1, -30),
    ],
  },
  urban: {
    name: 'Urban Ruins',
    description: 'An abandoned city with buildings and streets',
    groundSize: 200,
    groundColor: new BABYLON.Color3(0.5, 0.5, 0.5),
    skyColor: new BABYLON.Color3(0.6, 0.6, 0.7),
    lightIntensity: 1,
    ambientIntensity: 0.5,
    obstacles: [
      { type: 'box', position: new BABYLON.Vector3(30, 3, 30), size: { width: 10, height: 6, depth: 10 }, color: new BABYLON.Color3(0.6, 0.6, 0.6) },
      { type: 'box', position: new BABYLON.Vector3(-30, 3, 30), size: { width: 8, height: 5, depth: 8 }, color: new BABYLON.Color3(0.55, 0.55, 0.55) },
      { type: 'box', position: new BABYLON.Vector3(30, 2.5, -30), size: { width: 6, height: 5, depth: 6 }, color: new BABYLON.Color3(0.6, 0.6, 0.6) },
      { type: 'box', position: new BABYLON.Vector3(-30, 3.5, -30), size: { width: 12, height: 7, depth: 10 }, color: new BABYLON.Color3(0.55, 0.55, 0.55) },
    ],
    botSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
    ],
    playerSpawnPoint: new BABYLON.Vector3(0, 1, 0),
    powerUpSpawnPoints: [
      new BABYLON.Vector3(30, 1, 30),
      new BABYLON.Vector3(-30, 1, 30),
      new BABYLON.Vector3(30, 1, -30),
      new BABYLON.Vector3(-30, 1, -30),
    ],
  },
  bunker: {
    name: 'Underground Bunker',
    description: 'A deep underground military bunker',
    groundSize: 150,
    groundColor: new BABYLON.Color3(0.3, 0.3, 0.3),
    skyColor: new BABYLON.Color3(0.2, 0.2, 0.2),
    lightIntensity: 0.6,
    ambientIntensity: 0.3,
    obstacles: [
      { type: 'box', position: new BABYLON.Vector3(20, 2, 20), size: 4, color: new BABYLON.Color3(0.4, 0.4, 0.4) },
      { type: 'box', position: new BABYLON.Vector3(-20, 2, 20), size: 4, color: new BABYLON.Color3(0.4, 0.4, 0.4) },
      { type: 'box', position: new BABYLON.Vector3(20, 2, -20), size: 4, color: new BABYLON.Color3(0.4, 0.4, 0.4) },
      { type: 'box', position: new BABYLON.Vector3(-20, 2, -20), size: 4, color: new BABYLON.Color3(0.4, 0.4, 0.4) },
      { type: 'cylinder', position: new BABYLON.Vector3(0, 2, 30), size: 3, color: new BABYLON.Color3(0.35, 0.35, 0.35) },
    ],
    botSpawnPoints: [
      new BABYLON.Vector3(25, 1, 25),
      new BABYLON.Vector3(-25, 1, 25),
      new BABYLON.Vector3(25, 1, -25),
    ],
    playerSpawnPoint: new BABYLON.Vector3(0, 1, 0),
    powerUpSpawnPoints: [
      new BABYLON.Vector3(25, 1, 25),
      new BABYLON.Vector3(-25, 1, 25),
      new BABYLON.Vector3(25, 1, -25),
      new BABYLON.Vector3(-25, 1, -25),
    ],
  },
};

export class MapManager {
  private currentMap: MapType = 'island';
  private scene: BABYLON.Scene;
  private obstacles: BABYLON.Mesh[] = [];

  constructor(scene: BABYLON.Scene) {
    this.scene = scene;
  }

  loadMap(mapType: MapType): MapConfig {
    // Dispose old obstacles
    this.obstacles.forEach((mesh) => mesh.dispose());
    this.obstacles = [];

    this.currentMap = mapType;
    const config = mapConfigs[mapType];

    // Update lighting
    const lights = this.scene.lights;
    lights.forEach((light) => {
      if (light instanceof BABYLON.HemisphericLight) {
        light.intensity = config.lightIntensity;
      }
    });

    // Create obstacles
    config.obstacles.forEach((obs) => {
      let mesh: BABYLON.Mesh;

      if (obs.type === 'box') {
        if (typeof obs.size === 'number') {
          mesh = BABYLON.MeshBuilder.CreateBox('obstacle', { size: obs.size }, this.scene);
        } else {
          mesh = BABYLON.MeshBuilder.CreateBox('obstacle', obs.size, this.scene);
        }
      } else if (obs.type === 'sphere') {
        mesh = BABYLON.MeshBuilder.CreateSphere('obstacle', { diameter: obs.size as number }, this.scene);
      } else {
        mesh = BABYLON.MeshBuilder.CreateCylinder('obstacle', { diameter: obs.size as number, height: 4 }, this.scene);
      }

      mesh.position = obs.position;
      mesh.checkCollisions = true;

      const material = new BABYLON.StandardMaterial(`obs_mat_${Math.random()}`, this.scene);
      material.emissiveColor = obs.color;
      mesh.material = material;

      this.obstacles.push(mesh);
    });

    return config;
  }

  getCurrentMap(): MapType {
    return this.currentMap;
  }

  getCurrentMapConfig(): MapConfig {
    return mapConfigs[this.currentMap];
  }

  getAvailableMaps(): Array<{ type: MapType; name: string; description: string }> {
    return Object.entries(mapConfigs).map(([type, config]) => ({
      type: type as MapType,
      name: config.name,
      description: config.description,
    }));
  }
}
