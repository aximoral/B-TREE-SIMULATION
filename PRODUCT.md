# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
delegated: Vite + React with TypeScript and Tailwind CSS, paired with SVG/Canvas for responsive, animated B-tree rendering.

## Users
Computer science students, software engineers, and learners studying advanced Data Structures & Algorithms (database indexing, storage engines, and multiway search trees) preparing for coursework, interviews, or systems design.

## Product Purpose
Deliver an intuitive, interactive visual simulation of B-Tree data structures. Help users clearly observe and understand key B-tree operations—including search, insertion, proactive/reactive node splitting, deletion, borrowing, and merging.

## Positioning
A focused, interactive B-Tree simulator providing step-by-step state visualization, invariant tracking (minimum and maximum degree constraints), and granular animation of node splits and pointer updates, demystifying external storage tree algorithms.

## Operating Context
Modern desktop and tablet web browsers. Used as a hands-on learning lab where users input custom keys, trigger operations, step forwards/backwards through animation states, and inspect node metadata.

## Capabilities and Constraints
- Operations: Insert, Search, Delete, Randomize, and Reset.
- Configurable B-Tree order / minimum degree ($t$).
- Step-by-step execution: Play, Pause, Step Forward, Step Back, and Speed adjustment.
- Animated structural changes: Node splitting, key elevation, key borrowing, and node merging.
- Invariant inspector: Displaying capacity, height, key ranges, and node fill rates.
- Undecided: Persistence across sessions (local storage or export/import).

## Brand Commitments
Focused educational workspace: high-contrast visual clarity, distraction-free interface, and responsive layout.

## Evidence on Hand
Greenfield workspace with no prior code or assets.

## Product Principles
1. Causality in Motion: Animations clearly show where keys move and why nodes split or merge, rather than teleporting elements.
2. Cognitive Control: The learner controls the time scale—scrub, pause, or step through complex balancing maneuvers.
3. Structural Fidelity: Maintain rigorous algorithmic correctness with visual cues for B-tree invariant bounds ($t-1$ to $2t-1$ keys).
4. Clarity First: Tree diagrams must adapt gracefully to growing height and breadth without visual overlap or noise.

## Accessibility & Inclusion
Accessible interactive controls, clear color contrast between keys and nodes, readable typography, and textual operation logs to reinforce visual state changes.
