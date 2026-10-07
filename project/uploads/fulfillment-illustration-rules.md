# Fulfillment Illustration Rules

Spot illustration standard for Albertsons fulfillment products (AcuPick, Fulfillment Central, Partner Pick, Last Mile, Storefronts).

Source: Figma file "Illustrations + Icons WIP (Kelly)", page "AcuPick Explorations" (file key `ta2Ouz1tFFn2LkFd2V3aWg`). Compiled 1 September 2026.

Tags: `[C]` confirmed, read directly from the file. `[I]` inferred from the artwork, defensible but not written down anywhere. `[O]` open, the file contradicts itself.

---

## 1. What this is

Flat vector shapes with no outlines, inside a filled circle, drawn straight-on with no perspective. Rounded, generous forms built from few large shapes. Depth from one darker shade of the same hue. Subject is a literal grocery or work object and crops at the circle edge. Only hands and forearms appear, never faces. Calm and competent, not playful.

Covers spot illustration only. UI icons are a separate unresolved track (section 11).

## 2. Geometry

- `[C]` Master artboard 128 x 128 px, square. The container component is named `Illustration/128x128`.
- `[C]` Container circle fills the artboard edge to edge. No padding between circle and bounding box.
- `[I]` Safe area is the inner 88% of the diameter (112 px at 128). Anything that must stay readable lives inside it. Decorative parts may cross it and crop.
- `[I]` Status badge is 38% of container diameter. Measured from a 47.2 px badge on a 124 px container.
- `[I]` Below 90 px, use an icon instead. The style stops resolving.

### Sanctioned use sizes

| Size | Context | Evidence |
| --- | --- | --- |
| 90 px | Home card thumbnail | `Illustration/128x128` instanced at 90 in Home 1.2 |
| 124 px | Modal, instructional | Fulfillment Central login set, Scan a Tote modals |
| 150 px | Empty state | "No storefronts exist yet" group |
| 160 px | Feature card | `_Ratio1:1/Flash2` instances |
| 249 px | Full-screen moment | `_Ratio1:1/Flash2` large instances |

### Empty state layout

`[C]` Illustration 150 x 150, centered. 24 px gap to caption (measured 23.44). Caption is one centered line, about 20 px, in `#2A2928`. No button inside the illustration block.

## 3. Color

**The governing palette is Fulfillment Brand Guidelines 2023. Existing artwork does not use it.** The shipped illustrations are built from UMA design system tokens (`Support Color/*`, `Common/Neutral/*`, `Blue/Primary/*`). Sampling an existing illustration gives you an off-palette color. Use the values below.

`[C]` The brand palette swatch labeled `#431AA` is a typo, five digits. Its actual fill is `#4381AA`, bound to `pds/global/color/general/blue/50`. Fix the label in the file.

### Governing palette

| Hex | Name | Role `[I]` |
| --- | --- | --- |
| `#004488` | Deep blue | Primary structure: totes, containers, device bodies |
| `#172F40` | Ink navy | Darkest value: screens, deepest shade step |
| `#4381AA` | Mid blue | Second value on any blue form |
| `#72A4C5` | Light blue | Highlight plane, secondary surfaces |
| `#A4C9E2` | Pale blue | Cool container disc |
| `#78C250` | Green | Produce, fresh, completion |
| `#FAB585` | Warm orange | Warm container disc, bags, baked goods |
| `#F47876` | Coral | Attention, exception, heat |
| `#63AD7C` | Tertiary green | Variety within a green subject |
| `#65D2F2` | Tertiary cyan | Chilled, refrigerated cues |
| `#A593DE` | Tertiary violet | Frozen cues |
| `#E58282` | Tertiary rose | Meat, hot, soft attention |

Hex values `[C]`. Role assignments `[I]` — the brand deck gives colors, not jobs.

### Retained from UMA

The brand palette has no neutrals and no skin tones. These eight stay and are the only exceptions.

| Token | Hex | Use |
| --- | --- | --- |
| Secondary / Almond | `#FAF8F7` | Default neutral container disc |
| Common/Neutral N300 | `#F1F0EE` | Paper, labels, white objects in shade |
| Common/Neutral N400 | `#DDD9D5` | Neutral second value |
| Common/Neutral N500 | `#AFAEAC` | Disabled and inactive subjects |
| Common/Neutral N800 | `#2A2928` | Barcodes, device bezels, type inside artwork |
| Support Color D/D30 | `#CDA890` | Skin, mid tone |
| Support Color D/D10 | `#E8E1DC` | Skin light, warm ground shadow |
| Pure white | `#FFFFFF` | Device screens, badge keyline, paper highlight |

### Color rules

- `[I]` Maximum six fills per illustration, not counting white and the container disc.
- `[I]` The container disc is a tint, never saturated. Cool subjects `#A4C9E2`, warm subjects `#FAB585`, everything else `#FAF8F7`.
- `[I]` Shading is one step in the same hue. Pick the base from the palette, pick the next darker palette value in the same family. Do not generate an intermediate value.
- `[C]` No gradients anywhere. Every sampled fill is solid.

## 4. Temperature zones

`[C]` Four functional colors, named in the UMA palette and applied to both tote and container disc in the Scan a Tote set. Not decorative, not interchangeable.

| Zone | Code | Hex |
| --- | --- | --- |
| Ambient green | AM | `#69BB86` |
| Chilled blue | CH | `#59C4FF` |
| Frozen purple | FZ | `#6B82FF` |
| Hot red | HT | `#F17E92` |

`[I]` When an illustration is zone-specific, change one element — the tote or the disc, not both at full strength. The annotation in the file asks for the tote to carry it.

### Status colors

`[C]` Badge only. Never a subject fill.

| Meaning | Hex | Glyph |
| --- | --- | --- |
| Success | `#1A875B` | Check, white, rounded caps |
| Error | `#C74E4E` | Cross or exclamation, white |
| Warning | `#F69E37` | Exclamation in triangle, dark ink |

## 5. Form language

- `[C]` No strokes on any illustration shape. Separation by value contrast. Lines that appear are filled shapes: barcode bars, a bag fold, a cart handle.
- `[I]` Corner radius about 6–8% of the shape's shorter dimension. No hard 90-degree corners except barcode bars and screen edges.
- `[I]` Straight-on or slightly raised view. No perspective, no vanishing point. A tote is a front face plus a top plane.
- `[I]` Ground shadow is a flat ellipse in `#E8E1DC`, 55–65% of subject width. Used in empty states, optional elsewhere.
- `[I]` Sparkles are filled four-point stars, no outline. Max two, unequal sizes, off the subject's main axis. They mean fresh or done, not decoration.
- `[I]` Low detail budget. A grocery bag is about five shapes. Nothing under about 6 px at 128.

## 6. People and hands

- `[I]` Hands and forearms only. No face, head, or full figure appears in any illustration set sampled (Scan a Tote, Fulfillment Central, Last Mile, Home Cards, empty states). The canvas is too large to claim this for every artboard, but the pattern is unbroken across the shipped work. Do not introduce one.
- `[C]` Every subject ships a hand variant and a no-hand variant. The file consistently pairs "Option 1 — w/ hand" with "Option 2 — w/o hand." The hand version implies an imminent action; the object-only version is for reference and empty states.
- `[C]` The hand exists to hold the device. It grips a handheld scanner or phone. It never gestures, points, or waves.
- `[C]` Sleeve color matches the person illustration. File note: "update the sleeves and background color to match the person illustration."
- `[O]` Skin tone set unresolved. See section 11.

## 7. Composition

- `[I]` Subject fills 70–85% of the circle's width. Small subjects floating in a large disc read as unfinished.
- `[I]` Crop at the circle, do not shrink to fit. A tote's base, a bag's bottom, a car's wheels run past the container and clip. This is the most reliable tell of the style.
- `[I]` Optical center, not geometric. Weight slightly below the midpoint so the subject reads grounded.
- `[I]` One subject per illustration. Stacked objects read as one mass, not as competing subjects.
- `[C]` Give overlapping elements room. File note: "shrink 2 bubbles, more padding around it." Shrink the overlapping element rather than crowding it.

## 8. Subject matter

Consistently literal: the object the picker actually handles. Totes, grocery bags, produce, a prescription bag, a clipboard, a delivery car, a barcode label, a handheld scanner, a shelf.

- Draw the object in the user's hands. "Scan ambient tote TTA01" shows a tote and a scanner, not a magnifying glass or a checkmark.
- When no object exists, use a concrete place or fixture. Empty states and configuration screens reach for a desert plant or a gear.
- Never illustrate the interface. No cursors, buttons, or dialog boxes inside the artwork. A barcode on a device screen is allowed because the device is the object.
- Abstract metaphor appears exactly once in the file (cactus for an empty storefront list) and only where no literal object exists.

## 9. Naming and export

- `[C]` Component naming is `_Ratio1:1/<SubjectName>`. Existing: `_Ratio1:1/Flash2`, `_Ratio1:1/GroceryBag4`, `_Ratio1:1/SameDayDelivery`, `_Ratio1:1/Create`, `_Ratio1:1/Health Screenings`. Subject in PascalCase.
- `[I]` Numeric suffixes mean iteration, not variant. `GroceryBag4` is the fourth attempt, not the fourth kind of bag. Retire the losers.
- `[I]` Export SVG. Flat solid fills, no strokes, no gradients, no masks where a boolean will do.
- `[I]` Flatten the crop. Several illustrations ship as mask groups. Prefer boolean-trimmed paths so the SVG has no clip dependency.

## 10. Acceptance checklist

A no on any of these sends the illustration back.

1. Drawn on a 128 x 128 artboard with the circle at full bleed?
2. Zero strokes on every shape?
3. Every fill traceable to the governing palette or the eight retained UMA values?
4. Six or fewer fills, excluding white and the container disc?
5. Subject fills 70–85% of the circle and crops at the edge?
6. Shading limited to one darker step per hue, no gradients?
7. No face, head, or full figure?
8. Both a hand and a no-hand variant exist?
9. If temperature-specific, does the zone color match AM / CH / FZ / HT exactly?
10. Legible at 90 px, with nothing smaller than about 6 px at master size?

## 11. Open decisions

**Status badge placement.** The Fulfillment Central set puts the badge in three different places across five illustrations: bottom-center, bottom-right, and overlapping the subject's lower-left. Size is consistent at 38% of diameter; position is not. Recommendation: lock to the 4 o'clock point, badge center at 76% / 76% of the container box, on a 4 px container-colored keyline.

**Skin tone set.** The file asks for multiple skin tones and shows variants, but only `#CDA890` (Support Color D/D30) appears as an applied style, with `#E8E1DC` (D10) marked "background only." Either the variants use untokenized fills or the set was never formalized. Recommendation: define three named tokens — light, mid, deep — and specify which ships by default. Until then no rule here is enforceable.

**Icon style direction.** The file states the choice and never resolves it: "Style 1 (Current) — thick and rectangular" against "Style 2 (Redesign) — thin and rounded," with a later note asking for "thicker stroke." Those pull opposite directions. Icons stay out of scope until one wins.

**Palette migration.** The Fulfillment brand palette governs, but every shipped illustration uses UMA tokens. `#3997EF` to `#004488` is a real perceptual change, and the temperature-zone colors have no brand-palette equivalent, which is why they are retained as functional exceptions. Decide: re-color the existing library in one pass, or apply the new palette to new work only and accept a mixed library.

---

## 12. Prompt block

Paste into an image model, a coding agent, or a system prompt.

```
ILLUSTRATION STYLE: Albertsons Fulfillment spot illustration.

FORMAT
- Square artboard 128x128. Circle fills the frame edge to edge, no padding.
- Flat vector. SVG. Solid fills only.
- Safe area: inner 88% of diameter.

FORM
- NO strokes or outlines on any shape. Separation by value contrast only.
- NO gradients, drop shadows, texture, grain, or noise.
- Straight-on or slightly raised view. No perspective, no isometric, no horizon.
- Rounded corners, radius about 6-8% of the shape's shorter side.
- Low detail: a grocery bag is about five shapes. Nothing under 6px at 128.
- Depth = base fill plus exactly one darker step of the same hue. Never more.
- Optional ground shadow: flat ellipse, #E8E1DC, 55-65% of subject width.
- Optional sparkles: filled four-point stars, max two, unequal sizes.

COMPOSITION
- Subject fills 70-85% of circle width and CROPS at the circle edge.
- One subject only. Weight slightly below geometric center.
- Container disc is a tint behind everything: #A4C9E2 cool, #FAB585 warm,
  #FAF8F7 default. Never saturated.
- Optional status badge at 38% of container diameter, 4 o'clock position,
  on a white keyline.

COLOR (use these values, do not invent)
- #004488 deep blue, #172F40 ink navy, #4381AA mid blue, #72A4C5 light blue,
  #A4C9E2 pale blue, #78C250 green, #FAB585 warm orange, #F47876 coral,
  #63AD7C, #65D2F2, #A593DE, #E58282
- Neutrals and skin: #FAF8F7, #F1F0EE, #DDD9D5, #AFAEAC, #2A2928,
  #CDA890 skin, #E8E1DC skin light, #FFFFFF
- Max 6 fills per illustration, excluding white and the container disc.
- Temperature zones are functional, exact, non-negotiable:
  AM ambient #69BB86, CH chilled #59C4FF, FZ frozen #6B82FF, HT hot #F17E92
- Status only: success #1A875B, error #C74E4E, warning #F69E37

PEOPLE
- Hands and forearms only. NO faces, heads, or full figures, ever.
- The hand grips a handheld scanner or phone. It never gestures or points.
- Produce a with-hand and a without-hand variant of every subject.

SUBJECT
- Draw the literal object the warehouse or store picker handles: tote,
  grocery bag, produce, prescription bag, barcode label, shelf, delivery car,
  handheld scanner, clipboard.
- Use a concrete place or fixture only when no object exists.
- Never draw UI chrome: no cursors, buttons, dialogs. A barcode on a device
  screen is allowed because the device is the object.

TONE
- Calm and competent. Not playful, not whimsical, not cute.
```

---

## Source artboards

- Page: [AcuPick Explorations](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2-7)
- [Fresh Palette (UMA)](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2-58367)
- [Brand Colors (Fulfillment 2023)](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2480-71882)
- [Scan a Tote Illustration](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2-101809)
- [Fulfillment Central Login Illustrations](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2313-76390)
- [Last Mile Illustrations (drafts)](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=2248-70993)
- [Home Card States](https://www.figma.com/design/ta2Ouz1tFFn2LkFd2V3aWg/Illustrations---Icons-WIP--Kelly-?node-id=59-32383)
