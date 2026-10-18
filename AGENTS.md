# ThemeForge: HTML → WordPress theme

This project's HTML is meant to become a WordPress theme with an editable admin via ThemeForge.

- Before writing markup, agree a site map (page files and slugs, content types, site-wide values for
  `theme-options.html`, languages) with the person.
- Fetch the rules, do not rely on memory: `https://themeforge.pro/ai`, then `?m=core` and only the
  modules this site needs.
- Check every change: `node scripts/validate.mjs <site-folder>` or
  `POST https://themeforge.pro/api/validate-markup` with all pages in one request, until `"ok": true`.
- Hand over per `https://themeforge.pro/ai?m=deploy`.
