import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // genera ambos
  dts: true,
  sourcemap: true,
  clean: true,
});
