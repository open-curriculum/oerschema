import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Use the repository name directly instead of importing from package.json
const repoName = "oerschema-v7"; // Replace with your actual repository name
const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? `/${repoName}/` : '/';

export default defineConfig({
  base,
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      }
    }),
    tsconfigPaths(),
  ],
});
