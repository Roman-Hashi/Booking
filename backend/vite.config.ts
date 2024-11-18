import { resolve } from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { VitePluginNode } from "vite-plugin-node";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    VitePluginNode({
      adapter: "express",
      appPath: resolve(__dirname, "./src/index.ts"),
      exportName: "app",
      initAppOnBoot: true,
      tsCompiler: "esbuild",
    }),
    tsConfigPaths(),
  ],
});
