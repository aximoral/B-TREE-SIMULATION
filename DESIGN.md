---
name: B-Tree Simulation Workbench
description: Algorithmic studio for multiway balanced search trees and database indexing
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  secondary: "#0891b2"
  accent-probe: "#d97706"
  accent-success: "#059669"
  accent-delete: "#e11d48"
  neutral-bg: "#f8fafc"
  neutral-panel: "#f1f5f9"
  neutral-header: "#ffffff"
  neutral-border: "#e2e8f0"
  border-hover: "#cbd5e1"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#94a3b8"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
  micro:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  xs: "3px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  node-card:
    backgroundColor: "{colors.neutral-panel}"
    rounded: "{rounded.lg}"
    textColor: "{colors.text-primary}"
---

# Design System: B-Tree Simulation Workbench

## Overview

**Creative North Star: "The Systems Studio Lab"**

A crisp, distraction-free single-page laboratory environment for algorithmic comprehension of multiway search trees. The visual language marries clean studio minimalism with focused functional state highlights.

**Key Characteristics:**
- Off-white studio ground (#F8FAFC) with pure white elevated node surfaces (#FFFFFF).
- Crisp rectangular key slots echoing physical database cache pages with tabular monospace numerals.
- Purpose-driven functional color mapping: warm amber for traversal probes and capacity splits, emerald for search matches, cyan for promotions, sapphire for links, and rose for deletions.
- Zero border clutter: full-bleed canvas with an unobtrusive operations header.

## Colors

The palette employs a clean studio ground (#F8FAFC) with high-contrast functional status indicators.

### Primary
- **Sapphire Conduit** (#2563EB): Primary actions, tree socket links, and root indicators.

### Secondary
- **Cyan Promotion** (#0891B2): Median key elevation cues and sibling link reorganizations.

### Neutral
- **Studio Ground** (#F8FAFC): Canvas backdrop and low-contrast dot grid.
- **Tinted Node Tray** (#F1F5F9): Distinct light-slate node body separating cards from canvas ground.
- **Pure White** (#FFFFFF): Header surfaces and crisp key slot capsules.
- **Structural Border** (#E2E8F0): Crisp 1px division rules and slot boundaries.
- **Deep Charcoal** (#0F172A): High-contrast numerals and primary text.
- **Slate Secondary** (#475569): Labels and secondary information.

### Named Rules
**The Functional Color Rule.** Accent colors are reserved exclusively for active algorithmic states (amber for search probe / full split, emerald for key match, rose for deletion/underflow). Surfaces never use decorative accent gradients.

## Typography

**Display Font:** System UI (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)  
**Body Font:** System UI (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)  
**Label/Mono Font:** 'JetBrains Mono' (with tabular figures)

**Character:** Technical, neutral, and razor-sharp. Monospace is used specifically for data payloads, coordinates, memory bytes, and algorithmic invariants.

### Hierarchy
- **Headline** (600, 1.125rem, 1.4): Workbench brand and section headers.
- **Body** (400, 0.875rem, 1.5): Micro-step narrative descriptions and inspector explanations.
- **Label** (500, 0.75rem, 1.4): Key cell values, invariant metrics, and capacity indicators.

### Named Rules
**The Tabular Numerals Rule.** Every number representing a key, order constraint, or coordinate must render with tabular figures (`font-variant-numeric: tabular-nums`) to avoid layout jitter during playback.

## Layout

The workbench organizes into a clean two-zone minimal layout:
1. **Top Operations Bar (h-14):** Four organized functional clusters:
   - *Configuration:* Brand mark and order selector ($t \in [2, 5]$).
   - *Mutation:* Unified numeric input, Insert, Search, Delete, and Random triggers.
   - *Playback & Pacing:* Manual step backward/forward, play/pause toggle, step counter, and speed selector (`0.5x`, `1x`, `2x`).
   - *Telemetry & Recovery:* Live status narrative readout and canvas reset.
2. **Main Canvas (flex-1):** Full-bleed, interactive 2D coordinate canvas with content-aware auto-framing and zero peripheral sidebar or footer border clutter.

## Elevation & Depth

Surfaces rely on tonal elevation and precise 1px borders without heavy ambient drop shadows or decorative halos.

### Shadow Vocabulary
- **Panel Edge** (`border: 1px solid #E2E8F0`): Standard structural separation.
- **Node Resting** (`shadow: 0 1px 3px rgba(0,0,0,0.05)`): Subtle ground separation.

### Named Rules
**The Border-Free Focus Rule.** Peripheral borders and secondary panels are stripped away to dedicate maximum screen space to the animated B-Tree itself.

## Shapes

- **Node Cards:** 8px rounded corners (`rounded-lg`) with snug 6px interior key cells.
- **Buttons & Inputs:** 4px to 6px rounded corners (`rounded` / `rounded-md`).
- **Edge Links:** Smooth cubic bezier curves with 1.5px stroke width.

## Components

### Minimal Operations Bar
- **Brand & Order:** Compact B logo, title, and order dropdown ($t \in [2, 5]$).
- **Action Pill:** Number input grouped with Insert, Search, and Delete triggers.
- **Playback Deck:** Compact stepping buttons, live step indicator, and speed toggle.
- **Live Status:** Unobtrusive inline status text communicating current operation state.

### B-Tree Node Card
- **Key Slots:** Crisp row of distinct rectangular cells with 1px border.
- **State Borders:** Subtle color transitions during search probes, splits, and insertions.

## Do's and Don'ts

### Do:
- **Do** show step-by-step causality for every operation (identifying median, splitting child, promoting key, rewiring pointers).
- **Do** display real-time verification of mathematical B-tree invariants ($t-1 \le k \le 2t-1$, equal leaf depth).
- **Do** allow the user to pause, step backward, or scrub to any arbitrary frame.

### Don't:
- **Don't** use bounce or elastic easing for node transitions; use smooth ease-out transitions.
- **Don't** use decorative gradient text or low-contrast text.
- **Don't** hide B-tree capacity limits; always show the current fill status against $2t-1$.
