import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shubhamjewellers.app',
  appName: 'Shubham Jewellers',
  webDir: 'dist/public', // Vite build output folder — check your dist structure after `npm run build`, adjust if needed (often just "dist")
  server: {
    // App will ALWAYS load your live Render site.
    // Deploy on Render -> app auto-reflects changes, no rebuild/republish needed.
    url: 'https://sj-8c2l.onrender.com',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;