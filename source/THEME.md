# Shared notebook theme

`src/theme.css` is the site-wide theme layer. It is imported after the existing
portfolio and course layout styles in `src/main.tsx`.

## Design rules

- Warm paper background (`--theme-paper`), slightly lighter reading surfaces
  (`--theme-sheet`), dark green-gray text, muted green links and controls.
- All page shells share the unlined paper grain, soft fiber mottling, and warm
  edge shading in `theme.css`. The embedded SVG textures need no external image
  requests. Reading panels remain light, and printing uses plain white paper.
- Personal/audience page shells also show one decorative coffee stain near the
  top-right paper edge (`src/assets/coffee-ring-4.png`), with its cropped top
  aligned to the page edge. It uses a noninteractive
  background pseudo-element, fades on small screens, and is omitted from course
  shells and print output.
- Georgia headings, readable sans-serif body text, monospace only for code,
  mathematical notation, and technical labels.
- Thin dividers and ordinary spacing rather than heavy banners, shadows,
  rotated badges, or decorative mock product screenshots.
- Project and course content should determine the layout. Preserve educational
  figures, protocol colors, answer feedback, and useful interactive controls.
- Underlined links, visible keyboard focus, and a strong distinction between
  selected and unselected answers must remain visible.

The `--green`, `--gold`, and other legacy course variables map to shared theme
tokens here, as do the earlier portfolio `--wc-*` and hiring `--hiring-*` tokens.
New common styling should use `--theme-*`, `--theme-sans`, `--theme-serif`, and
`--theme-mono` directly. Course-specific diagram layouts belong with their
existing component styles; avoid duplicating them in the shared layer.

Both courses use the same chrome and reading typography. Color within a teaching
diagram can still carry meaning (e.g., packet loss or operating-system privilege).

For visual checks, inspect home, hiring, teacher, student library, both course
dashboards, lessons, quizzes, references, and midterm review/practice at desktop,
tablet, and 320–390px mobile widths. Check actual overflow, keyboard focus,
navigation menus, and correct/incorrect answer feedback rather than only screenshots.
