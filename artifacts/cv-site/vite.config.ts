import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Set VITE_BASE_PATH in your environment for GitHub Pages subpath deployments.
// Example: VITE_BASE_PATH=/my-repo-name  (when hosting at username.github.io/my-repo-name)
// Leave unset (or "/") when hosting at a root domain (username.github.io or a custom domain).
const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: "localhost",
    fs: {
      strict: true,
    },
  },
});
