
<img width="1600" height="457" alt="oerschema-logo-horizontal-800x@2x" src="https://github.com/user-attachments/assets/81a557fc-04fb-417d-a37d-2afe1af42f4f" />

# OERSchema

Live site: https://oerschema.org

This Remix app hosts the OER Schema documentation, schema browser, outline builder UI, and the VitePress plugin docs.

## Quick Start

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:5173/.

## Common Scripts

- `npm run dev` — Remix dev server (Vite)
- `npm run build` — production build
- `npm run start` — run the production server locally
- `npm run lint` — lint sources
- `npm run typecheck` — type checking
- `npm run build:vercel` — Vercel build entry

## Deployment (Vercel)

- Framework: Remix
- Output directory: `build/client`
- Build command: `npm run build:vercel`
- Middleware handles legacy redirects to class/property pages.

## VitePress Plugin

Published package: `vitepress-plugin-oer-schema` (npm).

Install:
```sh
npm install vitepress-plugin-oer-schema
```

Use in `.vitepress/config`:
```js
import { oerSchemaPlugin } from "vitepress-plugin-oer-schema";
import "vitepress-plugin-oer-schema/styles.css";

export default {
	markdown: {
		config: (md) => md.use(oerSchemaPlugin),
	},
};
```

## Legacy Site

The previous static schema site is located on the `legacy-site` branch.
