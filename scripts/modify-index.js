// This script injects GitHub Pages handling script into the Remix-generated index.html
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve('./build/client/index.html');

try {
  // Read the Remix-generated index.html
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // GitHub Pages handling script to inject
  const githubPagesScript = `
  <script>
    // GitHub Pages SPA handling for Remix
    (function() {
      // Repository name for GitHub Pages
      const repoName = 'oerschema-v7';
      
      // Add base tag for non-localhost environments
      const isProd = window.location.hostname !== 'localhost';
      if (isProd) {
        // Check if base tag already exists
        if (!document.querySelector('base')) {
          const baseTag = document.createElement('base');
          baseTag.href = '/' + repoName + '/';
          document.head.appendChild(baseTag);
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
    })();
  </script>`;

  // Inject the script right after the opening <head> tag
  indexHtml = indexHtml.replace('<head>', '<head>' + githubPagesScript);

  // Write the modified HTML back to the file
  fs.writeFileSync(indexPath, indexHtml);
  
  console.log('Successfully injected GitHub Pages handling script into index.html');
} catch (error) {
  console.error('Error modifying index.html:', error);
  process.exit(1);
}