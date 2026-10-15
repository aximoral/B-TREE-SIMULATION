import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('Error: dist/assets directory not found. Please run "npm run build" first.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFile = files.find((f) => f.endsWith('.css'));
const jsFile = files.find((f) => f.endsWith('.js'));

if (!cssFile || !jsFile) {
  console.error('Error: Could not find CSS or JS bundle in dist/assets.');
  process.exit(1);
}

const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');

// Escape any potential </script> closing sequences
const sanitizedJs = jsContent.replace(/<\/script/gi, '<\\/script');

const singleHtml = `<!doctype html>
<html lang="en" class="h-full w-full overflow-hidden">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>B-Tree Interactive Simulation | Algorithmic Workbench</title>
    <!-- Offline SVG Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2'/%3E%3Cpath d='M9 3v18'/%3E%3Cpath d='M15 3v18'/%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
      /* Inlined Tailwind & Design Tokens */
      ${cssContent}
    </style>
  </head>
  <body class="h-full w-full bg-[#F8FAFC] text-[#0F172A] antialiased overflow-hidden m-0 p-0 select-none">
    <div id="root" class="h-full w-full overflow-hidden"></div>
    <script>
      ${sanitizedJs}
    </script>
  </body>
</html>
`;

const outputPath = path.join(rootDir, 'btree-visualizer.html');
fs.writeFileSync(outputPath, singleHtml, 'utf-8');

const stats = fs.statSync(outputPath);
console.log(`Successfully generated standalone offline file:`);
console.log(` -> ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
