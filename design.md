# Survival Shooter 3D - Mobile Game Design

## Overview
A 3D offline/local-multiplayer survival shooter game built with Babylon.js and WebGPU, optimized for Android landscape orientation with one-handed gameplay on mobile devices.

## Screen List

### 1. Main Menu Screen
- **Purpose**: Game mode selection and settings
- **Content**: 
  - Game title with logo
  - "Single Player" button (AI survival mode)
  - "Local Multiplayer" button (1v1 PvP over Wi-Fi)
  - "Settings" button (audio/graphics options)
  - "Exit" button
- **Layout**: Centered vertically, full-width buttons, landscape-optimized

### 2. Single Player Game Screen
- **Purpose**: Main gameplay for survival mode
- **Content**:
  - 3D WebGPU canvas (full screen)
  - HUD overlay with:
    - Crosshair (center screen)
    - Ammo counter (magazine/reserve)
    - Health bar (player)
    - Enemy count/status
    - Minimap (optional)
    - FPS counter (debug mode)
  - Virtual joysticks (mobile):
    - Left joystick: Movement (WASD equivalent)
    - Right joystick: Camera look/aim
  - Action buttons:
    - Shoot (left trigger area)
    - Reload (right side)
- **Controls**:
  - Desktop: Mouse (pointer lock), WASD, Left-click shoot, R reload
  - Mobile: Dual joysticks + touch buttons

### 3. Multiplayer Handshake Screen
- **Purpose**: Establish P2P connection via QR code
- **Content**:
  - "Host" button: Generate QR code for connection offer
  - "Join" button: Scan opponent's QR code
  - QR code display area (when hosting)
  - Camera preview (when joining/scanning)
  - Connection status indicator
  - "Cancel" button to return to menu
- **Layout**: Full-screen camera or QR display with buttons at bottom

### 4. Multiplayer Game Screen
- **Purpose**: 1v1 PvP gameplay
- **Content**:
  - 3D WebGPU canvas (full screen)
  - HUD overlay with:
    - Crosshair
    - Player 1 health bar (top-left)
    - Player 2 health bar (top-right)
    - Ammo counter
    - Connection status indicator
    - Minimap showing both players
  - Virtual joysticks and action buttons (same as single player)
- **Synchronization**: 60Hz position/rotation/shooting state sync over WebRTC

### 5. Game Over Screen
- **Purpose**: Display results and allow replay/menu return
- **Content**:
  - "Victory" or "Defeat" message
  - Final stats (kills, accuracy, survival time)
  - "Play Again" button
  - "Main Menu" button
  - "Exit" button

### 6. Settings Screen
- **Purpose**: Adjust game preferences
- **Content**:
  - Audio toggle (on/off)
  - Graphics quality (Low/Medium/High)
  - Sensitivity slider (camera look speed)
  - FOV slider (field of view)
  - "Back" button
- **Layout**: Vertical list of toggles and sliders

## Primary Content and Functionality

### Environment
- **Survival Island Map**: Low-poly 3D terrain with trees, rocks, water
- **Lighting**: Single directional light with pre-baked shadows (WebGPU optimized)
- **Rendering**: WebGPU engine with PBR materials

### Player Mechanics
- **Movement**: WASD (desktop) or left joystick (mobile) for 8-directional movement
- **Camera Control**: Mouse look (desktop) or right joystick (mobile)
- **Shooting**: Raycasting from screen center, instant hit detection
- **Ammo System**: 30-round magazine, infinite reserve, manual reload (R key or button)
- **Health**: 100 HP, damaged by enemy fire, regenerates slowly when not in combat
- **Animation**: Idle, walk, run, reload, shoot animations

### Combat System
- **Weapon**: Single rifle with infinite ammo (magazine limited)
- **Damage**: 25 HP per hit, headshots deal 50 HP
- **Reload Time**: 2 seconds
- **Fire Rate**: 10 rounds per second (0.1s between shots)
- **Accuracy**: Perfect accuracy (no spread)

### AI Bots (Single Player)
- **Count**: 3 enemy bots
- **Behavior**: 
  - Patrol using NavMesh
  - Chase player when detected (within 50m)
  - Shoot at player with 70% accuracy
  - Take cover behind obstacles
  - Respawn after 5 seconds when defeated
- **Difficulty**: Medium (adjustable via settings)

### Multiplayer (1v1 PvP)
- **Connection**: WebRTC RTCDataChannel over local Wi-Fi
- **Handshake**: QR code-based SDP exchange
- **Sync Rate**: 60 Hz (16ms intervals)
- **Latency**: <50ms typical on local Wi-Fi
- **Data Synced**: Position [x,y,z], rotation [yaw,pitch], shooting state, health

## Key User Flows

### Single Player Flow
1. User taps "Single Player" on main menu
2. Game loads island map, spawns 3 AI bots
3. Player spawns at center with rifle (30 rounds)
4. User explores island, finds enemies, engages in combat
5. Enemies patrol and attack
6. Player defeats all bots or dies
7. Game over screen shows results
8. User can "Play Again" or return to "Main Menu"

### Multiplayer Setup Flow
1. User taps "Local Multiplayer" on main menu
2. Multiplayer handshake screen appears
3. **Player 1 (Host)**:
   - Taps "Host"
   - Browser generates WebRTC offer SDP
   - Offer is compressed and displayed as QR code
   - Waits for Player 2 to scan
4. **Player 2 (Client)**:
   - Taps "Join"
   - Camera opens, scans Player 1's QR code
   - Processes offer SDP, generates answer SDP
   - Answer is compressed and displayed as QR code
5. **Player 1 (Host)**:
   - Scans Player 2's QR code
   - Processes answer SDP
   - RTCDataChannel establishes connection
6. **Both Players**:
   - Game loads island map
   - Both players spawn at opposite ends
   - 1v1 combat begins
   - Positions/rotations/shooting synced at 60Hz
   - First player to 0 HP loses

### Multiplayer Combat Flow
1. Both players see each other on the island
2. Player 1 aims crosshair at Player 2
3. Player 1 shoots (raycasting hit detection)
4. Hit event sent over WebRTC to Player 2
5. Player 2 takes damage, health bar updates
6. Player 2 returns fire
7. Combat continues until one player is defeated
8. Game over screen displays winner/loser
9. Option to rematch or return to menu

## Color Choices

### Brand Colors
- **Primary**: #0a7ea4 (Ocean Blue) - Used for UI highlights, buttons
- **Accent**: #ff6b35 (Sunset Orange) - Used for warnings, low ammo indicators
- **Success**: #22c55e (Forest Green) - Used for health, successful actions
- **Warning**: #f59e0b (Amber) - Used for low health, reload prompts
- **Error**: #ef4444 (Crimson Red) - Used for damage, death

### Game HUD Colors
- **Crosshair**: White (#ffffff) with slight glow
- **Ammo Counter**: White text on dark semi-transparent background
- **Health Bar**: Green (#22c55e) for full, transitioning to red (#ef4444) for critical
- **Enemy Health**: Red (#ef4444)
- **Minimap Background**: Dark navy (#1a1f2e) with 60% opacity
- **Minimap Player**: Green (#22c55e)
- **Minimap Enemy**: Red (#ef4444)

### UI Theme
- **Background**: Dark (#151718) for immersive gameplay
- **Surface**: Slightly lighter (#1e2022) for menus and overlays
- **Text**: Light gray (#ecedee) for readability
- **Borders**: Subtle (#334155) for UI separation

## Technical Specifications

### Graphics Pipeline
- **Engine**: Babylon.js v7.0+ with WebGPU
- **Rendering**: WebGPU (with WebGL fallback)
- **Physics**: Babylon Native Physics (Havok)
- **Lighting**: Single directional light, pre-baked shadows
- **Target FPS**: 60 FPS on mobile devices
- **Resolution**: Responsive to device screen size

### Performance Targets
- **Load Time**: <3 seconds on Wi-Fi
- **Frame Rate**: 60 FPS sustained on mid-range Android devices
- **Memory**: <150 MB on mobile
- **Network Latency**: <50ms on local Wi-Fi

### Accessibility
- **Text Scaling**: Responsive font sizes
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Minimum 48x48 dp for buttons
- **Haptic Feedback**: Optional haptics for actions (shoot, hit, reload)

## Landscape Orientation
- **Primary Orientation**: Landscape (16:9 aspect ratio)
- **Safe Area**: Accounts for notches and home indicators
- **One-Handed Usage**: Joysticks positioned for thumb control
- **Screen Rotation**: Locked to landscape to prevent UI disruption during gameplay
