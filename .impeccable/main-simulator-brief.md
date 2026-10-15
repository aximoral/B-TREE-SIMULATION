# Surface Brief: main-simulator

<!-- impeccable:surface-brief 1 -->

## Target
main-simulator

## Scope & Mode
Single-page interactive B-Tree simulator workbench.
Mode: Operate.

## Audience & Job
Computer science students and software engineers learning B-tree algorithms, database indexing, and external memory structures. They need to visualize, step through, and understand B-tree balancing invariants, node splits, and key reorganizations.

## Direction contract

### THESIS
Visual causality over static final states. The interface refuses the typical toy CS visualizer habit of jarring teleportations and opaque re-renderings by breaking operations down into fine-grained micro-steps: probe comparison, capacity check, median extraction, parent promotion, sibling partition, and pointer reconnection.

### OWN-WORLD
Deep slate laboratory (#090D16 base ground, #131B2E surface panels, #1E293B border structure). Key elements are crisp rectangular database slots with high-legibility tabular monospace numerals, active highlight gold/amber (#F59E0B) for probes/splits, emerald (#10B981) for successful insertions, and indigo/cyan (#6366F1 / #06B6D4) for pointer conduits and tree links.

### STORY
The user inputs keys or loads data presets, triggers operations, and watches step-by-step how the B-Tree maintains its height invariants ($h \le \log_t \frac{n+1}{2}$). When a node reaches $2t-1$ keys during insertion, the user observes the proactive median split before downward progression.

### FIRST VIEWPORT
Top workbench toolbar (inputs, operations, degree $t$, animation speed, playback controls). Center expansive auto-centering SVG/HTML tree canvas displaying root and child nodes with distinct key cells. Right collapsible inspector displaying selected node metrics, fill rates, and live algorithmic pseudocode. Bottom docked timeline scrubber with phase micro-step chips.

### FORM
Interactive Workbench (CLRS Proactive Top-Down B-Tree Visualizer), grounded candidate 3, seed key 0173e0e2.

### FINISH
unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
