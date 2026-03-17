import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
/*
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "127.0.0.1",
    port: 8085,
    allowedHosts: ["local-re-onboarding.citics.vn"],
  },
});
*/

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: "10.130.114.32",
    port: 8085,
    allowedHosts: ["re-onboard.citics.vn"],
  },
});
