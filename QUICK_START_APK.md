# 🚀 Quick Start - Build APK in 5 Minutes

## The Easiest Way to Build Your Game APK

### What You Need
- A computer (Windows, Mac, or Linux)
- Node.js installed (download from https://nodejs.org)
- Free Expo account (sign up at https://expo.dev)

---

## Build in 5 Steps

### 1️⃣ Install EAS CLI
```bash
npm install -g eas-cli
```

### 2️⃣ Navigate to Project
```bash
cd survival-shooter-mobile
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Login to Expo
```bash
eas login
```
(Enter your Expo account credentials)

### 5️⃣ Build APK
```bash
eas build --platform android --profile preview
```

**Done!** ✅

The build will take 5-15 minutes. When complete, you'll get a download link for your APK.

---

## Install on Android Device

1. Download the APK from the link
2. Open it on your Android phone
3. Tap "Install"
4. If prompted, enable "Unknown Sources" in Settings > Security

---

## That's It! 🎮

Your Survival Shooter 3D game is now ready to play!

**Need help?** See `EAS_BUILD_GUIDE.md` for detailed instructions and troubleshooting.

---

## Alternative: Use GitHub Actions (Fully Automated)

If you push this project to GitHub, the APK builds automatically!

1. Push to GitHub
2. Go to Actions tab
3. Wait for build to complete
4. Download APK from Artifacts

No manual commands needed! 🤖
