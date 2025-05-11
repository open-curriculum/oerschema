/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

// GitHub Pages specific handling to fix base path issues
const handleGitHubPages = () => {
  const repoName = 'oerschema-v7';
  const isGitHubPages = 
    typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' &&
    window.location.hostname.includes('github.io');

  if (isGitHubPages) {
    // Handle any GitHub Pages specific path issues
    const pathname = window.location.pathname;
    // If we're on the root of the repo but missing the trailing slash
    if (pathname === `/${repoName}`) {
      window.history.replaceState(null, '', `/${repoName}/`);
    }
  }

  // Handle redirect from 404.html
  const redirect = sessionStorage.getItem('remix-redirect');
  if (redirect) {
    sessionStorage.removeItem('remix-redirect');
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path');
    if (path) {
      window.history.replaceState(null, null, path);
    }
  }
};

// Run GitHub Pages handling before hydrating the app
handleGitHubPages();

startTransition(() => {
  // Hydrate the #root element if it exists, otherwise fall back to document
  const rootElement = document.getElementById('root') || document;
  
  hydrateRoot(
    rootElement,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
