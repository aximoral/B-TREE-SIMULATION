# 🌳 Interactive B-Tree Visualizer

An interactive, single-page algorithmic simulation of **multiway balanced search trees (B-Trees)** built with React 19, TypeScript, and Tailwind CSS.

Designed for computer science students and engineers to intuitively understand external memory data structures, disk page layouts, and proactive CLRS algorithms.

---

## ✨ Features

- **Proactive Top-Down Splitting (CLRS)**: Visualizes full-child splitting before descending during insertions, avoiding cascading retroactive splits.
- **Full Deletion Mechanics**: Supports leaf deletion, borrowing from left/right siblings, merging underflowing nodes, and predecessor/successor elevation for internal keys.
- **Step-by-Step Playback Controls**:
  - **Speed Options**: `0.5x` (leisurely study pace), `1x` (normal), and `2x` (rapid population).
  - **Manual Stepping**: Step backward (`<`) and step forward (`>`) through exact historical snapshots with zero layout shifts.
  - **Play / Pause**: Pause at any frame to inspect invariants ($t-1 \le \text{keys} \le 2t-1$) and resume smoothly.
- **Infinite 2D Canvas**: Full-bleed drag-to-pan, wheel zoom, auto-framing, and interactive 100% zoom snap.
- **Clean Studio Light Theme**: Focused functional color palette—tinted node trays (`#F1F5F9`), pure white key capsules, and color-coded state rings (emerald for search matches, amber for splits/probes, blue for insertions, rose for deletions).
- **Standalone Offline File**: Bundled into a zero-dependency 277 KB single HTML file (`btree-visualizer.html`) that runs offline in any browser without Node or internet.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the visualizer with hot reloading.

### 3. Production Build & Offline Bundler
```bash
npm run build
```
This compiles the TypeScript code, bundles the production application into `dist/`, and automatically regenerates `btree-visualizer.html`.

To preview the built production app locally:
```bash
npm run preview
```

---

## 📦 Standalone Single-File Version

If you want to share the simulator with someone who doesn't have Node.js or `npm`, simply send them the `btree-visualizer.html` file in the root folder. They can double-click it to open the complete, fully functional app offline in any browser.

---

## 🌐 Deploying to GitHub Pages (Free Live URL)

To host this project live on GitHub so anyone can visit it via a web link:

1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. GitHub will offer a standard "Static HTML" or "Vite" workflow, or you can deploy the `dist/` branch.
   - Alternatively, you can use the `gh-pages` package:
     ```bash
     npm install -D gh-pages
     ```
     Add to `package.json` scripts:
     ```json
     "deploy": "npm run build && gh-pages -d dist"
     ```
     Then run:
     ```bash
     npm run deploy
     ```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📄 License

MIT License. Free to use, modify, and distribute for educational and personal projects.
