import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Compiled Capacitor/Android build output — not source.
    "android/**",
    // Vendored jeep-sqlite browser bundle (copied verbatim by the
    // "postinstall" script), not source we own.
    "public/assets/jeep-sqlite/**",
  ]),
]);

export default eslintConfig;
