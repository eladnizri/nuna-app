import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base מותאם ל-GitHub Pages של פרויקט: https://<user>.github.io/nuna-app/
export default defineConfig({
  base: "/nuna-app/",
  plugins: [react(), tailwindcss()],
});
