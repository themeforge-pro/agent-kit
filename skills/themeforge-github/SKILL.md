---
name: themeforge-github
description: Work on a ThemeForge site whose source is a GitHub repository — repository layout, commit per change, a tag per release, the read-only key for a private repository, and "Update theme from project" in wp-admin to put the release live. Use when the person keeps a ThemeForge site in GitHub, asks to "release", "deploy the change to WordPress", "roll back to the previous version", or wants a framework of AI-generated sites kept in Git.
---

# Work through GitHub

The WordPress site downloads its source from the repository on every **Update theme from project**.
Git is the single source of truth: what is on the default branch (or the configured branch/tag) is
what the next update builds.

## Repository layout

```
<repo>/
  index.html            ← or all of it inside one folder, e.g. site/
  about.html  …
  theme-options.html    ← site-wide fields (header, footer, contacts)
  css/  js/  images/  fonts/
  README.md             ← optional; files that are not part of a site are ignored by the import
```

- If the site sits in a folder, the same folder is entered once in wp-admin ("Folder of the site
  inside the archive").
- Never commit secrets, `.env` files or private notes: the site downloads the whole repository archive.
- Limits on the site: 100 MB unpacked, 3000 files, 25 MB per file; server code is never imported.

## Every change

1. Edit the pages. Keep the ThemeForge attributes; new sections get attributes as they are written
   (`themeforge-markup` skill; rules at https://themeforge.pro/ai — fetch them, do not rely on memory).
2. Check: `node scripts/validate.mjs <site-folder>` (or `POST https://themeforge.pro/api/validate-markup`).
   Fix every `error`.
3. Commit with a message that says what changed for a visitor ("Support page: block replaced by a
   donate button"), push.
4. Texts and images marked as fields are **content in WordPress**. A change to them in Git does not
   reach a live site — they are edited in the WordPress admin. Say so when the request is about such a text.

## Release

1. Optional but recommended: tag the commit — `git tag release-2026-11-21 && git push --tags`. If the
   site is set to build from a tag, change the tag in wp-admin; if it builds from the branch, the push
   is enough.
2. wp-admin → **Update theme from project**. The log line under the button says "Source downloaded
   from the link (github.com/…): N files" — or "has not changed", which means the push did not land on
   the branch the site builds from.
3. Open the changed pages on the live site.

## Roll back

Revert the commit (`git revert <sha>`), push, **Update theme from project**. Do not force-push over
history: the history is the record of what the site was.

## Private repository and the key

The site holds a **fine-grained token with Contents: Read-only on this repository only** (GitHub →
Settings → Developer settings → Fine-grained tokens). The person creates it and pastes it into
wp-admin → Site source themselves; never ask for it in chat and never store it in the repository.
When it expires, updates build from the last copy on the site and the log says the key is wrong or
expired: create a new key, paste it (remove and connect the link again), update.

## Several sites in one repository

A key cannot be limited to a folder: anyone who can read the key on one site can read the whole
repository. Keep **one repository per client site**. A studio that works in one big repository can
publish each site's folder to its own private repository (`git subtree split --prefix=<folder>` and
push the result) and give each site a key to its own repository only.
