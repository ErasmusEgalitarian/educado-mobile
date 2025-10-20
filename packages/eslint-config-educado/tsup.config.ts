import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  outDir: "dist",
  bundle: true,
  platform: "node",
  clean: true,
  dts: true,
  sourcemap: true,
  silent: true,
  external: ["eslint"],
});
