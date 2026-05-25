import { PlayerStats } from './player';

export class HUD {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private playerStats: PlayerStats | null = null;
  private enemyHealthBars: Map<string, number> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public setPlayerStats(stats: PlayerStats): void {
    this.playerStats = stats;
  }

  public setEnemyHealth(enemyId: string, health: number): void {
    this.enemyHealthBars.set(enemyId, health);
  }

  public render(): void {
    // Clear previous frame
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw crosshair
    this.drawCrosshair();

    // Draw ammo counter
    this.drawAmmoCounter();

    // Draw player health bar
    this.drawPlayerHealthBar();

    // Draw enemy health bars
    this.drawEnemyHealthBars();

    // Draw FPS (debug)
    this.drawDebugInfo();
  }

  private drawCrosshair(): void {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const size = 20;
    const thickness = 2;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.lineWidth = thickness;

    // Horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - size, centerY);
    this.ctx.lineTo(centerX - size / 2, centerY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(centerX + size / 2, centerY);
    this.ctx.lineTo(centerX + size, centerY);
    this.ctx.stroke();

    // Vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - size);
    this.ctx.lineTo(centerX, centerY - size / 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY + size / 2);
    this.ctx.lineTo(centerX, centerY + size);
    this.ctx.stroke();

    // Center dot
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawAmmoCounter(): void {
    if (!this.playerStats) return;

    const x = this.width - 150;
    const y = this.height - 50;
    const fontSize = 24;

    this.ctx.font = `bold ${fontSize}px Arial`;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.textAlign = 'right';

    const ammoText = `${this.playerStats.ammo}/${this.playerStats.reserve}`;
    this.ctx.fillText(ammoText, x, y);

    // Reload indicator
    if (this.playerStats.isReloading) {
      this.ctx.font = `bold 16px Arial`;
      this.ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
      this.ctx.fillText('RELOADING...', x, y + 30);
    }
  }

  private drawPlayerHealthBar(): void {
    if (!this.playerStats) return;

    const x = 20;
    const y = this.height - 50;
    const width = 200;
    const height = 30;
    const healthPercent = this.playerStats.health / this.playerStats.maxHealth;

    // Background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(x, y, width, height);

    // Health bar color based on health
    let healthColor = 'rgba(34, 197, 94, 0.9)'; // Green
    if (healthPercent < 0.5) {
      healthColor = 'rgba(245, 158, 11, 0.9)'; // Amber
    }
    if (healthPercent < 0.25) {
      healthColor = 'rgba(239, 68, 68, 0.9)'; // Red
    }

    this.ctx.fillStyle = healthColor;
    this.ctx.fillRect(x + 2, y + 2, (width - 4) * healthPercent, height - 4);

    // Border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Health text
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${Math.ceil(this.playerStats.health)} HP`, x + width / 2, y + 20);
  }

  private drawEnemyHealthBars(): void {
    let index = 0;
    for (const [enemyId, health] of this.enemyHealthBars) {
      const x = 20;
      const y = 20 + index * 40;
      const width = 150;
      const height = 25;
      const healthPercent = Math.max(0, health / 100);

      // Background
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(x, y, width, height);

      // Health bar
      this.ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      this.ctx.fillRect(x + 2, y + 2, (width - 4) * healthPercent, height - 4);

      // Border
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, width, height);

      // Enemy label
      this.ctx.font = 'bold 12px Arial';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(`Enemy ${index + 1}`, x + 5, y + 16);

      index++;
    }
  }

  private drawDebugInfo(): void {
    const fps = Math.round(1000 / 16.67); // Approximate
    const x = 20;
    const y = 20;

    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillStyle = 'rgba(100, 200, 100, 0.8)';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`FPS: ${fps}`, x, y);
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  public dispose(): void {
    this.clear();
  }
}
