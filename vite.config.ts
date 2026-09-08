import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // A postcss.config in a parent folder must not leak into this project.
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
