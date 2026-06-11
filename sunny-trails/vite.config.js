import { defineConfig } from "vite";

export default defineConfig({
  base: "/wdd330sunnytrails/",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
