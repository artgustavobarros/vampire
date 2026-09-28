import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [swc.vite({ module: { type: "es6" } })],
  test: {
    // o Mestre com que os e2e entram, garantido pela API ao subir
    env: { ADMIN_EMAIL: "admin@admin.com", ADMIN_PASSWORD: "!@#ASD123asd" },
    include: ["test/**/*.e2e-spec.ts"],
    root: "./",
  },
});
