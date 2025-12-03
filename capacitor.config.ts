import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tainafranco.nutrisync',
  appName: 'NutriSync',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: true
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;
