import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameStats {
  totalKills: number;
  totalDeaths: number;
  totalSurvivalTime: number; // in seconds
  gamesPlayed: number;
  highScore: number;
  bestSurvivalTime: number;
  mapsPlayed: Record<string, number>; // map name -> times played
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  sensitivity: number;
  fov: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  hapticFeedback: boolean;
  autoReload: boolean;
}

export interface HighScoreEntry {
  rank: number;
  score: number;
  kills: number;
  survivalTime: number;
  map: string;
  date: number; // timestamp
}

const STORAGE_KEYS = {
  STATS: 'game_stats',
  SETTINGS: 'game_settings',
  HIGH_SCORES: 'high_scores',
  LAST_SESSION: 'last_session',
};

const DEFAULT_STATS: GameStats = {
  totalKills: 0,
  totalDeaths: 0,
  totalSurvivalTime: 0,
  gamesPlayed: 0,
  highScore: 0,
  bestSurvivalTime: 0,
  mapsPlayed: {},
};

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 1,
  sfxVolume: 1,
  musicVolume: 0.7,
  sensitivity: 1,
  fov: 75,
  graphicsQuality: 'high',
  hapticFeedback: true,
  autoReload: true,
};

class GameStorage {
  async getStats(): Promise<GameStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : DEFAULT_STATS;
    } catch (error) {
      console.error('Error reading game stats:', error);
      return DEFAULT_STATS;
    }
  }

  async saveStats(stats: GameStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  }

  async updateStats(updates: Partial<GameStats>): Promise<GameStats> {
    const stats = await this.getStats();
    const updated = { ...stats, ...updates };
    await this.saveStats(updated);
    return updated;
  }

  async getSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading game settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving game settings:', error);
    }
  }

  async updateSettings(updates: Partial<GameSettings>): Promise<GameSettings> {
    const settings = await this.getSettings();
    const updated = { ...settings, ...updates };
    await this.saveSettings(updated);
    return updated;
  }

  async getHighScores(): Promise<HighScoreEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading high scores:', error);
      return [];
    }
  }

  async addHighScore(entry: Omit<HighScoreEntry, 'rank'>): Promise<HighScoreEntry[]> {
    try {
      const scores = await this.getHighScores();
      const newEntry: HighScoreEntry = {
        ...entry,
        rank: scores.length + 1,
      };

      // Add new score and sort
      const updated = [...scores, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100) // Keep top 100
        .map((score, index) => ({ ...score, rank: index + 1 }));

      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(updated));

      // Update stats if it's a new high score
      const stats = await this.getStats();
      if (entry.score > stats.highScore) {
        await this.updateStats({ highScore: entry.score });
      }

      return updated;
    } catch (error) {
      console.error('Error adding high score:', error);
      return [];
    }
  }

  async recordGameSession(
    kills: number,
    deaths: number,
    survivalTime: number,
    map: string
  ): Promise<GameStats> {
    try {
      const stats = await this.getStats();
      const score = kills * 100 - deaths * 50 + Math.floor(survivalTime / 10);

      // Update stats
      const updated = await this.updateStats({
        totalKills: stats.totalKills + kills,
        totalDeaths: stats.totalDeaths + deaths,
        totalSurvivalTime: stats.totalSurvivalTime + survivalTime,
        gamesPlayed: stats.gamesPlayed + 1,
        highScore: Math.max(stats.highScore, score),
        bestSurvivalTime: Math.max(stats.bestSurvivalTime, survivalTime),
        mapsPlayed: {
          ...stats.mapsPlayed,
          [map]: (stats.mapsPlayed[map] || 0) + 1,
        },
      });

      // Add to high scores
      await this.addHighScore({
        score,
        kills,
        survivalTime,
        map,
        date: Date.now(),
      });

      return updated;
    } catch (error) {
      console.error('Error recording game session:', error);
      return await this.getStats();
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  async exportData(): Promise<string> {
    try {
      const stats = await this.getStats();
      const settings = await this.getSettings();
      const highScores = await this.getHighScores();

      return JSON.stringify(
        {
          stats,
          settings,
          highScores,
          exportDate: new Date().toISOString(),
        },
        null,
        2
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);

      if (data.stats) await this.saveStats(data.stats);
      if (data.settings) await this.saveSettings(data.settings);
      if (data.highScores) {
        await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(data.highScores));
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const gameStorage = new GameStorage();
