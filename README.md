# ThemeForge agent kit

A skill for Claude Code, a rule for Cursor and a checker script that teach an AI assistant to turn an
HTML site into a **WordPress theme with an editable admin** using [ThemeForge](https://themeforge.pro).

You (or the assistant) mark the editable parts of the HTML with attributes: `fld-text="Title"` makes a
heading a text field, `fld-loop="Drinks"` makes a block of cards a list the client adds rows to,
`opt-text="Phone"` puts the phone into site settings. ThemeForge builds a classic WordPress theme in
which every marked part is a field in the admin. The design stays yours, and the theme can be rebuilt
from new HTML without losing the client’s content.

## What is inside

| Path | What |
|---|---|
| `skills/themeforge-markup/SKILL.md` | Skill for Claude Code: site map → rules → markup → check → hand-over |
| `cursor/themeforge.mdc` | The same as a Cursor rule |
| `AGENTS.md` | The same for other agents that read `AGENTS.md` |
| `scripts/validate.mjs` | Checks a folder of HTML pages against the real generator (Node 18+, no dependencies) |
| `examples/warm-corner/` | A small café site, fully marked up: 3 pages and `theme-options.html` |

The kit does not copy the markup rules. They live at [themeforge.pro/ai](https://themeforge.pro/ai) and
change with the generator, so the skill tells the assistant to fetch them every time.

## Install

**Claude Code** — copy the skill into your skills folder:

```bash
git clone https://github.com/themeforge-pro/agent-kit
cp -r agent-kit/skills/themeforge-markup ~/.claude/skills/        # every project
# or: cp -r agent-kit/skills/themeforge-markup .claude/skills/   # this project only
```

Then ask: *“Make this site a WordPress theme with ThemeForge”*.

**Cursor** — copy `cursor/themeforge.mdc` to `.cursor/rules/` of your project.

**Any assistant** — point it at `https://themeforge.pro/ai` or put `AGENTS.md` in the project root.

## Check your markup

```bash
node scripts/validate.mjs examples/warm-corner
```

```
contacts.html                  5 fields  group: Contact
index.html                    20 fields  group: Home
menu.html                      7 fields  group: Menu
theme-options.html             9 fields  group: Site options

OK: 0 errors, 0 warnings, 0 hints
```

The checker is free, needs no account and stores nothing. It runs the generator’s own parser, so it
reports what would really be dropped or merged: unnamed fields, a link and its caption under one name,
a decoration before the first card of a list.

## Build the theme

Zip the site’s contents (`index.html` at the root) and upload it to a project at
[themeforge.pro](https://themeforge.pro). A free account opens the theme’s WordPress admin in the
browser so you can see every field before paying; downloading and updating the theme needs the
subscription ([pricing](https://themeforge.pro/pricing)). Fields run on the free Secure Custom Fields
plugin, which the theme installs itself; ACF PRO, WooCommerce, Polylang and WPML are supported.

## Links

- Markup rules for assistants: https://themeforge.pro/ai
- Attribute reference: https://themeforge.pro/docs
- How it works: https://themeforge.pro/how-it-works
- For developers and agents: https://themeforge.pro/developers

## License

MIT. The example site, its texts and pictures are ours and under the same license.
