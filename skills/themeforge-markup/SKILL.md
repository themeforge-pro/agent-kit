---
name: themeforge-markup
description: Turn an HTML site (written by hand, by you, or exported from a builder) into a WordPress theme with an editable admin, using ThemeForge attributes. Use when the person wants their static or AI-generated site on WordPress, asks for a "WordPress theme from this HTML", wants the client to edit texts, images, lists, menus or products in the WordPress admin, or mentions ThemeForge. Covers the site map, placing fld-/opt-/tax-/wp- attributes, checking the markup with the free validator, and handing the site over for the build.
---

# ThemeForge markup

ThemeForge builds a classic WordPress theme from static HTML. You mark the editable parts with HTML
attributes: `fld-*` for fields of a page, `opt-*` for site-wide settings, `tax-*` for fields of a
category, `wp-*` for WordPress itself (posts, menus, products). The generator turns them into admin
fields, page templates and the admin screens the site owner edits. The design stays the person's.

**The rules live at https://themeforge.pro/ai and change with the generator.** Do not mark up from
memory or from this file: fetch the rules every session. This skill only tells you the order of work.

## 1. Agree the site map first

Before writing markup, reply with a site map and wait for confirmation:

- every page file with its slug (`index.html`, `menu.html`, `contacts.html`…) — the file name decides
  the WordPress template, so `blog.html` is a page called blog, not the blog feed;
- content types: blog posts, products, your own types and their categories;
- what is site-wide (header, footer, contacts) — it goes into `theme-options.html`;
- languages.

## 2. Pull the rules you need

```
GET https://themeforge.pro/ai              the entry page: read it first
GET https://themeforge.pro/ai?m=core       always, before any markup
GET https://themeforge.pro/ai?m=build      when you GENERATE the site rather than annotate one
GET https://themeforge.pro/ai?m=<module>   pages · blog · cpt · woocommerce · deploy · legacy
```

Load only the modules this site needs: a café without a shop never reads `woocommerce`.

## 3. Mark up as you go

Attribute each section while you write or read it, not in a second pass. The checks that catch most
mistakes, in the words of the rules:

- every page has `wp-fields-group` on `<body>`, or it gets no fields;
- every field has a name; a link and its caption have different names (`Button` / `Button text`);
- in a list (`fld-loop`) every card carries the attributes, not only the first;
- site-wide fields are declared on `theme-options.html`.

## 4. Check, free and without an account

Send the whole set of pages in one request and repeat until `"ok": true`:

```
POST https://themeforge.pro/api/validate-markup
Content-Type: application/json

{"pages":[{"name":"index.html","html":"…"},{"name":"theme-options.html","html":"…"}]}
```

Or run `node scripts/validate.mjs <site-folder>` from this kit. `error` breaks the theme, `warning`
means something is silently dropped, `hint` is worth knowing. Nothing is stored.

## 5. Hand over

Follow `?m=deploy`: one ZIP of the site's contents (`index.html` at the root). The person uploads it to
a project at https://themeforge.pro, opens the theme's WordPress admin in the browser for free, and
downloads the theme with a subscription. If they give you their project id and token, the `deploy`
module shows how to build the theme over HTTP yourself.

## References

- Attribute reference for people: https://themeforge.pro/docs
- Markup guide: https://themeforge.pro/docs/ai-guide
- Attribute dictionary as JSON: https://themeforge.pro/api/attributes
- A complete marked-up example: `examples/warm-corner/` in this kit
