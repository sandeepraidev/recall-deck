import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.recalldeck.app",
  appName: "Recall Deck",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
