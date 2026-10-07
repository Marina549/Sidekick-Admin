# Prompts & Evals Redesign

_Started 2026-10-06 16:44 UTC_

---

## User

Redesign the **Prompts & Evals** page to create a clearer file-management experience while maintaining the existing product’s visual style, design system, navigation, colors, typography, and spacing conventions.

### 1. Organize the page into 5 categories

Create clearly separated sections for:

1. **Prompt Templates**
2. **KB Articles**
3. **Thresholds**
4. **Evals**
5. **MD Files**

The categories should feel consistent and easy to scan. Use your UX judgment to determine whether sections, cards, accordions, or another scalable pattern works best.

### 2. Add file upload functionality to every category

Each category should include its own **drag-and-drop / upload file area**.

The upload area should:

- Clearly communicate that users can drag and drop files or browse to upload.
- Feel lightweight and integrated into the page rather than visually overpowering the uploaded content.
- Follow the existing design system and spacing conventions.
- Include appropriate upload states such as empty, uploading, success, and error if needed.

### 3. Show uploaded files under the appropriate category

After files are uploaded, display them directly within their corresponding category.

For every uploaded file, show:

- **File name**
- **File size**
- **Upload date**
- **Uploaded by**
- Appropriate file type/icon where useful

Provide actions for:

- **Preview**
- **Download**
- **Remove**

Keep secondary actions visually subtle so the file name and metadata remain the primary information.

If there are multiple files, design the layout so it remains easy to scan and manage as the list grows.

Include an appropriate confirmation step before permanently removing a file.

### 4. Update the Review & Submit page

Update file management sections under "Prompts and Evals" on the  the **Review & Submit** page so it reflects this new structure.

The review experience should:

- Show all 5 categories.
- Clearly indicate which files have been added to each category.
- Display relevant file names and essential metadata without making the page overly dense.
- Clearly show categories that do not contain any uploaded files.
- Allow users to easily identify anything missing before submitting.
- Preserve the existing Review & Submit flow and primary CTA hierarchy unless a change is necessary to support this new structure.

### UX expectations

- Keep the experience simple, modern, and easy to scan.
- Avoid creating five visually heavy upload components that make the page feel repetitive.
- Establish a strong hierarchy between category title, upload action, uploaded files, and file-level actions.
- Use consistent interaction patterns across all categories.
- Follow existing spacing conventions such as 8, 16, 24, 32, and 40px.
- Maintain accessibility and clear hover, focus, disabled, loading, error, and confirmation states.
- Do not unnecessarily redesign unrelated parts of the experience.
- Reuse existing components from the current design system whenever possible.
- Make thoughtful UX improvements where needed rather than simply placing new controls into the existing layout.

Create the updated **Prompts & Evals page** and the corresponding **Review & Submit page**, including realistic examples of uploaded files so the final states are easy to evaluate.

## Assistant

_[tool: read_file]_

_[tool: list_files]_

_[tool: fig_ls]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: fig_ls]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: fig_ls]_

_[tool: fig_read]_

_[tool: list_files]_

_[tool: bash]_

_[tool: list_files]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: dc_set_props]_

_[tool: show_html]_

_[tool: ready_for_verification]_

I've redesigned the Prompts & evals page and the Review & submit page in `Sidekick Admin.dc.html`, but I haven't opened or checked either page yet. A background check is running and will report back only if it finds problems.

**Prompts & evals**
- **Layout:** the five categories (Prompt Templates, KB Articles, Thresholds, Evals, MD Files) are collapsible sections. Each has a file-count tag in its header, and there's an Expand all / Collapse all link.
- **Upload area:** each category has one compact dashed upload strip. It's a bit larger when the category is empty and shrinks to a single line once files are added. You can drag files onto any category, or use Browse files.
- **File list:** a table with file name, size, upload date and uploaded by. Preview, Download and Remove are small grey icon buttons that tint on hover. A list shows 5 files at a time, with a "Show N more files" link beyond that.
- **Upload states:** empty, drag-over, uploading (progress bar with a cancel button), uploaded (row briefly tinted green), and error (red row you can dismiss). Errors cover wrong file type, files over 10 MB, and duplicate names. MD Files accepts only `.md`.
- **Removing a file:** a confirmation dialog first, then a toast.

**Review & submit**
- The Prompts & evals section lists all five categories with their files, each showing size, upload date and uploader, plus Preview and Download. It shows 3 files per category before "Show N more files".
- Empty categories have an amber "No files added" tag, a tinted row and an "Add files" link back to that category. An amber note at the top names what's missing. The header shows "N of 5 categories have files".
- Submit and the footer buttons are unchanged. Submit stays enabled with empty categories and only needs at least one file overall. That was my call, so say if any category should be required.

**Sample data and tweaks**
I added a sample draft, "Late order recovery", that opens straight to the page. Thresholds is empty, Evals has 7 files (so the "Show more" link appears), and KB Articles has an error row. Two Tweaks control what you see:
- **Start screen:** jump to Prompts & evals, Review & submit, or Home.
- **Sample files:** turn off to see all five categories empty.

The 10 MB limit and the one-line category descriptions are my own wording and values, so confirm or replace them. The "Remove file" button in the confirmation uses the standard filled button because the design system has no destructive variant.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed both issues the check found, in `Sidekick Admin.dc.html`. I haven't looked at the pages myself, and the re-check is still running.

- **Icons:** the preview, download, remove, close, chevron, info, check and upload glyphs were drawing as solid blocks. They're now embedded in the file itself, so they take their colour from the surrounding text and recolour on hover. The Review & submit rows use the same fix.
- **File names:** they were being cut to about four characters. The file table now has four columns (name, size, uploaded, actions), with the uploader shown under the date. The name column gets the leftover width, with a 160px floor.

I'll look for the console errors the check saw on first load, which looked like a one-off after the Tweaks update.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

I fixed the row icons in `Sidekick Admin.dc.html`. The preview, download, remove, cancel and dismiss buttons, the error and "Uploaded" icons, and the Review & submit icons were still drawing as solid squares. The page's style parser was cutting each embedded icon at a semicolon in its encoding. I re-encoded them without semicolons. The category chevrons and upload glyph already worked.

A re-check is running. I haven't viewed the page myself.

## User

Start with the empty state on the Prompts & evals. Do not use boarder lines. Instead separate by sections taking title outside the area on the beige background for each section. Do not color code (unless there's an error) or put the names of the files in the squire box. However keep the names of the uploaded files. 
Error should not be uploaded  - it should be resolved while uploading and not added to the uploaded section.

## Assistant

_[tool: run_script]_

_[tool: run_script]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

I've applied your changes to the Prompts & evals page and the Review & submit page in `Sidekick Admin.dc.html`. I haven't looked at either page myself, and the background check is still running.

- **Empty by default:** the page now opens with all five categories empty. To see example files in each category, turn on the "Sample files" tweak.
- **Sections, no border lines:** each category title, description and file count now sit on the beige background, with the white area underneath holding the files and upload area. The dashed outlines and row dividers are gone; the file rows are separated by spacing.
- **Colour and file icons:** the green and amber tags and the coloured file-type squares are gone. File names now sit beside a plain grey file icon with no text inside it. Red appears only for errors, and a red outline appears only while you drag files over a category.
- **Errors never reach the file list:** a wrong file type, a file over 10 MB or a duplicate name shows a red message under that category's upload area ("file.xlsx couldn't be uploaded…"). You can dismiss it, and it clears on the next upload attempt. Turning on "Sample files" also shows one example error under KB Articles.
- **Review & submit:** I made it match, with no borders or colour. Categories with no files show a plain "No files added" with an "Add files" link, and the missing-files note now uses the blue info style the page already had.

## User

Use dotted line from the previous design around the Drag and Drop files. Inside the box should be white.  Make sure "Browse files" button copy is centered inside the button. Prompt templates, KB articles, Thresholds, Evals , MD files titles should be smaller. Remove "Collapse all" link and "Upload at least one file to continue." line. However keep Next button disable until at least 1 file uploaded.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

All five changes are in `Sidekick Admin.dc.html`. I haven't looked at the page myself, and a background check is running.

- **Drag-and-drop area:** it has the dotted outline again, and the inside is white.
- **Browse files button:** it now sits in a fixed 128px slot, which should centre the label.
- **Category titles:** they're now 16px instead of 20px.
- **Removed:** the "Collapse all" link and the "Upload at least one file to continue." line. The file-count summary now only appears once files have been uploaded.
- **Next button:** it stays disabled until at least one file has finished uploading.

## User

Review the experience globally and make the following UI refinements. **Keep the existing design system, colors, typography, components, and overall page structure unless specifically requested below.**

### 1. Fix CTA / button text alignment globally

Review **all CTA buttons throughout the experience** and adjust their internal spacing so the button labels appear visually centered vertically.

- The text currently appears slightly too high in some buttons.
- Give the **top padding slightly more space where needed** to achieve optical vertical centering.
- Keep button heights and sizing consistent with the existing design system.
- Apply this consistently to primary, secondary, tertiary, modal, and other button styles.
- Do not change button colors, typography, or hierarchy.

### 2. Remove section-level interaction strokes

When a user interacts with, clicks, selects, or focuses within a section, **do not add a blue stroke or any other colored border around the entire section/container**.

The section should maintain its normal visual appearance during interaction.

Keep appropriate hover/focus feedback on the **specific interactive control** when necessary for accessibility, but do not visually outline the whole content area.

### 3. Update “Prompts & Evals” on Review & Submit

On the **Review & Submit** page, update the way files are presented under **Prompts & Evals**.

Use the same **clean structure and visual treatment already established in the “Data & Schema” section** as the reference.

For Prompts & Evals:

- Keep files organized under their appropriate categories.
- Avoid placing every file inside a separate heavy card or section.
- Use **subtle/light divider strokes between individual files or rows** instead.
- Maintain clear hierarchy between category names, file names, and file metadata.
- Keep spacing, typography, alignment, and density consistent with **Data & Schema**.
- The result should feel like one cohesive section rather than a collection of nested boxes.

### 4. Increase bottom spacing in modals

Review **all pop-up/modal dialogs** throughout the experience.

Increase the vertical space **below the modal action buttons and before the bottom edge of the modal**.

- The footer currently feels too tight.
- Give the buttons more breathing room at the bottom.
- Keep spacing consistent across all modals.
- Maintain the existing button alignment and modal structure.

### 5. Update “Submitted for Review” confirmation

On the **Submitted for Review** confirmation screen, add a secondary action:

**Back to Dashboard**

- Keep the existing primary action as the dominant CTA.
- Style **Back to Dashboard** as a secondary button.
- Position it naturally with the existing confirmation actions.
- Follow the existing button hierarchy and spacing conventions.

### Overall expectations

Apply these updates consistently across the **entire prototype**, not just the currently visible screens.

Do not introduce unnecessary visual redesigns. The goal is to improve **spacing, consistency, hierarchy, and polish** while preserving the existing experience and design language.

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: run_script]_

_[tool: run_script]_

_[tool: ready_for_verification]_

All five refinements are applied in `Sidekick Admin.dc.html`. I haven't looked at the pages myself, and the background check is still running.

1. **Button labels:** I added 3px of top padding to every design-system button. This covers the footer buttons, modal buttons, the Browse files buttons and the schema table's small buttons. Heights, colours and fonts are unchanged. If the labels still look a touch high or low, the value is easy to adjust.
2. **No section outlines:**
   - Dragging files over a category no longer outlines the whole area, and the drop box only changes its fill.
   - The blue frame around the Tables drop area is gone. It used to stay on once any table was added.
   - Category headers no longer show an outline when clicked with the mouse, only when focused with the keyboard.
3. **Review & submit:** Prompts & evals now follows Data & schema: one bordered box with a grey header ("9 files uploaded" and "4 of 5 categories have files"). Inside, each category has its files separated by light dividers, and no file sits in its own card. Empty categories still show "No files added" with an "Add files" link.
4. **Modals:** the space under the buttons is now 48px in all three modals (file preview, request changes, remove file).
5. **Submitted for review:** I added an outlined "Back to Dashboard" button next to "Add another entity", which stays the filled primary.

## User

Remove the header row on Review & submit page under Prompts and Evals.

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I removed the grey header row ("N files uploaded" and "N of 5 categories have files") from Prompts & evals on Review & submit. The category list now starts straight away. The page loads with no console errors, but I haven't looked at it on screen.

