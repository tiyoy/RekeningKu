---
name: Precision Banking & Card Portal
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.005em
  label-numeric:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.02em
  label-card-pan:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.12em
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets high-net-worth retail banking, multi-account oversight, and dynamic ATM card lifecycle management. The visual tone balances modern institutional trustworthiness with the aerodynamic precision of advanced financial technology. It avoids cold corporate austerity through crisp contrast, deep ink tones, and luminous royal blue accents that inspire competence, immediacy, and security.

The aesthetic philosophy centers on **Precision Modern Minimalism**:
- **Pristine Canvas Clarity:** Generous white space anchored by cool off-white layered backdrops, establishing structural discipline and immediate glanceability for critical metrics.
- **Card-Centric Depth:** Realistic, tactile ATM payment cards with rich physical gradients (deep cobalt, obsidian, iridescent brushed slate) set against clean, surgical interface foundations.
- **High-Velocity Contrast:** Deep navy/slate typography paired with purposeful status indicators (emerald green for verified states, dynamic alerts for card lock/security limits) to eliminate ambiguity during monetary decisions.

## Colors

The palette establishes an ultra-clean, clinical hierarchy designed to maximize legibility and reassure users managing sensitive financial assets.

### Palette Architecture
- **Primary (`#2563eb` / `#1d4ed8` hover):** Vibrant royal blue used selectively for high-priority interactive touchpoints, primary actions (e.g., "Issue New Virtual Card", "Transfer Funds"), focused input strokes, and active navigation tab underlines.
- **Secondary / Ink (`#0f172a` primary, `#334155` secondary, `#64748b` muted):** High-contrast deep slate tones for numeric values, ledger tables, account balances, and headers. Eliminates pure black to maintain a sophisticated editorial feel.
- **Tertiary / Success (`#10b981` / `#059669` dark):** Emerald green reserved exclusively for affirmative operational states: verified card badges, active limits, successful transaction receipts, and live ATM connectivity.
- **Surfaces & Neutral Grays:**
  - Base canvas: `#f8fafc`
  - Secondary grouping/sub-sections: `#f1f5f9`
  - Elevated surfaces: `#ffffff`
  - Subtle borders & separators: `#e2e8f0`

### Semantic & Physical ATM Card Accents
Physical card containers are permitted custom skeuomorphic gradients (e.g., Deep Obsidian `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`, Royal Sapphire `linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)`, and Platinum Brushed `linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)`). System UI chrome surrounding the cards remains strictly neutral.

## Typography

Typography enforces a strict division of labor between narrative oversight, dense data comprehension, and financial identifiers:

- **Manrope (Headlines & Summaries):** Modern, geometric sans with balanced proportions. Used for total account balances, section titles, and modal headers. Conveys stability and forward-looking momentum.
- **Inter (Body & Controls):** Utilitarian, highly neutral workhorse designed for digital screens. Delivers flawless legibility in statement lists, metadata keys, and form elements.
- **JetBrains Mono (Financial Digits & Card PANs):** Strict tabular formatting for account routing codes, masked PAN numbers (`•••• 8821`), CVC codes, expiry dates, and aligned monetary values. Prevents horizontal jitter when balance counters update dynamically.

## Layout & Spacing

The dashboard relies on an adaptable 12-column fluid grid system with fixed maximum content widths to prevent table rows and analytical graphs from overstretching on ultra-wide desktop monitors.

### Layout Rules
- **Desktop (>= 1280px):** 12 columns, 24px gutters, 32px canvas margins. Primary navigation is docked to a fixed 260px left sidebar. The core interface organizes into a 8-column ledger/account stream and a 4-column dedicated ATM card carousel & quick-actions panel.
- **Tablet (768px - 1279px):** 8 columns, 20px gutters, 24px margins. Navigation collapses to an icon rail or top app bar. Card management stacks above transaction streams.
- **Mobile (< 768px):** 4 columns, 16px gutters, 16px margins. Bottom sheet actions for card limits, horizontally swipeable snap-scroll ATM card preview stacks, and single-column transaction feeds.

### Spacing Scale & Rhythm
- Spacing strictly follows an 8pt base grid (`space-xs`: 4px, `space-sm`: 8px, `space-md`: 16px, `space-lg`: 24px, `space-xl`: 32px).
- Internal card padding uses `space-lg` (24px) for desktop summary tiles and `space-md` (16px) for compact account list rows.

## Elevation & Depth

Depth is established primarily through **ambient diffused drop shadows** combined with **crisp low-contrast outlines**. The interface avoids heavy, dark drop shadows in favor of light-penetrable surfaces that look floating, modern, and light.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Flat `#f8fafc` background without shadow.
- **Level 1 (Cards, Account Tiles, Data Tables):** Pure white surface `#ffffff`, single-pixel border `1px solid #e2e8f0`, accompanied by a wide ambient shadow: `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hover States & Active Dropdowns):** Subtle upward translation (`translateY(-2px)`), border shifts to `#cbd5e1`, shadow expands: `box-shadow: 0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals & Slide-out Panels):** Pure white surface, no borders, accompanied by an intense diffuse shield: `box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.12), 0 1px 3px 0 rgba(15, 23, 42, 0.05)`, placed above a translucent backdrop blur (`backdrop-filter: blur(4px); background-color: rgba(15, 23, 42, 0.3)`).
- **Physical ATM Card Objects:** Do not use default UI elevation. Instead, they project colored ambient glows based on card skin (e.g., deep cobalt card projects `0 12px 28px -4px rgba(37, 99, 235, 0.25)`).

## Shapes

The design system employs a **Rounded** (Index 2) structural baseline. This creates a professional, contemporary feel that remains friendly without appearing juvenile or overly circular.

### Curvature Tokens
- **Standard Controls & Badges (0.5rem / 8px):** Primary buttons, input containers, select menus, toggle switches, and table filter chips.
- **Card Containers & Modules (`rounded-lg`, 1rem / 16px):** Account summary containers, transaction statement sheets, balance charts, and modal frames.
- **ATM Card Objects (`rounded-xl`, 1.5rem / 24px):** Emulates ISO/IEC 7810 ID-1 standard rounded corners for physical payment cards.
- **Pill Exceptions (`9999px`):** Status indicators, "Verified" chip badges, and numeric account counters.

## Components

### Buttons
- **Primary:** Background `#2563eb`, text `#ffffff`, height 40px, padding 0 20px, font `Inter` weight 600. Hover: `#1d4ed8`. Active: scale transform down to `0.98`. Focus: outline `2px solid #2563eb` with 2px offset `#ffffff`.
- **Secondary:** Surface `#ffffff`, border `1px solid #e2e8f0`, text `#0f172a`. Hover: surface `#f8fafc`, border `#cbd5e1`.
- **Destructive (Card Freeze/Terminate):** Background `#fef2f2`, border `1px solid #fee2e2`, text `#dc2626`. Hover: background `#fee2e2`.

### Chips & Verified Badges
- **Verified Status Badge:** Background `#ecfdf5`, border `1px solid #a7f3d0`, text `#065f46`, padding 2px 8px, border-radius `9999px`. Prefixed with a solid 6px circular green dot (`#10b981`).
- **Card Network / Type Chip:** Background `#f1f5f9`, border `1px solid #e2e8f0`, text `#334155`, font `JetBrains Mono` 11px uppercase.

### Cards & ATM Modules
- **Interactive Financial Card (Physical Representation):** Aspect ratio `1.586:1`. Dynamic background gradient, debossed chip graphic in brushed champagne gold (`#e2d9b6`), contactless payment wave icon in translucent white, embossed masked PAN typography using `label-card-pan`.
- **Dashboard Content Card:** Background `#ffffff`, border `1px solid #e2e8f0`, border-radius 16px, padding 24px, subtle diffuse shadow. Header section houses title (`headline-sm`) and contextual actions separated by a subtle 1px divider.

### Input Fields
- Container: height 44px, background `#ffffff`, border `1px solid #e2e8f0`, border-radius 8px, padding 0 14px.
- Typography: `Inter` 14px, text `#0f172a`, placeholder `#94a3b8`.
- Focus state: border-color `#2563eb`, shadow `0 0 0 3px rgba(37, 99, 235, 0.12)`, outline none.

### Checkboxes, Switches & Radio Controls
- **Card Freeze Toggle Switch:** Width 44px, height 24px, track `#e2e8f0` (inactive) / `#2563eb` (active). Thumb is pure white `#ffffff`, 20px diameter, with 2px transition gap.
- **Form Checkbox:** 18px x 18px, border `1.5px solid #cbd5e1`, border-radius 4px. Checked: background `#2563eb` with white geometric checkmark icon.

### Account Lists & Ledger Tables
- Flat structural table with rows styled as distinct surface-hover strips. Row height 56px, alternating subtle border-bottom `1px solid #f1f5f9`.
- Hover state: row shifts background to `#f8fafc`. Monetary outflow amounts displayed in `#0f172a`, inflow credits highlighted with tertiary prefix `+#10b981`.