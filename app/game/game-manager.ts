import * as BABYLON from 'babylonjs';
import { GameEngine } from './engine';
import { Player } from './player';
import { Bot } from './bot';
import { HUD } from './hud';

export type GameMode = 'single' | 'multiplayer';

export interface GameStats {
  playerKills: number;
  playerDeaths: number;
  survivalTime: number;
  botsDefeated: number;
}

export class GameManager {
  private engine: GameEngine;
  private player: Player | null = null;
  private bots: Map<string, Bot> = new Map();
  private hud: HUD | null = null;
  private hudCanvas: HTMLCanvasElement | null = null;
  private gameMode: GameMode;
  private gameState: 'menu' | 'playing' | 'paused' | 'gameover' = 'menu';
  private gameStats: GameStats = {
    playerKills: 0,
    playerDeaths: 0,
    survivalTime: 0,
    botsDefeated: 0,
  };
  private startTime = 0;
  private lastUpdateTime = 0;
  private renderLoopId: number | null = null;

  constructor(canvasId: string, gameMode: GameMode = 'single') {
    this.gameMode = gameMode;
    this.engine = new GameEngine({
      canvasId,
      width: window.innerWidth,
      height: window.innerHeight,
      mode: gameMode,
    });
  }

  public async initialize(): Promise<void> {
    await this.engine.initialize();

    const scene = this.engine.getScene();
    const camera = this.engine.getCamera();
    const babylonEngine = this.engine.getEngine();

    if (!scene || !camera || !babylonEngine) {
      throw new Error('Failed to initialize game engine');
    }

    // Create player
    this.player = new Player(camera, scene, babylonEngine);

    // Setup HUD
    this.setupHUD();

    // Create bots for single player
    if (this.gameMode === 'single') {
      this.createBots(3);
    }

    // Setup game loop
    this.setupGameLoop();

    this.gameState = 'playing';
    this.startTime = Date.now();
    this.lastUpdateTime = this.startTime;
  }

  private setupHUD(): void {
    // Create HUD canvas overlay
    const canvas = document.createElement('canvas');
    canvas.id = 'hud-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '100';

    document.body.appendChild(canvas);
    this.hudCanvas = canvas;
    this.hud = new HUD(canvas);

    window.addEventListener('resize', () => {
      if (this.hudCanvas) {
        this.hudCanvas.width = window.innerWidth;
        this.hudCanvas.height = window.innerHeight;
      }
    });
  }

  private createBots(count: number): void {
    const scene = this.engine.getScene();
    if (!scene) return;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const distance = 30;
      const position = new BABYLON.Vector3(
        Math.cos(angle) * distance,
        1,
        Math.sin(angle) * distance
      );

      const bot = new Bot(`bot_${i}`, position, scene);
      this.bots.set(`bot_${i}`, bot);
    }
  }

  private setupGameLoop(): void {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - this.lastUpdateTime;
      this.lastUpdateTime = now;

      this.update(deltaTime);
      this.render();

      this.renderLoopId = requestAnimationFrame(gameLoop);
    };

    this.renderLoopId = requestAnimationFrame(gameLoop);
  }

  private update(deltaTime: number): void {
    if (this.gameState !== 'playing' || !this.player) return;

    // Update player
    this.player.update(deltaTime);

    // Update bots
    const playerPos = this.player.getPosition();
    for (const bot of this.bots.values()) {
      bot.update(deltaTime, playerPos);
    }

    // Check collisions and hits
    this.checkCollisions();

    // Update game stats
    this.gameStats.survivalTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Check win/lose conditions
    this.checkGameOver();
  }

  private checkCollisions(): void {
    if (!this.player) return;

    const playerPos = this.player.getPosition();

    // Check if player is hit by bot
    for (const bot of this.bots.values()) {
      if (bot.getState().isDead) continue;

      const botPos = bot.getState().position;
      const distance = BABYLON.Vector3.Distance(playerPos, botPos);

      // Simple collision detection
      if (distance < 5) {
        // Bot shoots at player
        this.player.takeDamage(10);
      }
    }
  }

  private checkGameOver(): void {
    if (!this.player) return;

    const playerStats = this.player.getStats();

    // Check if player is dead
    if (playerStats.health <= 0) {
      this.endGame(false);
      return;
    }

    // Check if all bots are defeated
    let allBotsDead = true;
    for (const bot of this.bots.values()) {
      if (!bot.getState().isDead) {
        allBotsDead = false;
        break;
      }
    }

    if (allBotsDead && this.bots.size > 0) {
      this.endGame(true);
    }
  }

  private render(): void {
    if (!this.player || !this.hud) return;

    // Update HUD
    this.hud.setPlayerStats(this.player.getStats());

    // Update enemy health bars
    for (const [id, bot] of this.bots) {
      this.hud.setEnemyHealth(id, bot.getState().health);
    }

    // Render HUD
    this.hud.render();
  }

  private endGame(won: boolean): void {
    this.gameState = 'gameover';

    if (this.renderLoopId !== null) {
      cancelAnimationFrame(this.renderLoopId);
    }

    // Show game over screen
    this.showGameOverScreen(won);
  }

  private showGameOverScreen(won: boolean): void {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const title = document.createElement('h1');
    title.textContent = won ? 'VICTORY!' : 'DEFEAT!';
    title.style.color = won ? '#22c55e' : '#ef4444';
    title.style.fontSize = '48px';
    title.style.marginBottom = '30px';

    const stats = document.createElement('div');
    stats.style.color = '#ffffff';
    stats.style.fontSize = '24px';
    stats.style.marginBottom = '30px';
    stats.innerHTML = `
      <p>Survival Time: ${this.gameStats.survivalTime}s</p>
      <p>Bots Defeated: ${this.gameStats.botsDefeated}</p>
      <p>Your Health: ${this.player?.getStats().health || 0} HP</p>
    `;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '20px';

    const playAgainBtn = document.createElement('button');
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.style.padding = '10px 30px';
    playAgainBtn.style.fontSize = '18px';
    playAgainBtn.style.backgroundColor = '#0a7ea4';
    playAgainBtn.style.color = '#ffffff';
    playAgainBtn.style.border = 'none';
    playAgainBtn.style.borderRadius = '5px';
    playAgainBtn.style.cursor = 'pointer';
    playAgainBtn.onclick = () => {
      window.location.reload();
    };

    const menuBtn = document.createElement('button');
    menuBtn.textContent = 'Main Menu';
    menuBtn.style.padding = '10px 30px';
    menuBtn.style.fontSize = '18px';
    menuBtn.style.backgroundColor = '#666666';
    menuBtn.style.color = '#ffffff';
    menuBtn.style.border = 'none';
    menuBtn.style.borderRadius = '5px';
    menuBtn.style.cursor = 'pointer';
    menuBtn.onclick = () => {
      window.location.href = '/';
    };

    buttonContainer.appendChild(playAgainBtn);
    buttonContainer.appendChild(menuBtn);

    overlay.appendChild(title);
    overlay.appendChild(stats);
    overlay.appendChild(buttonContainer);
    document.body.appendChild(overlay);
  }

  public dispose(): void {
    if (this.renderLoopId !== null) {
      cancelAnimationFrame(this.renderLoopId);
    }

    this.player?.dispose();
    for (const bot of this.bots.values()) {
      bot.dispose();
    }
    this.hud?.dispose();
    this.engine.dispose();

    if (this.hudCanvas) {
      this.hudCanvas.remove();
    }
  }

  public getGameState(): string {
    return this.gameState;
  }

  public getGameStats(): GameStats {
    return this.gameStats;
  }
}
