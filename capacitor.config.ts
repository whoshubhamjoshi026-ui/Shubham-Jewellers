import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shubhamjewellers.app',
  appName: 'Shubham Jewellers',
  webDir: 'dist',
  server: {
    url: 'https://sj-8c2l.onrender.com',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;