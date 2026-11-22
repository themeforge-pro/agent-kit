# ThemeForge: HTML → WordPress theme

This project's HTML is meant to become a WordPress theme with an editable admin via ThemeForge.

- Before writing markup, agree a site map (page files and slugs, content types, site-wide values for
  `theme-options.html`, languages) with the person.
- Fetch the rules, do not rely on memory: `https://themeforge.pro/ai`, then `?m=core` and only the
  modules this site needs.
- Check every change: `node scripts/validate.mjs <site-folder>` or
  `POST https://themeforge.pro/api/validate-markup` with all pages in one request, until `"ok": true`.
- Hand over per `https://themeforge.pro/ai?m=deploy`.
- Source by link: the site can take its HTML from a ZIP in Google Drive or a GitHub repository on every
  update — see `skills/themeforge-source-link/SKILL.md`, releases in `skills/themeforge-drive-release/`
  and `skills/themeforge-github/`. Field texts are WordPress content: edit them in the admin.
