# Survival Shooter 3D - APK Build Guide

This guide explains how to build the Android APK file for the Survival Shooter 3D game.

## Project Overview

The project is a 3D offline/local-multiplayer survival shooter game built with:
- **Babylon.js** (WebGPU graphics engine)
- **React Native** (mobile app framework)
- **Capacitor** (native app wrapper)
- **WebRTC** (peer-to-peer multiplayer)
- **Service Workers** (offline support)

## Prerequisites

Before building the APK, ensure you have the following installed:

### 1. Node.js and npm/pnpm
```bash
node --version  # Should be v18+
npm --version   # or pnpm --version
```

### 2. Java Development Kit (JDK) 17+
```bash
java -version   # Should be Java 17 or higher
```

If you don't have Java 17, install it:

**macOS (using Homebrew):**
```bash
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

**Ubuntu/Debian:**
```bash
sudo apt-get install openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

**Windows:**
Download from [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) or use [OpenJDK](https://adoptium.net/)

### 3. Android SDK
Install Android Studio or the Android SDK command-line tools:

**macOS:**
```bash
brew install android-sdk
```

**Ubuntu/Debian:**
```bash
sudo apt-get install android-sdk
```

**Windows:**
Download [Android Studio](https://developer.android.com/studio)

Set the Android SDK path:
```bash
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
```

### 4. Gradle (usually installed with Android SDK)
```bash
gradle --version  # Should be 8.0+
```

## Building the APK

### Step 1: Install Dependencies
```bash
cd survival-shooter-mobile
pnpm install
```

### Step 2: Build Web Assets
```bash
pnpm run build
```

This creates the web app files in the `dist/web` directory.

### Step 3: Sync with Android Project
```bash
npx cap sync android
```

This copies the web assets to the Android project.

### Step 4: Build the APK

**Debug APK (for testing):**
```bash
cd android
./gradlew assembleDebug
```

The debug APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK (for distribution):**
```bash
cd android
./gradlew assembleRelease
```

The release APK will be at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Step 5: Sign the Release APK (Optional)

To sign the release APK for distribution:

```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.jks \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  alias_name
```

Or use Android Studio's built-in signing tool.

## Troubleshooting

### Java Version Error
If you get "Android Gradle plugin requires Java 17", ensure JAVA_HOME is set correctly:
```bash
export JAVA_HOME=/path/to/java17
./gradlew assembleDebug
```

### Gradle Build Fails
Clear Gradle cache and rebuild:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Missing Android SDK
Run Android Studio and install required SDK components:
- Android SDK Platform 34
- Android SDK Build-Tools 34.0.0
- Android Emulator (optional)

### Out of Memory Error
Increase Gradle memory:
```bash
export GRADLE_OPTS="-Xmx2048m"
./gradlew assembleDebug
```

## Testing the APK

### On Physical Device
1. Enable Developer Mode: Settings → About Phone → Tap Build Number 7 times
2. Enable USB Debugging: Settings → Developer Options → USB Debugging
3. Connect device via USB
4. Install APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### On Android Emulator
1. Start emulator:
   ```bash
   emulator -avd Pixel_4_API_30
   ```
2. Install APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Game Features

The APK includes:

- **Single Player Mode**: Battle 3 AI-controlled bots on a survival island
- **Multiplayer Mode**: 1v1 PvP over local Wi-Fi using WebRTC P2P connection
- **QR Code Handshake**: Scan opponent's QR code to establish connection
- **Offline Support**: PWA service worker enables offline gameplay
- **Responsive Controls**: Touch joysticks for mobile, keyboard/mouse for desktop
- **HUD**: Crosshair, ammo counter, health bars, enemy indicators
- **Combat System**: Raycasting hit detection, magazine-based ammo, reload mechanics

## Project Structure

```
survival-shooter-mobile/
├── app/
│   ├── game/
│   │   ├── engine.ts          # Babylon.js WebGPU engine
│   │   ├── player.ts          # Player controller
│   │   ├── bot.ts             # AI bot system
│   │   ├── hud.ts             # HUD overlay
│   │   ├── game-manager.ts    # Game orchestration
│   │   └── network.ts         # WebRTC networking
│   ├── (tabs)/
│   │   ├── index.tsx          # Main menu
│   │   ├── game.tsx           # Game screen
│   │   ├── multiplayer.tsx    # Multiplayer setup
│   │   └── settings.tsx       # Settings
│   └── _layout.tsx            # App layout
├── android/                   # Native Android project (Capacitor)
├── public/
│   ├── sw.js                  # Service Worker
│   └── manifest.json          # PWA manifest
├── dist/
│   └── web/                   # Built web assets
├── capacitor.config.js        # Capacitor configuration
└── package.json               # Dependencies
```

## Performance Optimization

The game is optimized for mobile devices:

- **WebGPU rendering**: Low-overhead GPU access for high frame rates
- **Babylon.js**: Optimized 3D engine with culling and LOD
- **Asset caching**: Service Worker caches all assets for offline use
- **Network sync**: 60Hz position/rotation sync over WebRTC
- **Memory efficient**: Minimal dependencies, optimized mesh sizes

## Distribution

Once you have the signed release APK:

1. **Google Play Store**: Upload to Google Play Console
2. **Direct Distribution**: Share APK file directly
3. **GitHub Releases**: Attach APK to GitHub releases
4. **App Stores**: Submit to alternative app stores (F-Droid, etc.)

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Capacitor documentation: https://capacitorjs.com/docs
- Check Babylon.js documentation: https://doc.babylonjs.com/
- Review Gradle build documentation: https://gradle.org/guides/

## Next Steps

1. Set up your development environment with Java 17 and Android SDK
2. Follow the build steps above to create your APK
3. Test on an Android device or emulator
4. Sign and distribute your APK

Good luck with your Survival Shooter 3D game!
