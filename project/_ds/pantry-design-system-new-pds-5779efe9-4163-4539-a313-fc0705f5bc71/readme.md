## What Is This?

PDS (Pantry Design System) is Albertsons Companies' ecommerce design system, powering the **Albertsons**, **Safeway**, **Vons**, **Jewel-Osco**, and other banner grocery shopping experiences (web + mobile). It is the successor to the earlier DST (Design System Toolkit).

The system is **multi-theme**: six banner brands share one component library, each with its own primary palette applied via a `data-theme` attribute. Neutral and structural tokens (greys, status colours, shadows, spacing) are shared across all themes.

---

# ⚠️ PANTRY DESIGN SYSTEM — READ FIRST

Before generating anything for a Pantry project:

**STOP. Read this file:**

1. ✋ `guidelines/PANTRY-CORE.md` — component syntax, tokens, themes, hard rules (read this every time)

**Every generation task requires citing which section you read to make your decision.** If you can't cite a section, you skipped reading and should stop.

---

## Source of truth

This system is a direct port of the `wcax-brandguidelines` repository:

- **Tokens** come from that repo's Tokens Studio export, kept in `tokens/source/*.json` and compiled into `tokens/pds-global.css` (primitives) and `tokens/pds-themes.css` (one scope per banner).
- **Component classes** are ported from `src/styles/themes/components/**/_*.scss`. Every rule reads a design token — no hard-coded hex values, spacing, or radii. SCSS `transparentize()` + `rgba-to-rgb()` hover/pressed states become `color-mix(in srgb, …)` against the same opacity tokens.
- **Component markup** matches the examples in `app/views/pantry-components/*.html`, using the same `pds-*` class names. The Tailwind `tw-*` and Bootstrap grid utilities in those demo pages are page scaffolding and are not part of the system.
- **Scope**: only the components that exist under `app/views/pantry-components/` are built here. The earlier Figma-derived component set was removed — it did not match the repository's HTML structure or class names.

See `components/pantry/PORT-NOTES.md` for the exact SCSS→CSS translation table.

---

## Skills

### /evaluate-pantry

When invoked using "evaluate pantry", scores Pantry component and design output against a 30-point conformance rubric. See `guidelines/SKILL.md` for the full rubric and scoring criteria.

**Usage:** `/evaluate-pantry <HTML code or file reference>`

---

### /check-legacy-system-usage
When invoked using "check legacy system usage", check whether the component referenced is outdated and from DK2 or using the current version. Switch out the component for the current version if it is outdated. See `/projects/5779efe9-4163-4539-a313-fc0705f5bc71/guidelines/check-legacy-system-usage.SKILL.md` for more details on what to do.

`/projects/5779efe9-4163-4539-a313-fc0705f5bc71/guidelines/check-legacy-system-usage.SKILL.md`

**Usage:** `/check-legacy-system-usage <component name, screenshot, or description>`

---

## Themes (Banner Colors)

| Theme | Banner | Primary |
|---|---|---|
| `golden-gate` | Vons / Safeway / ACME | #8C0E12 (crimson) — default |
| `sutro` | Albertsons | #004488 (blue) |
| `fort-point` | Jewel-Osco | #80250C (burnt orange) |
| `presidio` | Shaw's | #1F520E (green) |
| `baker` | Tom Thumb / Randalls | #484440 (neutral taupe) |
| `redwood` | Pavilions / Star Market | #D44406 (orange-red) |

Apply with `<body data-theme="presidio">`, or on any ancestor element to theme a subtree.

Themes switch at runtime via `<pds-theme-switcher>` (`components/theme-switcher/ThemeSwitcher.jsx`,
compiled into `_ds_bundle.js` — no separate script tag needed) — a pill button (swatch + active
theme name) that opens a dropdown listing every theme as swatch, name, and its banners in parens.
Selecting a row writes `[data-theme]` on `<html>` (and on the element named by the switcher's `for`
attribute, if given, for a phone frame or artboard) and fires a bubbling `pds-theme-change`
CustomEvent on `document` that other code can listen for. Add `<pds-theme-switcher></pds-theme-switcher>`
anywhere in the markup to include it. A `default-theme="<slug>"` attribute sets which theme applies
before any switch happens (defaults to Golden Gate if omitted).

`<pds-brand-name>` is the companion display element for "current banner name" — it self-updates
from `pds-theme-change`, so a wordmark next to the switcher never needs a hand-rolled listener. Give
it the same `default-theme` as the switcher so the initial render matches; `index="1"` shows a
theme's second banner instead of its first. `<pds-brand-logo>` is the same pattern for an actual
banner logo image (from `assets/logos/`) instead of text — `variant="mark"` for the standalone mark,
`height` to size it.

## Icons

`assets/pds-icons/` holds the full PDS icon set (472 SVGs, 256 icon names across outlined/filled
variants and sizes), copied verbatim from `wcax-brandguidelines` `src/static/pantry-icons/icons`.
Reference a file directly (`<img src="assets/pds-icons/cart_outlined_24.svg">`) or look one up via
`assets/pds-icons/icon-data.js`'s `window.PDS_ICONS` map / `pdsIconSrc(name, size)` helper. Browse the
full set, with search, in the "PDS Icons" card under the Icons group.

**Known binding gap:** when this design system is bound into a consuming project, the `_ds/` copy has
been observed to drop `assets/pds-icons/` and `assets/logos/` even though both are real, tracked
folders here — the bundle resolves icon/logo URLs relative to its own script location, so a
consuming project missing those folders shows 404s for every icon and banner logo. This is a gap in
the platform's bind/copy step, not fixable from this project's source. If icons or logos 404 in a
bound project, manually copy `assets/pds-icons/` and `assets/logos/` from this project into the
consumer's `_ds/<bound-folder>/assets/` as a workaround.

Standard header pattern (see `templates/themed-canvas/`): a `position:sticky;top:0;z-index:10`
utility bar containing ONLY the switcher (no brand name, no other content) — background
`var(--pds-theme-color-background-baseline)` — sitting above page content that starts below it.
Put the brand name/logo, if any, in the page content area, not the utility bar.

Start new designs from `templates/themed-canvas/` and the switcher is already wired.

---

## Project Structure

```
styles.css              — global CSS entry point (@import only)
tokens/
  source/*.json         — canonical Tokens Studio export (global + 6 themes)
  pds-global.css        — generated primitives: colour, space, size, type, motion
  pds-themes.css        — generated per-banner theme scopes
  colors.css            — named colour role aliases
  typography.css        — @font-face declarations + type role aliases
  spacing.css           — spacing scale, border radius, sizing aliases
  shadows.css           — elevation, opacity, motion aliases
components/pantry/
  pds-*.css             — one stylesheet per component, ported from SCSS
  <Name>.jsx / .d.ts    — React components rendering the pds-* markup
  *.card.html           — specimen cards shown in the Design System tab
  PORT-NOTES.md         — SCSS→CSS translation reference
guidelines/             — foundation specimen cards + written guidance
  BENTO-CARDS.md        — Bento card authoring rules: safe zones, golden image specs, char limits
  BUTTONS.md            — Button authoring rules: variant/size selection, width, placement, labels
  source/supernova/     — raw Supernova doc pages (source of record for authoring rules)
templates/              — starting points consuming projects can copy
assets/
  fonts/                — Poppins Regular/Medium/SemiBold/Bold, Nunito Sans, Palmer Lake Print
  icons/, images/       — SVG icons, hero imagery, brand glyphs
readme.md               — this file
SKILL.md                — agent skill descriptor
```

Icons are not files: `pds-icons.css` defines each `pds-svg-*` glyph as an inline-SVG CSS mask, so an icon takes its colour from the rule (or from a `pds-*__icon` override class) and makes no network request.

---

## Components

| Component | Classes | Source view |
|---|---|---|
| `Carousel` | `pds-carousel`, `pds-carousel-block__*` | generic wrapper, pattern from `pds-me-dashboard__carousel-*` — **wrap any row of repeating cards in this** (coupons/deals, products, recipes); never lay them out in a
| `PromoBanner` | `pds-promo-banner*` | `content/banner-carousel.html`, `content/carousel-banner-unit-medium.html` — medium (text-plate + image) and hero (full-bleed) merchandising banners; wrap a row in `Carousel` |
| `BundleCard` | `pds-bundle-card*` | `content/bundles-carousel.html` — meals bundle card with price bug; wrap a row in `Carousel` | plain flex/grid row |
| `Button` | `pds-btn` | `buttons-pds.html` |
| `IconButton` | `pds-icon-btn` | `icon-buttons-pds.html` |
| `ClipButton` | `pds-clip-btn` | `clip-button-pds.html` |
| `Chip` | `pds-chip` | `chips-pds.html` |
| `Tag` | `pds-tag` | `tag-pds.html` |
| `AccentTag` | `pds-accent-tag` | `accent-tag-pds.html` |
| `Checkbox` | `pds-checkbox` | `checkbox-pds.html` |
| `Radio` | `pds-radio` | `radio-buttons-pds.html` |
| `Switch` | `pds-switch` | `switch-pds.html` |
| `InputField` | `pds-input-field` | `input-field-pds.html` |
| `QuantityStepper`, `AddToCartButton` | `pds-quantity-stepper` | `quantity-stepper-pds.html` |
| `Dropdown` | `pds-dropdown` | `pds-dropdown.html` |
| `Accordion` | `pds-accordion` | `accordion-pds.html` |
| `MessageBar` | `pds-message-bar` | `message-bar-pds.html` |
| `Toast` | `pds-toasts` | `toasts-pds.html` |
| `Modal` | `pds-modal` | `modal-pds.html` |
| `Card`, `CardHeadline`, `CardGroup` | `pds-card` | `pds-card.html` |
| `HeroCard`, `HeroCardCarousel` | `pds-card-container--hero`, `pds-card-carousel` | `pds-card.html` — PDS Hero Card (double-carousel "Buy it again" grid demo not ported, per user request). Authoring rules: `guidelines/BENTO-CARDS.md` |
| `Coupon` | `pds-coupon` | `pds-coupon.html` |
| `ImageContainer` | `image-container-pds` | `image-container-pds.html` |
| `AnimationContainer` | `pds-animation-container` | `animation-container-pds.html` |
| `ProgressBar`, `Spinner`, `Skeleton` | `pds-loading-*` | `loading-progress-patterns-pds.html` |
| `ProductCard` | `pc`, `product-comp-v1`, `product-coupon` | `components/ecom/responsive-product-cards.html` |
| `BentoProductCard` | `pds-card-container`, `pds-accent-tag`, `pds-tag` | `pds-card.html` — PDS Card Media, Compact/Expanded Variations (use only when explicitly requested) |
| `FilterPanel`, `FilterGroup` | `pds-filter-panel`, `pds-filter-group` | Search — Current State Screens.fig — search results left filter rail |
| `AccountNav` | `pds-account-nav` | Account - Claude design test.fig — Frame 61800, My Account left rail |
| `Family` | `pds-me-dashboard__family-*` | `custom-components/me-dashboard-family-pds.html` |
| `Profile` | `pds-me-dashboard__profile-*`, `profile-banner*` | `custom-components/me-dashboard-profile-pds.html` |
| `Preferences` | `pds-me-dashboard__preferences-*` | `custom-components/me-dashboard-preferences-pds.html` |
| `Celebrations` | `pds-me-dashboard__celebrations-*`, `pds-me-dashboard__web-purchases` | `custom-components/me-dashboard-celebrations-pds.html` |
| `UserHeader` | `pds-me-dashboard__new-header`, `__header-greeting`, `__header-stats*` | `custom-components/me-dashboard-new-header.html` |
| `DealCard` | `coupon-item-tag`, `grid-coupon-*` | `components/loyalty/coupon-item.html` |
| `MealsRecipeCard` | `meals-card`, `meals-card__*` | `components/meals-and-recipes/meals-and-recipes-card.html` |
| `GlobalNav` | `p_nav`, `s_nav`, `t_nav` | `components/navigation-engine/global-nav.html` |
| `ThemeSwitcher` | n/a — infra utility, not ported from the repo | n/a |
| `Illustration` | n/a | Pantry Illustrations.fig — 112 product/empty-state/ForU/seasonal illustrations, `<Illustration name="…"/>`, browse in Pantry Components → Illustrations |

## Retired components

`components/retired/dk2/` ports the legacy "DK2 CommonComponents" Figma file — Avatars, Buttons,
Carousel-Indicator, Checkboxes, Dropdowns, Labels, MapPins, Pills, Radio-Buttons, Search-Inputs,
Switch-Toggle, Text-Fields, Text-Links, Toasts-inline-messages. All prefixed `Retired*`. **Do not use
in new work** — see the Retired card group (`retired.card.html`) for the mapping to each active
Pantry replacement (e.g. `RetiredRegularButton` → `Button`, `RetiredCheckboxWithLabel` → `Checkbox`).
If a design references one of these, swap in the active component instead.

All retired exports (icons sub-parts included): RetiredAlert3, RetiredApplyButton, RetiredArrowRight6, RetiredBIACard, RetiredBookmark, RetiredButtonStyleDropdown, RetiredCaretDown4, RetiredCart11, RetiredCheckbox, RetiredCheckboxWithLabel, RetiredCheckmark3, RetiredCheckmarkCircle2, RetiredClear2, RetiredClose4, RetiredClose7, RetiredControlRadioButtonWithLabel, RetiredError3, RetiredFavorite3, RetiredGlobalSearch, RetiredInfo5, RetiredLabel, RetiredLabels, RetiredMapPin, RetiredOldInlineNotification, RetiredPill, RetiredPlus5, RetiredPlus7, RetiredRadioButton, RetiredRefresh2, RetiredRegularAvatar, RetiredRegularButton, RetiredSearch5, RetiredSpinner2, RetiredSwitch, RetiredTextFieldWithButton, RetiredTextFieldtemplate, RetiredTextLink, RetiredToastTemplateWhite, RetiredWarning2 — all retired, none for new use.

Typography is delivered as utility classes rather than components: `heading-*`, `text-*`, `link-*`, `eyebrow-*` (see `pds-typography.css` and the Type cards).

Animation presets (`pds-slide--*`, `pds-enter-exit--effects--*`) come from `animation-presets-pds.html`.

---

## Not yet ported

The rest of the `custom-components/` subfolder of `app/views/pantry-components/` — the Me-dashboard's wallet, pets, recent search, and account security cards — plus survey, video player, marketing card, list card, bundle, colour picker, perks panel, customize modal, and the custom-cake right drawer. `Family`, `Profile`, `Preferences`, `Celebrations`, and `UserHeader` are the custom-components/ views ported so far. These are page-level compositions built from the components above.

`pds-logos.html` and `pds-icons.html` also reference the ForU and FreshPass logo sets, which live as separate SVG assets in the source repo and are not bundled here yet.
