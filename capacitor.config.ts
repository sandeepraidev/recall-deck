import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.recalldeck.app",
  appName: "Recall Deck",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorSQLite: {
      // The app never encrypts its database. With encryption support on (the
      // plugin default), the plugin opens an Android-Keystore-backed
      // EncryptedSharedPreferences at startup; after a reinstall or a backup
      // restore that key can be missing, and the whole plugin then fails to
      // load ("CapacitorSQLitePlugin: null").
      androidIsEncryption: false,
    },
  },
};

export default config;
