---
name: themeforge-source-link
description: Connect a WordPress site built with ThemeForge to its source by link — a ZIP file in Google Drive or a GitHub repository — so every "Update theme from project" downloads the current source by itself. Use when the person wants the site's HTML kept in Google Drive or GitHub instead of uploading a ZIP in wp-admin each time, asks how to "connect the source", "update the theme from Drive/GitHub", or moves a ThemeForge site off a builder. Covers packing the ZIP, sharing it, the read-only key for a private repository, the fields in wp-admin and what to check after the first update.
---

# Connect the site source by link

A ThemeForge theme is built from the site's HTML (the **source**). The source lives on the WordPress
site itself; with a link the site downloads it again on every **Update theme from project**, so the
history stays where the person keeps files (Drive versions, Git history) and survives a lost hosting.

Pick the place first and say why in one line:

| Place | Good for | History |
|---|---|---|
| Google Drive — one ZIP file | people without Git | file versions: 30 days / 100 versions, or "Keep forever" on a version |
| GitHub repository | developers, studios, AI agents | full Git history, tags for releases |

## 1. Prepare the source

- The site is plain files: `index.html` and the other pages, CSS, JS, images, fonts. Pages carry
  ThemeForge attributes (if they do not yet, use the `themeforge-markup` skill first).
- Check the markup before every release: `node scripts/validate.mjs <site-folder>` from this kit, or
  `POST https://themeforge.pro/api/validate-markup`. Fix every `error`.
- Limits the site enforces: 100 MB unpacked, 3000 files, 25 MB per file. Server code (`.php` and the
  like) is never imported.

## 2a. Google Drive

1. Pack the **contents** of the site folder into one ZIP, `index.html` at the root (one wrapping
   folder is also fine):
   - macOS / Linux: `cd site && zip -r ../site.zip . -x "*.DS_Store"`
   - Windows: `cd site` then `tar.exe -a -c -f ..\site.zip *` (not `Compress-Archive` in Windows
     PowerShell 5.1 — it writes `\` into paths).
2. Upload `site.zip` to Drive. Share → General access → **Anyone with the link** (Viewer).
   A Drive **folder** link does not work: the site needs one file.
3. Copy the file link (`https://drive.google.com/file/d/…/view`).
4. Tell the person plainly: anyone who has this link can download the archive. It holds page markup,
   not passwords — keep it that way (no keys, no private notes in the ZIP).

## 2b. GitHub

1. The site files at the repository root, or in a folder (e.g. `site/`) — note the folder name.
2. Public repository: nothing else is needed.
3. Private repository: the site needs a **read-only key for this one repository**. GitHub →
   Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token:
   Repository access **Only select repositories** → this repository; Permissions → Repository →
   **Contents: Read-only**; set an expiry and note the date. The person creates the key themselves and
   pastes it into wp-admin — never ask them to send it to you, never write it into a file.
4. Optional: a branch or tag to build from (default: the default branch). A tag per release
   (`release-2026-11-21`) makes every deployed version findable.

## 3. Connect in wp-admin

ThemeForge → **Site source** → **Or take the source from a link**:

- **Link** — the Drive file link or `https://github.com/<owner>/<repo>`
  (a `…/tree/<branch>/<folder>` link fills branch and folder by itself);
- **Folder of the site inside the archive** — only if the site is not at the root;
- **GitHub: branch or tag**, **GitHub: read-only key** — only when needed;
- **Connect and download** — downloads at once. Nothing is saved unless the download and import
  succeed; the message says how many files arrived.

Connecting **replaces** the source on the site with the archive from the link. From then on the
source is edited **only at the link**: editing the markup on the site is turned off, because the next
update would overwrite it. **Remove the link** turns editing on the site back on; the current copy stays.

## 4. First update and checks

1. Press **Update theme from project**. The first step reads "Downloading the source from the link…".
2. Open the update log under the button: the first line says "Source downloaded from the link (…): N
   files" or "has not changed".
3. Open the site: the pages, styles and images are the new ones.

Say this to the person before they rely on it:

- **Texts and images marked as fields are content in WordPress.** Changing them in the source does
  not change a live site — they are edited in the WordPress admin. Do not press "Load data" on a live
  site: it overwrites what the client wrote.
- If the link stops working (access turned off, key expired), the update builds from the last copy on
  the site and the log says why in a yellow line; fix the link and update again.

For every later release use `themeforge-drive-release` (Drive) or `themeforge-github` (GitHub).
