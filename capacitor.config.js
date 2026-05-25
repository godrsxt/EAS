module.exports = {
  appId: 'space.manus.survival.shooter.mobile',
  appName: 'Survival Shooter 3D',
  webDir: 'dist/web',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      releaseType: 'APK',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};
