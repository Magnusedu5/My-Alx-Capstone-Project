import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./src", // optional if your main files are inside src
  build: {
    outDir: "../dist", // build output folder
  },
});
