# Fulfillment Central Design System — Mockup Guide for Product Leaders

> **Purpose.** This is the plain-English reference for product leaders who want to sketch a mockup, show a new feature concept, or describe an update clearly enough that a designer can refine it — without a back-and-forth week. It covers two surface families: **Ops & Dashboard** (desktop planning and management tools, built on the Fulfillment DS library) and the **Acupick Picker App** (mobile handheld app for store associates, built on the AcuPick library).
>
> **How to use this doc.**
> 1. Start with **Section 0: Which Surface Are You Designing For?** to pick the right track.
> 2. Read the shared foundation (Sections 1–8) once. This is the brand-wide stuff.
> 3. For a new screen, jump to the **Mockup Recipe** (Section 16) — a 10-minute checklist that branches by surface.
> 4. Before accepting any AI-generated mockup, run it against **Common Mockup Failures** (Section 15).
> 5. When you hand off, paste the **Designer Handoff Template** (Section 17) alongside your mockup so design and engineering get a clean spec.

---

## Table of Contents

0. **Which Surface Are You Designing For? (start here)**
1. Brand Principles
2. The Logo
3. Typography
4. Color (including Acupick temp-zone colors)
5. Photography
6. Illustration
7. Icons
8. Voice & Content
9. Accessibility Floor
10. **Ops & Dashboard** — Layout, Scaffolds, Components, Patterns
11. **Acupick Picker App** — Device, Layout, Scaffolds, Components, Patterns
12. Spacing, Sizing & Container Composition (shared)
13. Auto-Layout Rules (shared)
14. Mockup Recipe (10-minute checklist, branches by surface)
15. Common Mockup Failures (and how to fix them)
16. Designer Handoff Template
17. Token & Component Name Reference

---

## 0. Which Surface Are You Designing For? (start here)

Fulfillment Central has two very different kinds of screens. They live in different Figma libraries, use different layouts, and serve different users. Pick one before you prompt.

### Surface A: Ops & Dashboard

**Users.** Store managers, planners, dispatchers, coordinators, leadership.

**Devices.** Desktop (≥ 1440 px), sometimes tablet (812–1440 px).

**What it's for.** Planning, monitoring, reporting, staffing, analytics, configuration. "See the state of the operation and make decisions."

**Design library.** Fulfillment DS (covered in Sections 10, 12, 17).

**Typical screens.** Sales & labor planning dashboard, order queue, store cluster view, performance report, settings, store demand planning, coverage analysis.

**Key characteristics.** Dense, multi-column, KPI cards, data tables, charts (stubbed for now), filter toolbars, sidebar navigation, desktop mouse-and-keyboard.

### Surface B: Acupick Picker App

**Users.** Store associates on the floor — pickers, stagers, bag runners.

**Devices.** Handheld phone, 360 × 640 px. Android-primary, one-thumb operation, often with gloves in a cold room or walking fast down an aisle.

**What it's for.** Completing a pick/stage/handoff task in the fewest steps possible. "Tell me exactly what to grab, scan, weigh, bag, and stage."

**Design library.** AcuPick Redesign Component Library + AcuPick Design System (Redesign) (covered in Section 11). Uses a subset of Fulfillment DS (Button, Card, Toast) plus Acupick-specific components.

**Typical screens.** Home / task list (Picklist), Picking (scan a tote, scan an item, confirm quantity), Exceptions (can't find, substitution), Staging (scan a slot, confirm location), Bag/Tote labels, Staging complete.

**Key characteristics.** Full-screen single task per screen, huge primary action at the bottom of the viewport, barcode scan as the dominant input, temperature-zone color coding (frozen / chilled / ambient / hot), generous tap targets (56 px+ for gloves).

### The gut-check

| Question | Answer |
|---|---|
| Is the user sitting at a desk with a mouse? | **Ops & Dashboard.** |
| Is the user walking around a store with a phone? | **Acupick.** |
| Is there a KPI row, a sidebar nav, and a filter toolbar? | **Ops & Dashboard.** |
| Is there one big task per screen and a scanner? | **Acupick.** |
| Could a manager use this from home on their laptop? | **Ops & Dashboard.** |
| Could a picker use this while holding a bag of frozen peas? | **Acupick.** |

If you picked wrong, your mockup will feel off no matter how well it's built. Pick once, pick right, then move on.

---

## 1. Brand Principles

Shared across both surfaces. Fulfillment is "Your Go-To Neighbor for All Things Food." Everything we ship should feel like a helpful neighbor, not a vendor. The brand rests on four principles — use them as a gut-check when a design feels off.

**Vibes.** Warm, approachable, confident. Never cold, corporate, or clinical. If a screen could live in a bank app without changing a pixel, it's wrong.

**Ethos.** Honest and useful. Don't hide information behind tooltips users have to hunt for. Don't use dark patterns. Never disguise a marketing surface as a system message.

**Earnest.** We mean what we say. Error messages tell the truth. Confirmations confirm what actually happened. Numbers are real numbers.

**Moxie.** We have personality. A little wit in empty states, success moments, and onboarding beats sterile perfection.

**Gut-check for any mockup:** Would a trusted neighbor show this to you? If not, revise. (Applies to both a planning dashboard *and* a picker screen. The picker screen just says it shorter.)

---

## 2. The Logo

The Fulfillment lockup (mountain mark + wordmark) appears on external-facing surfaces and persistent chrome (top navigation, marketing pages, receipts, emails, splash screens). In the Acupick app the mark typically appears only on the splash/login screen; the in-app chrome is minimal to maximize task space.

**Clear space.** Maintain breathing room equal to the height of the "F" on all sides. Do not crowd.

**Do.**
- Use the full-color lockup on white or very light neutrals.
- Use the white (reversed) lockup on Fulfillment Blue or any dark surface.
- Use the single-color black lockup when color is not available (faxed forms, one-color print).

**Don't.**
- Recolor the logo outside the approved variants.
- Place it on a busy photo without a scrim or safe-zone overlay.
- Skew, rotate, stretch, or outline it.
- Rebuild the wordmark from a different typeface.

---

## 3. Typography

Fulfillment uses two typefaces: a **Primary** typeface for brand voice moments and a **Secondary** typeface for functional UI. Remember: Primary for voice, Secondary for function.

### 3.1 Ops & Dashboard text styles (Fulfillment DS)

Pull styles by these exact names — the ones your designer and engineer already know.

**Titles / Headings.** `Title/H1` → `Title/H6`. H1 is your page title (one per screen). H6 is used for small titles and button labels. H2–H5 fill the hierarchy in between.

**Body.** `Body/M` is the default reading size for the interface. `Body/L` is a special case, reserved for rare situations where a title font feels wrong but body needs to feel larger than default. `Body/S` is used for metadata, helper text, and captions.

### 3.2 Acupick text styles (AcuPick Design System)

The picker app uses its own smaller, denser scale so a screen can fit the maximum useful info at a glance.

- `App/Display` — the one large number or product name (size, weight, price).
- `App/Title` — the page title on each picker screen.
- `App/Body/Regular` — default reading text.
- `App/Body/Bold` — emphasized body (item name, quantity).
- `App/NavLabels/Regular` — tab and nav labels.
- `App/Metadata` — aisle name, temperature zone label, supporting info.

Never mix a Fulfillment DS `Title/Hx` token into an Acupick screen. The scales are tuned differently.

### 3.3 Rules of thumb (both surfaces)

- One H1/Title per screen. Two headings means you want two screens.
- Line height ≈ 1.4× the font size for body, 1.2× for titles.
- Never set body copy below 14 px (Ops) or 16 px (Acupick — it's read on the move).
- Don't italicize the primary typeface. Use it straight.
- Don't use all caps for sentences longer than about 3 words.

### 3.4 Rough type scale

| Style | Surface | Use it for | Size | Weight |
|---|---|---|---|---|
| Display | Ops | Marketing hero, onboarding splash | 48–64 px | Bold |
| Title / H1 | Ops | Page title | 32–40 px | Bold |
| Title / H2 | Ops | Section header | 24–28 px | Bold / Semibold |
| Title / H3 | Ops | Sub-section, card title | 20 px | Semibold |
| Title / H4 | Ops | Minor section, list group | 18 px | Semibold |
| Title / H5 | Ops | Small group label | 16 px | Semibold |
| Title / H6 | Ops | Small title, button | 14 px | Semibold |
| Body / L | Ops | Rare large body | 18 px | Regular |
| Body / M | Ops | Default body | 16 px | Regular |
| Body / S | Ops | Helper, metadata | 14 px | Regular |
| App/Display | Acupick | Item quantity, scanned value | 40–56 px | Bold |
| App/Title | Acupick | Screen title | 20–24 px | Bold |
| App/Body/Bold | Acupick | Item name, key info | 16 px | Bold |
| App/Body/Regular | Acupick | Default body | 16 px | Regular |
| App/NavLabels | Acupick | Tab label, nav | 14 px | Semibold |
| App/Metadata | Acupick | Aisle, zone, helper | 12–14 px | Regular |

---

## 4. Color

Five color groups. The #1 way mockups go wrong is mixing groups (a secondary accent on a primary button, a semantic color used decoratively, etc.).

### 4.1 Primary — Fulfillment Blue

The brand color, shared across both surfaces.
- Primary CTAs (one per screen when possible).
- Active navigation states and links.
- Progress indicators on the "making progress" path.

> If everything is blue, nothing is primary.

### 4.2 Secondary — warm accents

A small palette of warm secondary accents (corals, ambers, teals) for:
- Category or tag differentiation (e.g., produce vs. pantry vs. prepared).
- Illustration and marketing moments.
- Milestones and celebration.

Never use a secondary color for a primary CTA. Never more than one secondary accent in a single component.

### 4.3 Neutrals — the structural workhorse

Two neutral ramps: **Dark Tones** and **Light Tones**. About 80% of a typical screen is neutral.

| Role | Where it shows up |
|---|---|
| Surface (lightest) | Page background |
| Surface-2 | Card / modal background |
| Border / Divider | Input borders, hairlines |
| Icon-default | Default icon color |
| Text-secondary | Helper text, metadata, placeholder |
| Text-primary (darkest) | Body and heading text |

### 4.4 Semantic — meaning, not decoration

| Color | Meaning | Use for |
|---|---|---|
| Success (green) | "This worked." | Confirmation toasts, delivered-order badges, completed steps, successful scans |
| Error (red) | "This failed or needs fixing." | Inline form errors, destructive confirmations, failed payments, mis-scans |
| Warning (amber) | "Heads up, this might be an issue." | Low stock, approaching cutoff, expiring promos, sub needed |
| Info (blue-teal) | "Neutral informational context." | Tips, system messages, non-blocking updates |

Don't recolor a success toast to fit a marketing moment. Don't use red for a "Delete" button that isn't destructive.

### 4.5 Acupick temperature zone colors (picker app only)

The Acupick library publishes a dedicated set of **Temp Zone** colors because cold-chain compliance is business-critical. These colors appear on item cards, bag labels, and staging slots to tell the picker at a glance where something belongs.

| Zone | Color feel | Used on |
|---|---|---|
| **Frozen** | Cool blue | Items that must go to freezer staging; frozen-bag labels |
| **Chilled** | Teal / cyan | Items that must go to the cold bag |
| **Ambient** | Neutral / warm beige | Shelf-stable items, default bag |
| **Hot** | Warm red-orange | Prepared hot foods, hot-hold staging |

Temp zone colors are **not** semantic colors. Don't use Frozen blue for a primary button. Don't use Hot red for an error. They carry one meaning: *what zone does this item belong to*.

### 4.6 Published color tokens (Fulfillment DS)

These are the variable names your designer will bind:

- `Primary-Text-Color`, default body and heading text
- `Icon-Color`, default icon color
- `Input-Bg-Color`, field backgrounds
- `Input-Border-Color`, field borders
- `Placeholder-Text-Color`, placeholder text
- `Helper-Text-Color`, helper text
- Semantic tokens: `Success`, `Error`, `Warning`, `Info`

### 4.7 Published color tokens (AcuPick library)

The AcuPick Temp Zone component set publishes four bindable variants:
- `Temp Zones/Frozen`
- `Temp Zones/Chilled`
- `Temp Zones/Ambient`
- `Temp Zones/Hot`

Use these by name in any Acupick mockup. Do not invent new zones (e.g., "Cool" or "Warm") — there are four zones and there will only ever be four.

---

## 5. Photography

Photography is reserved for moments where a human touch matters — hero sections, marketing pages, celebratory empty states, About pages. It basically never appears in the Acupick picker app, where task density wins.

**Feel.** Real people, real kitchens, real food. Natural light. Hands in the frame are good. Lifestyle over product-on-seamless.

**Avoid.** Stocky stock. Over-saturated food shots that look like a chain menu. Anything that feels staged or uncanny.

**When NOT to use photography.** Dense functional screens (order lists, admin tools, data tables, picker screens). Photography on a dashboard looks like an ad. Photography on a picker screen wastes space the associate needs.

---

## 6. Illustration

Three types of illustration with different jobs. Don't mix them in the same surface.

**Supportive illustrations**, larger, expressive, emotional. Use them in empty states, onboarding, and marketing moments ("You have no orders yet, let's find your first one"). In Acupick, use only on the staging-complete celebration and on shift-over screens.

**Navigational illustrations**, smaller, flatter, instantly recognizable. Used for category tiles, persona pickers, home-screen entry points.

**Informative icons**, system icons (see Section 7). On Acupick, icons carry most of the visual weight.

Rules: one illustration style per surface. Don't mix filled and outlined. Never decorative — if it doesn't help the user understand what they're seeing, cut it.

---

## 7. Icons

System icons are single-color, uniform weight, 24 px baseline on Ops and 24–32 px on Acupick (bigger tap / glance target).

**Rules.**
- One icon style per screen. Don't mix filled and outlined in the same nav.
- Icons in buttons sit 8 px from the label, aligned to text optical center.
- Every icon must have a text label or `aria-label` equivalent — never icon-only for primary actions unless the meaning is universal (search, close, scan).
- On Acupick, the Scanner icon (`Scan`) is a first-class primary action — often the whole bottom button.

---

## 8. Voice & Content

Fulfillment's voice is **friendly, direct, and trustworthy** — the "go-to neighbor" in word form. Acupick copy gets even shorter and more imperative — a picker mid-aisle needs a four-word instruction, not a sentence.

### The short rulebook

- Write like you talk. Contractions are fine.
- Be specific. "Your order is on the way" beats "Your order status has been updated."
- Own mistakes plainly. "We couldn't process that payment, try again?" beats "An error has occurred."
- No buzzwords.
- Second person. "You," not "the user."
- Active voice.

### Ops microcopy cheat sheet

| Surface | Do | Don't |
|---|---|---|
| Button (primary) | "Place order" | "Submit" |
| Button (destructive) | "Delete list" | "OK" |
| Empty state | "No orders yet, want to start one?" | "You have 0 items." |
| Form error | "That ZIP doesn't look right." | "Invalid input." |
| Success toast | "Order placed, see you in 45 min." | "Success." |
| Loading | "Finding your store…" | "Please wait." |

### Acupick microcopy cheat sheet

| Surface | Do | Don't |
|---|---|---|
| Scan prompt | "Scan a tote" | "Please scan the tote barcode to continue." |
| Item instruction | "Grab 2" | "You need to pick 2 units of this item." |
| Confirmation | "Picked 2 of 2" | "Item successfully picked." |
| Error | "Barcode didn't match" | "The scanned item does not match." |
| Exception entry | "Can't find?" | "Report an exception for this item" |
| Success | "All picked — stage it" | "Picking step completed successfully." |

### Guiding rules

- Does this feel like it's coming from a real person?
- Are we being honest about what just happened?
- Could we say it shorter? Usually yes — and on Acupick, *always* yes.
- Could we say it warmer without losing precision? Usually yes.

---

## 9. Accessibility Floor

Non-negotiable. Table stakes, not polish.

### 9.1 Shared

- **Contrast.** 4.5:1 minimum for body; 3:1 for text 18 px bold or larger.
- **Never color alone.** A red error has an icon or label. A green success says "Success." A Frozen zone says "Frozen" — color isn't enough.
- **Focus states.** Every interactive element has a visible focus ring.
- **Labels.** Every form field has a visible label — placeholder text is not a label.
- **Motion.** Respect `prefers-reduced-motion`. No parallax on core flows.

### 9.2 Ops-specific

- **Tap targets.** 36 px minimum on desktop (mouse), 44 px on tablet.
- **Keyboard.** Every action is describable with "Tab to X, press Enter."

### 9.3 Acupick-specific (handheld)

- **Tap targets.** **56 px minimum** for any primary action. Pickers wear gloves and move fast.
- **Primary action placement.** Always at the bottom of the viewport, full-width, thumb-reachable one-handed.
- **Contrast floor is harder.** Picking can happen in a dim freezer or under fluorescent glare. Aim for 7:1 on primary text when possible.
- **Sound + haptic for scan events.** A successful scan makes a sound and a vibration — don't rely on visual confirmation alone. Mark this in the handoff for any scan flow.
- **One task per screen.** No multi-column, no tabs competing for attention. If you need two tasks, you need two screens.

---

## 10. Ops & Dashboard — Layout, Scaffolds, Components, Patterns

This is the Fulfillment DS track. If you picked **Surface A** in Section 0, read this section. If you picked **Surface B (Acupick)**, skip to Section 11.

### 10.1 Breakpoints

| Breakpoint | Width | Typical use |
|---|---|---|
| **Small (mobile)** | 360 px up to < 812 px | Phones — used when ops tools are accessed on the go |
| **Medium (tablet)** | 812 px up to < 1440 px | Tablets, small laptops |
| **Large (desktop)** | 1440 px and higher | Primary target for Ops. Persistent sidebar nav, multi-column dashboards |

### 10.2 Page scaffolds (Ops)

Every Ops screen starts with one of these three scaffolds. Don't invent a new one.

**Scaffold A: App shell with sidebar (Large breakpoint — default for dashboards)**

```
Page                    [column, gap 0, padding 0]
├── Primary Navigation  [row, full width, height 64]
└── Body                [row, gap 0, padding 0, align stretch]
    ├── Sidebar         [column, gap 4, padding 16, width 240]
    │   └── Nav items   [inside the sidebar, never outside]
    └── Main            [column, gap 24, padding 32, flex 1]
        ├── Page header [row, gap 16, align space-between]
        │   ├── Title + subtitle   [column, gap 4]
        │   └── Header actions     [row, gap 12]   ← status chips live here
        ├── Filter toolbar         [row, gap 12, wrap, align center]
        ├── KPI row                [row, gap 16, equal widths]
        ├── Primary content        [row OR column, gap 24]
        └── Secondary content
```

**Scaffold B: Content page, single column (Medium or Large)**

```
Page                    [column, gap 0]
├── Primary Navigation
└── Main                [column, gap 24, padding 32, max-width 1200, centered]
    ├── Page header
    ├── Section 1       [Card or H2 + content]
    ├── Section 2
    └── Section N
```

**Scaffold C: Ops mobile stack (Small, rare)**

```
Page                    [column, gap 0]
├── Header              [title, optional back affordance, height 56]
├── Main                [column, gap 16, padding 16]
│   ├── Card 1
│   └── Card 2
└── Primary Navigation Mobile
```

### 10.3 Fulfillment DS component library

Reach for these *before* inventing anything new.

**Structural & Navigation**

| Component | What it is | When to use |
|---|---|---|
| `Primary Navigation` | Desktop top / side navigation | Persistent on every desktop screen |
| `Primary Navigation Mobile` | Mobile nav (bottom bar or slide-out) | Persistent on every mobile screen |
| `Modal Background` | Full-screen scrim behind a modal | Always pair with `Transactional Modal` |

**Containers & Disclosure**

| Component | When to use |
|---|---|
| `Card` | Grouping related info. Use interactive variant when the whole card is clickable. |
| `AccordionGroup` | FAQs, progressive disclosure. Not for primary nav. |
| `Transactional Modal` | Confirmations, short tasks. Not for anything that deserves its own page. |

**Action**

| Component | When to use |
|---|---|
| `Button` | Every interactive action. Variants: Primary / Secondary / Tertiary / Destructive. One primary per screen. |

**Form & Input**

| Component | When to use |
|---|---|
| `Text Field` | All text inputs |
| `Helper Text` | Paired with Text Field |
| `Checkbox` / `CheckboxLabel` | Binary or list selection |
| `Radio` | Single-select from 2–5 options |
| `Calendar` | Date selection, range selection |

**Feedback & Status**

| Component | When to use |
|---|---|
| `Alerts` | Page-level status that persists |
| `Toast` | Transient confirmation, auto-dismiss |
| `Indicator` | Status chip, count badge, category tag |
| `SpinnerLine` | Anything async > 300 ms |

**Identity & Data**

| Component | When to use |
|---|---|
| `Avatar` | Account menus, collaborators |
| `Pagination` | Lists or tables with > one page |

### 10.4 What Fulfillment DS does NOT yet own

Mark these "TBD, work with design" in your handoff. Do not let the AI invent its own version.

- Complex data tables
- Charts and data visualizations
- Global search / autocomplete
- Faceted filter panels
- Side drawers / side sheets
- File upload / drag-drop
- Tabs (scoped)
- Segmented controls
- Sliders / range selectors
- Switches / toggles
- Dropdown / select menus

### 10.5 Ops patterns

**Pattern: Dashboard page.** Page header (title + page-level status chip + primary action) → filter toolbar (one row) → KPI row (2 to 4 equal cards) → primary content area (chart card + supporting side column of guidance cards) → secondary content (table card with the details). Every region is a sibling in the Main column with gap 24. Chart card internals: header row (chart title + legend/toggle, space-between) → plot area → axis labels. The legend or toggle is never on top of the plot.

**Pattern: Form.** Stack vertically. `Label → Text Field → Helper Text`. Group related fields with 16 px gap; 24 px between groups. Primary CTA at the bottom, right-aligned on desktop. Destructive actions live far from the primary CTA.

**Pattern: Confirmation.** `Transactional Modal` → heading (what are we confirming?) → body → two buttons: Cancel (Tertiary) + Primary/Destructive.

**Pattern: List + Detail.** Desktop split view — list on the left (30–40% width), detail on the right.

**Pattern: Status + Action.** Row: leading icon → primary text → secondary text → trailing `Indicator` → overflow action.

**Pattern: Async operation.** Button press → `SpinnerLine` inline → success `Toast` or error `Alerts`.

**Pattern: Destructive confirmation.** `Transactional Modal` with Destructive button. Heading states the action plainly ("Delete this list?"). Body explains what is lost and whether it's reversible.

---

## 11. Acupick Picker App — Device, Layout, Scaffolds, Components, Patterns

This is the AcuPick track. If you picked **Surface B** in Section 0, read this section.

### 11.1 Device and frame

- **Frame size.** 360 × 640 px, portrait.
- **OS-primary.** Android. Android status bar (24 px, top) and nav bar (48 px, bottom) are always present.
- **One hand, one thumb.** The picker is walking, carrying a tote, or wearing gloves. Assume no second hand is free.
- **Input.** Barcode scan is the primary input method. Touch is secondary. Typing is a last resort.
- **Environment.** Variable lighting (freezer to loading dock), sometimes loud, sometimes dim. Design for the worst case.

### 11.2 Acupick page scaffold (there is only one)

Every Acupick screen follows the same structure. This is a feature, not a limitation — it makes the app learnable in minutes.

```
Screen (360 × 640)      [column, gap 0]
├── Status Bar          [Android status, 24 px, system]
├── Header              [row, 56 px, padding 16]
│   ├── Back / Menu     [leading icon, 32 px hit area]
│   ├── Title           [App/Title, centered or left-aligned]
│   └── Action / More   [trailing icon, optional]
├── Context Strip       [row, 40 px, padding 16, optional]
│   └── Order #, tote ID, temp zone chip, progress (3 of 7)
├── Main                [column, gap 16, padding 16, flex 1]
│   └── ONE primary task region — the thing to do on this screen
├── Primary Action      [row, full-width button, 56 px tall, padding 16]
│   └── "Scan" or "Confirm" or "Stage it"
└── Nav Bar             [Android nav, 48 px, system]
```

**The non-negotiable Acupick rules:**
- One task per screen. If you need two, make two screens.
- Primary action is always the bottom full-width button. Always.
- The primary action is usually "Scan [next thing]" or "Confirm" — rarely anything else.
- Progress ("3 of 7") is always visible somewhere in the header or context strip.
- Temp zone chip is visible on every item-level screen. The picker should never lose track of where something is going.

### 11.3 Acupick component library

Published in AcuPick Redesign Component Library and AcuPick Design System (Redesign). Reach for these by name.

**Structural**

| Component | What it is | When to use |
|---|---|---|
| `Header` | Acupick screen header (back, title, optional action) | Every screen |
| `Tabs` | Segmented tabs for switching between item types (e.g., all / missing / picked) | Inside Picklist, Staging |
| `Android Status Bar` | System status bar (24 px) | Every screen, top |
| `Android Nav Bar` | System nav bar (48 px) | Every screen, bottom |

**Task cards and lists**

| Component | What it is | When to use |
|---|---|---|
| `Picking List` | The main picker task card — item name, image, aisle, qty, temp zone | The dominant pattern. Used anywhere a picker sees one item to act on. |
| `List/TempZones` | List row variant that leads with a temp zone indicator | Mixed lists where zone is the key sort/filter |

**Labels and indicators**

| Component | What it is | When to use |
|---|---|---|
| `Temp Zones/Frozen` | Frozen zone pill | On any frozen item card or bag label |
| `Temp Zones/Chilled` | Chilled zone pill | On any chilled item |
| `Temp Zones/Ambient` | Ambient zone pill | On any shelf-stable item |
| `Temp Zones/Hot` | Hot zone pill | On any hot-food item |
| `Aisle name` | Aisle location label | On every item card that has a known location |
| `Qty Label` | Quantity chip / badge (e.g., "2 of 4") | On every item card, progress headers |
| `Tote Label` | Printable tote label | Print & bag workflows |
| `Bag Label` | Printable bag label | Bag-packing workflow |
| `Bag` | Shopping bag graphic | Bag count sheets, staging slots |
| `Staging` | Staging slot component (slot ID, status) | Staging placement screen |

**Action**

| Component | What it is | When to use |
|---|---|---|
| `Button` (Fulfillment DS) | Primary / Secondary / Tertiary | Every action. On Acupick, always 56 px tall. |
| Scan CTA | A Button variant with Scan icon + "Scan [thing]" label | The default primary action on most screens |

**Feedback**

| Component | What it is | When to use |
|---|---|---|
| `Toast` (Fulfillment DS) | Transient confirmation | Every successful scan / pick / stage |

### 11.4 What the Acupick library does NOT own (common gaps)

- Complex forms (there are almost none in this app — pickers don't type)
- Data tables
- Date pickers (the app is real-time; no planning)
- Charts
- Multi-select UIs of more than 5 options

If a mockup needs any of the above, something is wrong with the requirements. Pickers execute; they don't plan.

### 11.5 Acupick patterns

**Pattern: Task list (Picklist).** Screen header ("Your orders" or "Pick queue") → Tabs (All / In progress / Completed) → stacked `Picking List` cards in a column, gap 12. Each card is tappable, leading into the picking flow for that order. No primary action button — the list *is* the action.

**Pattern: Scan a thing (tote, item, slot).** Screen header → short one-line prompt ("Scan a tote") → either a big scan affordance (illustrative camera / scanner target) or a state of "Ready to scan." Primary action button at the bottom: "Scan." On successful scan, transition to the next screen. On mis-scan, stay on the screen with an error `Toast` + inline hint ("Barcode didn't match — try again").

**Pattern: Pick an item.** Screen header with progress ("3 of 7") → `Picking List` item card (image, name, `Aisle name`, `Temp Zones/[Frozen|Chilled|Ambient|Hot]`, `Qty Label`) → primary action "Scan item" → after scan, if multiple units, go to Select Quantity.

**Pattern: Select Quantity.** Big number input (App/Display text), `+` and `−` buttons sized at 56 × 56 px, primary action "Confirm [qty]". No keyboard unless the qty is > 99.

**Pattern: Exception (substitution, out of stock, can't find).** Reached from an "I can't pick this" entry on the item screen. List of reasons as large tap-rows → optionally pick a substitute → confirm. Exception reasons should be no more than 4 visible options; if more, stack-rank by frequency and tuck rare ones under "More."

**Pattern: Staging.** After all items picked → "Scan the staging slot" → once scanned, confirm the tote/bag is placed → "Staged" success toast → Staging Complete screen with a supportive illustration and "Back to home" button.

**Pattern: Bag/Tote labeling.** Bag Count sheet → print `Bag Label` or `Tote Label` (component includes order info, temp zone, bag number). Printed view is a full-bleed label, not a scrollable page.

**Pattern: Staging complete / end of order.** Full-screen celebration: supportive illustration → "All staged." → primary action "Next order" or "Back to home." Keep it short and earned.

### 11.6 Acupick visual rules

- **Card widths.** Always full content width minus 16 px padding on each side. Never a narrow card.
- **Card stacks.** Vertical column, 12 px gap. No multi-column in Acupick.
- **Tap target floor.** 56 px for primary, 44 px for secondary, 32 × 32 hit area for small icons.
- **Typography.** Always use App/* styles. Never use Title/Hx from Fulfillment DS in Acupick.
- **Color.** Neutrals + Fulfillment Blue for primary action + Semantic for status + Temp Zone for zone. Nothing else.
- **Illustration.** Only on success / staging-complete / shift-done screens. Not in the middle of a task flow.

---

## 12. Spacing, Sizing & Container Composition (shared)

Use a **4 px base grid**. Every spacing value is a multiple of 4.

Common values: `4, 8, 12, 16, 24, 32, 48, 64`.

### 12.1 Ops spacing defaults

- Screen edge padding: 16 (mobile) / 24 (tablet) / 32 (desktop).
- Title to content gap: 16.
- Card to card (stacked): 12 (mobile) / 16 (desktop).
- Inside a card: 24 (desktop) / 16 (mobile) on all sides.
- Field to field: 16. Label to field: 4.

### 12.2 Acupick spacing defaults

- Screen edge padding: 16 on all sides.
- Header to content gap: 16.
- Card to card (stacked): 12.
- Inside a card: 16 on all sides.
- Primary button height: 56. Distance from primary button to nav bar: 0 (button sits on top of the nav bar area with 16 px outer padding).

### 12.3 Radius and elevation

**Radius.** Cards and inputs use a small radius (about 4–8 px on Ops, 8–12 px on Acupick for softer feel). Buttons match. Modals use a slightly larger radius. Don't invent new radii.

**Elevation.** Modals and popovers use a single shadow token. Cards are flat by default. Elevation is reserved for "this layer is above the page" (modals, dropdowns, toasts).

### 12.4 Container composition rules

Every card, toolbar, form, and page follows the same rules: pick a container → set its four auto-layout properties → place children inside.

**Card (internal).** Column, gap 16, padding 24 (Ops desktop) / 16 (Ops mobile + Acupick).

**Card (external).** Gap 16 (Ops desktop) / 12 (mobile + Acupick) in the parent column. All cards in a column share identical width.

**Page header (Ops).** Row, gap 16, align space-between. Title/subtitle left, actions right.

**Acupick header.** Row, 56 px tall, padding 16, align center. Back icon left, title centered or left, optional trailing icon right. No space-between ambiguity.

**Filter toolbar (Ops).** Row, gap 12, wrap on narrow widths. Actions pushed right with space-between.

**KPI row (Ops).** Row, gap 16, equal widths (flex 1). Never unequal widths in the same KPI row.

**Acupick primary action.** Row or single child, full-width, 56 px tall, padding 16 above and below. Sits at the very bottom of the Main column, above the Android Nav Bar.

**Table inside a card (Ops).** Table takes the card's full inner width minus padding. Don't wrap in a second container.

### 12.5 Sizing rules

- **Height is content-driven, not invented.** An alert card's height = its text + its padding. Blank space below content = hardcoded height = bug.
- **Equal siblings mean equal sizes.** Four KPI cards = four equal widths.
- **Minimum tap target.** 36 px on desktop (Ops), 44 px on tablet, **56 px on Acupick primary**, 44 px on Acupick secondary.
- **Icon buttons.** 32 × 32 minimum hit area.

### 12.6 What "don't invent new values" means in practice

If your AI output has `padding: 18px`, it invented a value. Fix it to 16 or 24. The scale is the scale. Same for gaps, radii, and tap targets.

---

## 13. Auto-Layout Rules (shared)

This is the section AI tools skip most often. Most broken mockups on either surface trace back to missing auto-layout.

### 13.1 The auto-layout contract

Every container in any Fulfillment or Acupick mockup uses auto-layout. No free-floating children, no manual positioning, no overlap.

Every box must have four properties:

1. **Direction** — vertical (column) or horizontal (row).
2. **Gap** — the space between children. One value from the scale.
3. **Padding** — inner space around children.
4. **Alignment** — how children align on the cross-axis.

If any of the four is missing, the mockup is broken.

### 13.2 The non-negotiables (paste these into your prompt)

- **Children never overflow their parent.** A sidebar item does not bleed into main content. A badge does not float next to its card unattached.
- **Children are never manually positioned.**
- **Siblings never overlap.** If two elements look like they touch, they share a container with gap 0. They are not layered.
- **Every label has a container.** Floating text outside any box is a bug.
- **Toolbars are single horizontal containers.**
- **Cards fit their content.** Empty space inside a card is deliberate padding, not unset height.
- **Acupick primary action is always at the bottom, always full-width, always 56 px.** No exceptions.

---

## 14. Mockup Recipe (10-minute checklist)

The recipe branches by surface. Step 0 is the fork.

**0. Pick your surface.** Ops & Dashboard, or Acupick? If you're wrong here, nothing else matters. (See Section 0.)

**1. The one job.** Write one sentence: "This screen helps [who] do [what] so they can [outcome]." If you can't, back up.

**2. The scaffold.**
- **Ops:** pick Scaffold A (app shell with sidebar), B (single-column content), or C (rare mobile).
- **Acupick:** use the one Acupick scaffold (Section 11.2). Name it.

**3. The breakpoint / device.**
- **Ops:** Small / Medium / Large.
- **Acupick:** 360 × 640, Android.

**4. The primary action.** One. What's the single most important thing the user should do? That's the Fulfillment Blue button.

**5. The information.** What's the minimum the user needs to see to take that action? Everything else goes on another screen (especially on Acupick).

**6. The structure.**
- **Ops:** Navigation → Title (H1) + status chips in header → filter toolbar → KPI row → primary content → secondary content.
- **Acupick:** Status bar → Header → Context strip → Main (one task) → Primary action → Nav bar.

**7. The components.** List them explicitly by name.
- **Ops:** pull from the Fulfillment DS list (Section 10.3).
- **Acupick:** pull from the Acupick list (Section 11.3).
- Mark anything not in the relevant library "TBD, work with design." Especially data viz on Ops.

**8. The words.** Write every label, button, error, empty-state, loading, and success line. No Lorem ipsum.
- **Ops:** use the Ops microcopy cheat sheet (8.2).
- **Acupick:** use the Acupick microcopy cheat sheet (8.3). Shorter is always right.

**9. The edge cases.**
- **Ops:** Empty / Loading / Error / Success states.
- **Acupick:** Mis-scan / Can't find / Substitution / Out of stock / Network lost. Mark any that are out of scope.

**10. The layout pre-check.** Run these four questions before accepting any AI output:
- Is every box an auto-layout container with direction, gap, padding, alignment set?
- Does any child overflow its parent? (Fix with 15.1.)
- Is any text, badge, or chip floating outside a container? (Fix with 15.2.)
- Does any card have blank space that isn't intentional padding? (Fix with 15.3.)

**11. The Acupick-specific pre-check (if applicable).**
- Is there exactly one task on this screen?
- Is the primary action a 56 px full-width button at the bottom?
- Is the temp zone visible on every item-level screen?
- Is the progress indicator ("3 of 7") visible?

**12. The gut-check.** Would a trusted neighbor show this to you? Would a picker mid-shift understand it in 2 seconds?

**13. Handoff.** Fill out the Designer Handoff Template (Section 17).

---

## 15. Common Mockup Failures (and how to fix them)

Scan this list before sending to design. Each entry ends with a **corrective prompt** you can paste back into your AI tool to fix the issue without starting over.

### 15.1 Overlapping or bleeding elements

**Symptom.** A sidebar nav item extends past the sidebar edge into main content. A badge sits on top of a card border.

**Corrective prompt.**
> "Put every element inside an auto-layout container. Sidebar and main content are siblings in a row container with gap 0. No child extends past its parent. Nothing uses absolute positioning. Re-render."

### 15.2 Floating badges, chips, or status labels

**Symptom.** A status chip like "Coverage stable" or "Live" sits alone in a corner with no parent.

**Corrective prompt.**
> "Move the status chip into the page header. Header is a row, gap 16, align space-between. Put the chip either immediately after the title in a row with gap 12, or at the far right next to the action buttons. Never free-floating."

### 15.3 Cards with huge empty space

**Symptom.** An alert card has a short text line and 100–300 px of blank space below.

**Corrective prompt.**
> "Card height is content plus 24 px padding, nothing more. Do not set a fixed height on any card. Remove all hardcoded heights and re-render."

### 15.4 Invented chart or data-viz patterns (Ops)

**Symptom.** Bars with disconnected dots, pie charts with no legend, axes missing, toggles covering the plot.

**Fix.** Don't ask AI for complex data viz. Stub it as a labeled rectangle ("CHART: sales vs. labor, line + bar, placeholder") and mark it TBD for design. Or ask for a single-type chart (bars only) with explicit axes + legend.

**Corrective prompt.**
> "Replace the chart with a labeled rectangle saying CHART: [description]. Charts are not in the Fulfillment DS library; this is a stub for design to build later."

### 15.5 Spacing drift

**Corrective prompt.**
> "Use only these spacing values: 4, 8, 12, 16, 24, 32. Every card has 24 px inner padding (Ops) or 16 px (Acupick). Card-to-card gap is 16 (Ops) or 12 (Acupick). Remove any other value."

### 15.6 Disconnected toolbar (Ops)

**Corrective prompt.**
> "Filters and actions are children of one horizontal toolbar container, gap 12, align center, justify space-between. Filter pills and action buttons are the same height."

### 15.7 Toast in the wrong place

**Corrective prompt.**
> "Toast is a transient overlay, not a page element. Render it as a floating element anchored bottom-right (desktop) or bottom-center (mobile + Acupick), 24 px offset from the viewport edge."

### 15.8 Generic colors instead of DS tokens

**Corrective prompt.**
> "Use only design system tokens. Ops: Fulfillment DS tokens (Primary Blue, Success/Error/Warning/Info, Light Tones neutrals). Acupick: same plus Temp Zones/Frozen, Chilled, Ambient, Hot. Replace every hex value with a token name."

### 15.9 Missing states

**Corrective prompt.**
> "Also render empty, loading, and error states. Empty uses supportive illustration + heading + primary action. Loading uses SpinnerLine + text. Error uses Alerts (Error) with retry."

### 15.10 Acupick failure: More than one task on a screen

**Symptom.** An Acupick screen has a scan prompt AND a form AND a card list — everything fighting for attention.

**Corrective prompt.**
> "Acupick screens show ONE task at a time. Split this into two or three screens in a flow. Each screen has: header, optional context strip, one task region, one primary full-width 56 px button at the bottom."

### 15.11 Acupick failure: Primary action not at the bottom

**Symptom.** The "Scan" or "Confirm" button is in the middle of the screen, or top-right, or inline with a card.

**Corrective prompt.**
> "The primary action is a full-width button, 56 px tall, sitting at the bottom of the Main column just above the Android nav bar. It is the LAST child of the screen's column before the nav bar. Move it there and re-render."

### 15.12 Acupick failure: Missing temp zone chip

**Symptom.** Item cards have no temperature zone indicator.

**Corrective prompt.**
> "Every item-level Acupick card includes a Temp Zones chip (Frozen / Chilled / Ambient / Hot) in the card header or metadata row. Add it."

### 15.13 Acupick failure: Using Title/Hx text styles

**Symptom.** The mockup uses Title/H1 or Body/M on an Acupick screen.

**Corrective prompt.**
> "Acupick uses its own text styles: App/Display, App/Title, App/Body/Bold, App/Body/Regular, App/NavLabels/Regular, App/Metadata. Replace every Title/Hx and Body/X reference with the Acupick equivalent."

### 15.14 Acupick failure: Desktop-sized tap targets

**Symptom.** Buttons look like 36 px desktop buttons on a picker screen.

**Corrective prompt.**
> "Minimum tap target on Acupick is 56 px for the primary action and 44 px for any secondary interactive. Pickers wear gloves. Increase the tap targets and re-render."

---

## 16. Designer Handoff Template (copy-paste)

```
FEATURE: [name]
OWNER: [product leader]
STATUS: Concept for designer to refine

0. SURFACE
[ ] Ops & Dashboard (Fulfillment DS, desktop-primary)
[ ] Acupick Picker App (AcuPick library, 360×640 Android)

1. THE JOB
This screen helps [audience] do [action] so they can [outcome].

2. BREAKPOINT / DEVICE
Ops: [ ] Small  [ ] Medium  [ ] Large
Acupick: 360 × 640 (default)

3. SCAFFOLD USED
Ops:      [ ] A — App shell with sidebar
          [ ] B — Content page, single column
          [ ] C — Mobile stack
Acupick:  [ ] Standard Acupick scaffold (Section 11.2)

4. WHERE IT LIVES
[entry point → this screen → exit point]

5. PRIMARY ACTION
[one button / one CTA — the exact text]
Acupick only — confirm it's a 56 px full-width bottom button? [ ]

6. KEY CONTENT
- [thing 1]
- [thing 2]
- [thing 3]

7. COMPONENTS USED
From Fulfillment DS (if Ops):
  - [Primary Navigation / Card / Button / Text Field / Alerts / Toast / etc.]
From AcuPick library (if Acupick):
  - [Header / Picking List / Temp Zones/X / Aisle name / Qty Label / Staging / etc.]
TBD — needs design (DO NOT accept AI invention):
  - [charts, complex tables, dropdowns, tabs, side drawers, etc.]

8. COPY
Title:           "[exact words]"
Primary button:  "[exact words]"
Secondary:       "[exact words]"
Empty state:     "[exact words]"
Loading:         "[exact words]"
Error:           "[exact words]"
Success:         "[exact words]"
(Acupick) Mis-scan: "[exact words]"
(Acupick) Exception entry: "[exact words]"

9. OPEN QUESTIONS FOR DESIGN
- [anything I wasn't sure about]

10. OUT OF SCOPE
- [what this mockup is not trying to solve]

11. LAYOUT QA (I checked these before sending)
[ ] Every container has direction, gap, padding, alignment set
[ ] No child overflows its parent
[ ] No floating badges, labels, or chips outside a container
[ ] No card has blank space that isn't intentional padding
[ ] Spacing uses only scale values: 4, 8, 12, 16, 24, 32, 48, 64
[ ] Colors use only design system tokens
[ ] (Ops) Chart is stubbed or uses simple bar/line with axes
[ ] (Acupick) One task per screen
[ ] (Acupick) Primary action is 56 px full-width bottom button
[ ] (Acupick) Temp zone chip visible on item-level screens
[ ] (Acupick) Progress indicator visible
```

---

## 17. Token & Component Name Reference

### 17.1 Ops & Dashboard (Fulfillment DS)

**Library name:** `Fulfillment DS`

**Components (all published):**
`AccordionGroup`, `Alerts`, `Avatar`, `Button`, `Calendar`, `Card`, `Checkbox`, `CheckboxLabel`, `Helper Text`, `Indicator`, `Modal Background`, `Pagination`, `Primary Navigation`, `Primary Navigation Mobile`, `Radio`, `SpinnerLine`, `Text Field`, `Toast`, `Transactional Modal`

**Text styles:** `Title/H1`, `Title/H2`, `Title/H3`, `Title/H4`, `Title/H5`, `Title/H6`, `Body/L`, `Body/M`, `Body/S`

**Color variables:** `Primary-Text-Color`, `Icon-Color`, `Input-Bg-Color`, `Input-Border-Color`, `Placeholder-Text-Color`, `Helper-Text-Color`, semantic `Success` / `Error` / `Warning` / `Info`

**Breakpoints:** `Small` (360–812), `Medium` (812–1440), `Large` (≥ 1440)

**Page scaffolds:** `Scaffold A` (app shell with sidebar), `Scaffold B` (single column), `Scaffold C` (mobile stack)

### 17.2 Acupick Picker App (AcuPick)

**Library names:** `AcuPick Redesign Component Library`, `AcuPick Design System (Redesign)`

**Components (published in Acupick libraries):**
`Header`, `Tabs`, `Picking List`, `List/TempZones`, `Staging`, `Bag`, `Tote Label`, `Bag Label`, `Aisle name`, `Qty Label`, `Temp Zones/Frozen`, `Temp Zones/Chilled`, `Temp Zones/Ambient`, `Temp Zones/Hot`, `Android Status Bar`, `Android Nav Bar`

**Components borrowed from Fulfillment DS:**
`Button`, `Card`, `Toast`

**Text styles:** `App/Display`, `App/Title`, `App/Body/Bold`, `App/Body/Regular`, `App/NavLabels/Regular`, `App/Metadata`

**Temp zone tokens:** `Temp Zones/Frozen`, `Temp Zones/Chilled`, `Temp Zones/Ambient`, `Temp Zones/Hot`

**Frame size:** `360 × 640` (portrait, Android)

**Scaffold:** Standard Acupick scaffold (Status Bar → Header → Context Strip → Main → Primary Action → Nav Bar)

### 17.3 Spacing scale (both surfaces)

`4, 8, 12, 16, 24, 32, 48, 64` — nothing else.

### 17.4 Sibling libraries used by designers (rarely named in PM specs)

`DK2 Typography`, `DK2 Colors`, `DK2 AppComponents`, `DK2 CommonComponents`, `Pantry components`, `Pantry icons`, `Pantry Illustrations`, `Pantry design tokens`, `🧱 SFLD Foundation: Icons`, `🧱 SFLD Foundation: Typography`.

---

*Sources: Fulfillment-DS Figma file (Ops / dashboard design system) and Picking — Staging Figma file (AcuPick V1 Main Flow Happy Path). Component lists verified against the AcuPick Redesign Component Library, AcuPick Design System (Redesign), and Fulfillment DS published libraries.*
