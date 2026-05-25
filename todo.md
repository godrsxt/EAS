# Survival Shooter 3D - Project TODO

## Phase 1: Project Setup & Branding
- [x] Generate custom app logo/icon
- [x] Update app.config.ts with branding (appName, logoUrl)
- [x] Create splash screen and favicon

## Phase 2: Core Game Engine
- [x] Set up Babylon.js WebGPU engine
- [x] Create main game scene with lighting
- [x] Load and render survival island map (.glb)
- [x] Implement camera controller (desktop pointer lock + mobile joystick)
- [x] Implement player movement (WASD/joystick)
- [x] Create HUD overlay (crosshair, ammo counter, health bar)
- [x] Implement raycasting hit detection system

## Phase 3: Single Player Combat
- [x] Implement rifle weapon system
- [x] Create ammo/magazine system (30 rounds, infinite reserve)
- [x] Implement reload mechanic (2-second delay)
- [x] Create player health and damage system
- [x] Spawn 3 AI bots on map
- [x] Implement NavMesh for bot pathfinding
- [x] Implement AI behavior tree (patrol, chase, shoot, take cover)
- [x] Create bot health and death system
- [x] Implement game over detection (player dies or all bots defeated)

## Phase 4: Multiplayer (WebRTC)
- [x] Implement WebRTC RTCDataChannel setup
- [x] Create QR code generation for connection offer
- [x] Implement QR code scanning for connection answer
- [x] Create handshake screen UI
- [x] Implement 60Hz position/rotation sync over WebRTC
- [x] Implement shooting state synchronization
- [x] Handle connection loss and reconnection
- [x] Create multiplayer game over detection

## Phase 5: PWA & Offline Support
- [x] Create Service Worker (sw.js)
- [x] Implement Cache API for offline asset caching
- [x] Create PWA manifest.json
- [x] Test offline functionality
- [x] Implement IndexedDB for local high scores

## Phase 6: Audio & Polish
- [x] Add gun fire sound effects
- [x] Add reload sound effect
- [x] Add footstep audio
- [x] Add background music
- [x] Implement audio toggle in settings
- [x] Add haptic feedback for mobile (shoot, hit, reload)
- [x] Create settings menu (audio, graphics, sensitivity, FOV)
- [x] Implement graphics quality settings

## Phase 7: Mobile UI & Controls
- [x] Create main menu screen
- [x] Create game mode selection screen
- [x] Create settings screen
- [x] Implement virtual joysticks (left: move, right: look)
- [x] Implement touch buttons (shoot, reload)
- [x] Create game over screen with stats
- [x] Optimize UI for landscape orientation
- [x] Test on mobile devices

## Phase 8: Build & Export
- [x] Install Capacitor for native app packaging
- [x] Configure Capacitor for Android
- [x] Build APK file
- [x] Test APK on Android device
- [x] Generate release APK (signed)
- [x] Create project documentation

## Known Constraints
- WebGPU requires modern browsers (Chrome 113+, Edge 113+, Safari 18+)
- WebGL fallback available for older devices
- WebRTC requires local Wi-Fi network for multiplayer
- Service Worker requires HTTPS or localhost
- APK build requires Android SDK setup

## Phase 9: Real Permission System (NEW)
- [x] Implement permission request modal at app startup
- [x] Request CAMERA permission for QR scanning
- [x] Request MICROPHONE permission for audio
- [x] Request STORAGE permission for game data
- [x] Request NETWORK permission for Wi-Fi multiplayer
- [x] Create permission status UI
- [x] Handle permission denials gracefully
- [x] Add permission re-request flow

## Phase 10: Working QR Code Scanning (NEW)
- [x] Integrate expo-camera library with camera
- [x] Create real-time QR scanner component
- [x] Parse QR data to extract connection offer
- [x] Implement scanner UI with torch toggle
- [x] Add QR code generation with actual connection data
- [x] Test QR scanning on real devices
- [x] Handle scanner errors and timeouts

## Phase 11: Real Multiplayer Setup (NEW)
- [ ] Detect local Wi-Fi network info
- [ ] Display network status in multiplayer screen
- [ ] Implement actual WebRTC STUN/TURN server setup
- [ ] Create connection state machine
- [ ] Add connection timeout handling
- [ ] Implement peer discovery mechanism
- [ ] Test on multiple devices

## Phase 12: Complete Audio System (NEW)
- [x] Add gunfire sound effects (rifle, shotgun, sniper)
- [x] Add reload sound with variations
- [x] Add footstep sounds (walking, running, jumping)
- [x] Add bot death/hit sounds
- [x] Add ambient background music
- [x] Add UI click sounds
- [x] Implement audio manager with volume control
- [x] Add audio toggle in settings

## Phase 13: Power-ups & Special Weapons (NEW)
- [x] Create health pack power-up (restore 50 HP)
- [x] Create ammo box power-up (restore 60 rounds)
- [x] Create speed boost power-up (2x movement speed)
- [x] Implement shotgun weapon (8 pellets, 15 damage each)
- [x] Implement sniper rifle (1 shot, 100 damage, slow fire)
- [x] Create item spawning system
- [x] Add power-up visual indicators
- [x] Implement weapon switching UI

## Phase 14: Multiple Maps/Environments (NEW)
- [x] Create desert island map with sand dunes
- [x] Create forest map with trees and vegetation
- [x] Create urban map with buildings and streets
- [x] Create underground bunker map
- [x] Implement map selection screen
- [x] Add unique bot spawn patterns per map
- [x] Add environmental hazards (lava, water, etc.)
- [x] Optimize performance per map

## Phase 15: Persistent Data Storage (NEW)
- [x] Implement high scores database (AsyncStorage)
- [x] Save player stats (kills, deaths, survival time)
- [x] Save game settings (volume, sensitivity, graphics)
- [x] Create leaderboard screen
- [x] Add stats display in menu
- [x] Implement data export/import
- [x] Add cloud sync option (optional)

## Phase 16: Production Polish (NEW)
- [ ] Add loading screens with progress bars
- [ ] Implement pause menu with resume/quit
- [ ] Add tutorial/onboarding flow
- [ ] Create achievement system
- [ ] Add visual effects (blood, explosions, particles)
- [ ] Optimize performance for low-end devices
- [ ] Add accessibility features
- [ ] Final testing and bug fixes
