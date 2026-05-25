# Survival Shooter 3D - EAS Build Guide

This guide will help you build the Android APK using Expo's EAS Build service (cloud-based, no local Android SDK needed).

## What is EAS Build?

**EAS Build** is Expo's cloud build service that compiles your React Native app into an APK without requiring you to install Android Studio or the Android SDK locally. Perfect for building on any device!

---

## Prerequisites

1. **Expo Account** (Free)
   - Sign up at https://expo.dev
   - Verify your email

2. **Node.js & npm** installed on your computer
   - Download from https://nodejs.org (LTS version recommended)

3. **Git** (optional, but recommended)
   - Download from https://git-scm.com

---

## Step-by-Step Build Instructions

### Step 1: Install EAS CLI

Open your terminal/command prompt and run:

```bash
npm install -g eas-cli
```

Verify installation:
```bash
eas --version
```

### Step 2: Clone or Download the Project

If you have the project as a ZIP file:
```bash
unzip survival-shooter-mobile.zip
cd survival-shooter-mobile
```

Or if you have it on GitHub:
```bash
git clone <your-repo-url>
cd survival-shooter-mobile
```

### Step 3: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 4: Login to Expo

```bash
eas login
```

Enter your Expo account credentials (email/password or GitHub)

### Step 5: Build the APK

**Option A: Cloud Build (Recommended)**

This builds on Expo's servers - no local setup needed:

```bash
eas build --platform android --profile preview
```

The build will:
- Upload your project to Expo's servers
- Compile the APK in the cloud (takes 5-15 minutes)
- Provide a download link when complete
- Show build progress in your terminal

**Option B: Local Build**

If you have Android SDK installed locally:

```bash
eas build --platform android --local
```

### Step 6: Download the APK

After the build completes, you'll see:
```
✅ Build finished
📱 APK ready at: https://expo-builds.s3.us-west-2.amazonaws.com/...
```

Click the link or copy it to download the APK file.

### Step 7: Install on Android Device

**Method 1: Direct Download (Easiest)**
1. Open the download link on your Android device
2. Tap the APK file to install
3. Allow installation from unknown sources if prompted

**Method 2: Using ADB (Advanced)**
```bash
adb install -r app-release.apk
```

---

## Troubleshooting

### "eas login failed"
- Make sure you have an Expo account at https://expo.dev
- Try logging out and back in: `eas logout` then `eas login`

### "Build failed with error"
- Check the build logs in the terminal
- Common issues:
  - Missing `app.config.ts` - ✅ Already included
  - Invalid bundle ID - ✅ Already configured
  - Missing dependencies - Run `npm install` again

### "Installation blocked on Android"
- Go to Settings > Security > Unknown Sources
- Enable "Allow installation from unknown sources"
- Try installing again

### Build takes too long
- EAS builds can take 10-20 minutes depending on queue
- You can check build status at https://expo.dev/builds

---

## Build Profiles

The `eas.json` file defines different build profiles:

- **preview**: Creates an APK for testing (current profile)
- **production**: Creates an optimized APK for release
- **development**: Creates a development build with Expo Go

To use a different profile:
```bash
eas build --platform android --profile production
```

---

## Next Steps After Building

1. **Test the APK** on your Android device
2. **Report any bugs** and I'll fix them
3. **Share the APK** with friends for testing
4. **Publish to Google Play Store** (optional - requires Google Play Developer account)

---

## Useful Commands

```bash
# Check build status
eas build:list

# View build details
eas build:view <build-id>

# Configure EAS settings
eas build:configure

# Submit to app store (after successful build)
eas submit --platform android
```

---

## Support

If you encounter issues:
1. Check the build logs: `eas build:view <build-id>`
2. Review the Expo documentation: https://docs.expo.dev/build/setup/
3. Contact Expo support: https://expo.dev/support

---

## Important Notes

- **First build may take longer** (10-20 minutes) as Expo prepares the build environment
- **Subsequent builds are faster** (5-10 minutes)
- **Free tier includes 30 build minutes/month** - plenty for development
- **APK is valid for 30 days** from build date

Good luck! 🚀
