# Sidekick Admin: handoff for Claude Code

Read this file first. It describes a working React implementation of the **Sidekick Admin** design (Albertsons / Pantry Design System) and how to run it, extend it, or port it into another codebase.

## What this is

Sidekick Admin is an internal tool for managing the "entities" Sidekick can answer questions about. An entity is a category, a data source, its tables and field descriptions, and supporting files (prompts, KB articles, thresholds, evals, Markdown context). New entities and edits go through an approval workflow.

- **Design source:** `project/Sidekick Admin.dc.html` (Claude Design prototype; latest revision from `Sidekick Admin-handoff_1.zip`). The earlier design history is in `chats/chat1.md` to `chats/chat3.md`; the latest revision came without chats.
- **Implementation:** `app/`, which is React 19, Vite 8 and TypeScript 5.9. There's no backend: state lives in memory and uploads are simulated.

## Run it

```sh
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build; must pass with no errors
```

The app opens on an **empty Entity dashboard**, as in the design. Add `?sample` to the URL (e.g. `http://localhost:5173/?sample`) to start with example entities and the "Late order recovery" draft.

Live demo (GitHub Pages, redeployed on every push to `main`): https://marina549.github.io/Sidekick-Admin-repo/

## File map (`app/src`)

| File | Purpose |
|---|---|
| `main.tsx` | Entry point. Imports the CSS in this order: `pds/index.css`, then `styles/*.css`. |
| `App.tsx` | Shell: header, side nav, the screen switch, modals and toast. |
| `store.tsx` | `AdminProvider` / `useAdmin()`. All state and actions: navigation, drafts, uploads, submit, approve, request changes. |
| `data.ts` | Types, seed entities, constants (categories, sources, tables, statuses, file categories) and pure helpers (`step1Missing`, `step2Missing`, `plural`, `sizeText` and others). |
| `icons.ts` | Mask-icon data URIs, copied verbatim from the prototype. |
| `components/pds.tsx` | Typed ports of the Pantry `Button`, `Modal`, `Toast` and `ProgressBar`. They use the same markup and class names as the PDS bundle. |
| `components/Header.tsx` | Logo, bell with red dot and notifications popover, user switcher. |
| `components/SideNav.tsx` | Side nav, 88px collapsed and 320px expanded. Icons stay at the same x position in both states. |
| `components/Breadcrumbs.tsx` | Home › Entity dashboard › current page. |
| `components/Select.tsx` | Keyboard-accessible listbox dropdown: small (40px) for filters, medium (48px) for form fields. |
| `components/SchemaTable.tsx` | Field / Description table. Read-only or editable (inline edit, Generate with AI, Add field, delete). |
| `components/Modals.tsx` | File preview, Remove file confirmation, Request changes. |
| `screens/Home.tsx` | Greeting plus 3 cards. Only Entity Dashboard is clickable. |
| `screens/Dashboard.tsx` | Entities card: search, 3 filters, category groups, expandable rows. |
| `screens/Flow.tsx` | Shared layout for the New entity wizard, Edit entity and Review submission, including the stepper and sticky footer. |
| `screens/flow/DataSchemaForm.tsx` | Step 1, and the whole Edit entity form. |
| `screens/flow/PromptsEvals.tsx` | Step 2: 5 file categories. |
| `screens/flow/Summary.tsx` | Step 3 (Review & submit) and the approver's Review & approve screen. |
| `screens/Success.tsx` | Submitted for review screen. |
| `pds/` | Vendored subset of the Pantry DS: tokens, fonts and 7 component stylesheets. Don't edit it. |
| `styles/` | App CSS, with an `sk-` prefix. Hover and focus states live here; one-off layout values are inline. |
| `styles/responsive.css` | Breakpoints copied from the prototype (1199, 1439 with nav open, 1023, 767). Rules target `data-r="…"` attributes on components, which use the same names as the prototype. |

Static assets (logo, illustrations, icons) are in `app/public/assets/`.

## Behaviour to preserve

**Users** (switch from the avatar menu):
- Priya Sethi can submit.
- Gary Spark can submit and approve.

**Entity statuses:**

| Status | Label | Tag colors (background / border / text) |
|---|---|---|
| `published` | Active | `#EAF5F0` / `#97D0B9` / `#04633C` |
| `pending` | Pending review | `#FDF3D9` / `#F8B775` / `#906700` |
| `changes` | Changes requested | `#FDECEC` / `#F0A3A3` / `#B00000` |
| `draft` | Draft | `#F1F0EE` / `#C2C1C0` / `#4B4B49` |

**New entity wizard:**
1. **Data & schema.** Pick a category, an entity (from a predefined list; entities that already exist are disabled) and a data source. Add tables by dragging or clicking them from the right-hand panel. Every field needs a description. Next stays disabled until the step is complete, and no hint text appears next to the button.
2. **Prompts & evals.**
   - There are 5 collapsible categories: Prompt Templates, KB Articles, Thresholds, Evals and MD Files.
   - Each has a dashed drop zone and a Browse files button. Accepted types are `.txt` and `.md`; MD Files accepts `.md` only. The limit is 10 MB per file, and names can't repeat within a category.
   - Invalid files show a red inline error and never reach the file list.
   - The list shows 5 files, then "Show N more files". Removing a file asks for confirmation.
   - Next stays disabled until at least 1 file has finished uploading.
3. **Review & submit.** Shows a summary of both steps with Edit links. Empty categories show "No files added". Submit is enabled with empty categories.

**Wizard footer:** **Back** from step 2 on; **Save as draft** appears once the draft differs from how it was opened (it saves even without a category or entity, grouped under "Uncategorized"); **Delete entity** on the left once the entity exists on the dashboard. Draft rows show "Step N of 3 · step name".

**Categories:** the Category dropdown ends with "+ Create new category", which opens a modal (name required, no duplicates, max 40 characters) and selects the new category. A new category offers every predefined entity. In Edit entity the category can now be changed.

**Fields** have a type (String, Integer, Decimal, Boolean, Date, Timestamp), shown in a Type column. "Add field" includes a type dropdown.

**Files:** only `.txt` and `.md` are accepted. Text files opened from the wizard can be edited in the preview (Edit → Save changes). Closing or cancelling with unsaved edits asks "Discard unsaved changes?". Edited files show "Last edited <date, time> by <name>".

**Request changes → Make changes → Resubmit:**
- When an approver requests changes, the submitter gets a bell notification quoting the comment (approvers get submissions; each user only sees their own notifications).
- "Edit" on a Changes requested entity, or clicking that notification, opens **Make Changes**: the wizard on Review & submit, all steps reachable, the reviewer's feedback in a red box above the stepper, breadcrumb "Make changes".
- Submit stays disabled, with "Make at least one change to submit for review." in the footer, until the entity differs from when changes were requested. Steps 1–2 show **Return to review** instead of Save as draft.
- Leaving with changes keeps them on the entity (still Changes requested). Submitting sets it to Pending review with verb "Resubmitted", and the approver's Review screen notes "Resubmitted after … requested changes: “…”".
- On the dashboard, approvers see a **Review** link (instead of Edit) on Pending review rows; status tags are no longer clickable.
- Toasts sit just above the sticky flow footer.

**Approval info:** approved entities record who approved them and when; it shows in the expanded dashboard row and on Review submission.

**Responsive:** below 1024px the side nav becomes a hamburger + drawer. On phones, breadcrumbs collapse to a back link, rows and file lists stack, file actions move into a "⋯" menu, modals become bottom sheets and footer buttons go full width.

**Leaving the wizard** by any route (breadcrumb, side nav or logo) saves a grey **Draft** row, once a category and entity are chosen. Editing a draft reopens it on the step where it was left. "Add new entity" always starts fresh.

**Submitting:**
- Creates a Pending review entity and a notification.
- Gary's bell shows a red dot. Priya never sees notifications.

**Approving:**
- Gary opens a submission from the bell or with the Review link on its dashboard row.
- **Approve** sets the entity to Active.
- **Request changes** needs a comment. The entity becomes Changes requested, and the comment shows in its expanded row and at the top of Edit entity.

**Edit entity:** Data & schema only (Category can be changed). Save stays disabled until something changes. Saving sends the entity back to Pending review (the button reads "Resubmit for review" if changes were requested).

**Toasts:** Pantry toasts close after 5 seconds, or 8 seconds when they have an action. Deleting a field shows a toast with Undo.

**Escape** closes, in order: the drawer, the file "⋯" menu, the Discard modal, the Create category modal, the Delete modal, the Remove modal, the Preview (asking first if there are unsaved edits), the Request changes modal, then the popovers.

## Design rules (from the user's feedback in the chats)

- **Spacing:** 8px grid (8, 16, 24, 32, 40). The exceptions the user asked for are the 60px gap above the Entities card and the 52px padding under the Entities title row.
- **Theme:** `data-theme="sutro"` (Albertsons blue). Primary is `#004488`, links hover to `#002D56`, and the light blue tint is `#EBF3F9`.
- **Fonts:** Poppins for headings, Nunito Sans for body text.
- **Active form fields:** a single border that turns dark grey (`#4B4B49`), with no blue focus ring. Keyboard focus uses a 2px `#004488` outline (`:focus-visible`).
- **Interaction outlines:** never outline a whole section; only the control being used.
- **PDS buttons:** add `padding-top: 3px` so labels look vertically centred.
- **Modals:** title and close X are vertically centred. Content padding is 32px, with 48px below the buttons.
- **Tags:** no dots, 14px text.
- **Tables:** never scroll horizontally. Status column is at least 136px.
- **Breadcrumbs:** bold, underlined blue links; 1px grey vertical dividers; current page in grey.
- **Removed or changed in the latest design:** the Prompts & evals description line is gone, the file Remove icon hovers blue (not red), upload-error dismiss buttons are grey, and the illustration is `ill-entity-dashboard-v3.png`.

## Known gaps and decisions

- There is no backend or persistence. To wire up an API, replace the actions in `store.tsx` (`submit`, `saveEdit`, `decide`, `addFiles`/`startUpload`, `confirmRemove`).
- Trace Tool and Evaluation (Home cards and nav items) aren't built.
- Changes made relative to the prototype:
  - "No data sources selected" only shows when no source is picked. In the prototype it always showed.
  - The entity being drafted or edited stays selectable in the Entity dropdown.
- `pds/components/pantry/pds-typography.css` has one local patch: a header comment that ended early was reworded. The unused `pds-clip-button.css` was dropped because it has a CSS syntax error.

## Porting into an existing codebase

1. Keep `data.ts` (types and helpers) and `SchemaTable`, `Select` and `pds.tsx` as they are, or map them to the target repo's equivalent components.
2. Replace `store.tsx` with the target's state and data layer, keeping the action names and behaviour above.
3. Use the Pantry package if the target repo already has one. Otherwise copy `app/src/pds/`.
4. Keep the `sk-` CSS classes, or convert them to the target's styling approach (CSS modules, Tailwind and so on), matching the values exactly.
5. Check: `npm run build` passes, and you can click through submit → bell → request changes → edit → approve as Priya and Gary.
