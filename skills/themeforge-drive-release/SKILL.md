---
name: themeforge-drive-release
description: Release a change of a ThemeForge site whose source is a ZIP file in Google Drive — edit the site files, check the markup, upload the new ZIP as a NEW VERSION of the same Drive file (same link), then press "Update theme from project" in wp-admin. Use when the person edits a ThemeForge site kept in Drive and wants the change on the live WordPress site, asks to "publish", "release", "update the site from Drive", or uploaded a new file and the site did not change.
---

# Release a change through Google Drive

The site downloads its source from **one Drive file** on every update. The link is tied to that
file's ID, so a release is always **a new version of the same file** — never a new file.

## 1. Edit and check

1. Work on a local copy of the site folder (unpack the current ZIP from Drive if there is none).
2. Change only what was asked. Keep ThemeForge attributes intact; a new section gets attributes as it
   is written (`themeforge-markup` skill, rules at https://themeforge.pro/ai).
3. Check: `node scripts/validate.mjs <site-folder>` or `POST https://themeforge.pro/api/validate-markup`.
   Fix every `error` before going on.
4. Texts and images marked as fields are **content in WordPress**: a change to them in the source will
   not show on a live site. If that is what the person wants changed, tell them to edit it in the
   WordPress admin instead.

## 2. Pack

Same as the first time, `index.html` at the root of the ZIP:

- macOS / Linux: `cd site && zip -r ../site.zip . -x "*.DS_Store"`
- Windows: `cd site` then `tar.exe -a -c -f ..\site.zip *`

## 3. Upload as a new version — the step that goes wrong

In Drive, on the **existing** file: right click → **File information → Manage versions → Upload new
version** → choose the new `site.zip`. (Dropping a file with the same name into the folder and choosing
**Replace existing file** does the same.)

Then check that the link did not change: open the file's share link — it is the same
`/file/d/<id>/` as before. If a second `site.zip` appeared next to the first, the upload created a
**new file**: the site still downloads the old one. Delete the new file and upload again as a version.

Drive keeps old versions 30 days or 100 versions. For a version worth keeping (a release before a big
change): Manage versions → ⋮ → **Keep forever**.

If you (the assistant) cannot upload to Drive yourself, hand the person the ready ZIP and these exact
clicks; do not ask for their Google password.

## 4. Update the site

wp-admin → **Update theme from project**. Read the log line under the button:

| Log line | Meaning |
|---|---|
| Source downloaded from the link (…): N files | the new version arrived and the theme was built from it |
| Source at the link has not changed since the last update | Drive still serves the old bytes: the upload went to a new file, or Drive has not finished processing — check step 3, wait a minute, update again |
| The link could not be used (…) … built from the last copy | access was turned off or the file was removed; fix sharing (Anyone with the link) and update again |

Finally open the changed pages on the live site and compare with what was asked.
