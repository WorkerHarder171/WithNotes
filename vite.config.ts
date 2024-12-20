import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
const config: UserConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  build: {
    outDir: "dist", 
  },
  server: {
  },
});

export default config;
