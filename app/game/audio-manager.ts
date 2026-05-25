import { Platform } from 'react-native';

export type SoundEffect = 'rifle_fire' | 'shotgun_fire' | 'sniper_fire' | 'reload' | 'footstep' | 'bot_death' | 'bot_hit' | 'powerup' | 'ui_click';
export type MusicTrack = 'menu' | 'gameplay' | 'victory' | 'defeat';

// Simple audio manager using Web Audio API for web and native audio for mobile
class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 1.0;
  private sfxVolume: number = 1.0;
  private musicVolume: number = 0.7;
  private currentMusic: MusicTrack | null = null;
  private initialized: boolean = false;
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  // Sound effect URLs (using free sound effects from web)
  private soundUrls: Record<SoundEffect, string> = {
    rifle_fire: 'https://assets.mixkit.co/active_storage/sfx/2457/2457-preview.mp3',
    shotgun_fire: 'https://assets.mixkit.co/active_storage/sfx/2458/2458-preview.mp3',
    sniper_fire: 'https://assets.mixkit.co/active_storage/sfx/2459/2459-preview.mp3',
    reload: 'https://assets.mixkit.co/active_storage/sfx/2460/2460-preview.mp3',
    footstep: 'https://assets.mixkit.co/active_storage/sfx/2461/2461-preview.mp3',
    bot_death: 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3',
    bot_hit: 'https://assets.mixkit.co/active_storage/sfx/2463/2463-preview.mp3',
    powerup: 'https://assets.mixkit.co/active_storage/sfx/2464/2464-preview.mp3',
    ui_click: 'https://assets.mixkit.co/active_storage/sfx/2465/2465-preview.mp3',
  };

  private musicUrls: Record<MusicTrack, string> = {
    menu: 'https://assets.mixkit.co/active_storage/music/2465/2465-preview.mp3',
    gameplay: 'https://assets.mixkit.co/active_storage/music/2466/2466-preview.mp3',
    victory: 'https://assets.mixkit.co/active_storage/music/2467/2467-preview.mp3',
    defeat: 'https://assets.mixkit.co/active_storage/music/2468/2468-preview.mp3',
  };

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      if (Platform.OS === 'web') {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  async loadSoundEffect(effect: SoundEffect): Promise<void> {
    if (this.audioElements.has(effect)) return;

    try {
      if (Platform.OS === 'web') {
        const audio = new Audio(this.soundUrls[effect]);
        audio.preload = 'auto';
        audio.volume = this.sfxVolume * this.masterVolume;
        this.audioElements.set(effect, audio);
      }
    } catch (error) {
      console.error(`Error loading sound effect ${effect}:`, error);
    }
  }

  async loadMusicTrack(track: MusicTrack): Promise<void> {
    if (this.audioElements.has(track)) return;

    try {
      if (Platform.OS === 'web') {
        const audio = new Audio(this.musicUrls[track]);
        audio.preload = 'auto';
        audio.loop = true;
        audio.volume = this.musicVolume * this.masterVolume;
        this.audioElements.set(track, audio);
      }
    } catch (error) {
      console.error(`Error loading music track ${track}:`, error);
    }
  }

  async playSoundEffect(effect: SoundEffect, volume?: number): Promise<void> {
    try {
      await this.loadSoundEffect(effect);
      const audio = this.audioElements.get(effect);
      if (audio && Platform.OS === 'web') {
        audio.volume = (volume || this.sfxVolume) * this.masterVolume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Autoplay policy may prevent playback
          console.warn(`Could not play sound effect ${effect}`);
        });
      }
    } catch (error) {
      console.error(`Error playing sound effect ${effect}:`, error);
    }
  }

  async playMusic(track: MusicTrack, fadeIn: boolean = true): Promise<void> {
    try {
      // Stop current music
      if (this.currentMusic && this.currentMusic !== track) {
        const currentAudio = this.audioElements.get(this.currentMusic);
        if (currentAudio && Platform.OS === 'web') {
          if (fadeIn) {
            await this.fadeOutAudio(currentAudio, 500);
          }
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Load and play new music
      await this.loadMusicTrack(track);
      const audio = this.audioElements.get(track);
      if (audio && Platform.OS === 'web') {
        if (fadeIn) {
          audio.volume = 0;
          audio.play().catch(() => {
            console.warn(`Could not play music track ${track}`);
          });
          await this.fadeInAudio(audio, 500);
        } else {
          audio.play().catch(() => {
            console.warn(`Could not play music track ${track}`);
          });
        }
        this.currentMusic = track;
      }
    } catch (error) {
      console.error(`Error playing music track ${track}:`, error);
    }
  }

  async stopMusic(): Promise<void> {
    if (this.currentMusic && Platform.OS === 'web') {
      const audio = this.audioElements.get(this.currentMusic);
      if (audio) {
        await this.fadeOutAudio(audio, 500);
        audio.pause();
        audio.currentTime = 0;
      }
      this.currentMusic = null;
    }
  }

  private async fadeInAudio(audio: HTMLAudioElement, duration: number): Promise<void> {
    const steps = 20;
    const interval = duration / steps;
    const targetVolume = this.musicVolume * this.masterVolume;
    const volumeStep = targetVolume / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      audio.volume = (i + 1) * volumeStep;
    }
  }

  private async fadeOutAudio(audio: HTMLAudioElement, duration: number): Promise<void> {
    const steps = 20;
    const interval = duration / steps;
    const currentVolume = audio.volume;
    const volumeStep = currentVolume / steps;

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, interval));
      audio.volume = Math.max(0, currentVolume - (i + 1) * volumeStep);
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  private updateAllVolumes(): void {
    // Update all audio elements
    this.audioElements.forEach((audio) => {
      if (audio.dataset.type === 'sfx') {
        audio.volume = this.sfxVolume * this.masterVolume;
      } else {
        audio.volume = this.musicVolume * this.masterVolume;
      }
    });
  }

  async dispose(): Promise<void> {
    try {
      // Stop and unload all audio
      for (const [, audio] of this.audioElements) {
        audio.pause();
        audio.src = '';
      }
      this.audioElements.clear();

      this.currentMusic = null;
      this.initialized = false;

      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
    } catch (error) {
      console.error('Error disposing audio:', error);
    }
  }
}

export const audioManager = new AudioManager();
