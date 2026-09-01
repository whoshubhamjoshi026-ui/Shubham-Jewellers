// Capacitor configuration for mobile builds
export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    url?: string;
    cleartext?: boolean;
    androidScheme?: string;
  };
  android?: {
    allowMixedContent?: boolean;
  };
}

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