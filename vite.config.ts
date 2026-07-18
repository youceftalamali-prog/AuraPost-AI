import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),

      "framer-motion": path.resolve(
        __dirname,
        "node_modules/framer-motion/dist/cjs/index.js"
      ),

      "motion/react": path.resolve(
        __dirname,
        "node_modules/motion/dist/cjs/react.js"
      ),

      "motion/react-client": path.resolve(
        __dirname,
        "node_modules/motion/dist/cjs/react-client.js"
      ),

      "motion/react-mini": path.resolve(
        __dirname,
        "node_modules/motion/dist/cjs/react-mini.js"
      ),

      "motion/react-m": path.resolve(
        __dirname,
        "node_modules/motion/dist/cjs/react-m.js"
      )
    }
  }
});