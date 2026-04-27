import { defineConfig } from "vitest/config";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "node",
    globals: true,
    include: ["server/**/*.spec.ts", "app/**/*.spec.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
      "~~": resolve(__dirname, "./"),
      vue: resolve(__dirname, "node_modules/.pnpm/node_modules/vue"),
      "vue-router": resolve(
        __dirname,
        "node_modules/.pnpm/node_modules/vue-router",
      ),
    },
  },
});
