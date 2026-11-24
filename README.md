# DorkWitAFork.github.io

Spencer Le Bleu's portfolio and course guides. Edit the React app in [`source/`](source/). For lesson sources see [CSC 138](source/CSC138-SOURCES.md); for styling see the [notebook theme](source/THEME.md).

## Development

Run these commands from `source/` with Node 22:

```sh
npm ci
npm run dev
```

`/#/student` lists the courses. CSC 138 has chapters 1 through 5, interactive labs, quizzes and midterm practice. The CSC 139 and CSC 179 cards say “Coming Soon”. Existing CSC 139 bookmarks still work. The portfolio also has `/#/teacher` and `/#/hiring` views.

## Verification

From `source/`:

```sh
npm test
npm run publish:site
npm run check:mirror
npx playwright install chromium
npm run test:pages
```

`publish:site` type-checks, builds `dist/`, then updates the root `index.html` and `assets/`. For a check without changing the mirror, run `npm run build` instead. Use `npm run check` for TypeScript alone.

`check:mirror` compares the Pages build with the files at the repository root. It lists tracked files in `assets/` absent from the new build. Review that list, remove obsolete generated files, and include the current outputs with the source change. The check ignores untracked experiments. Avoid staging the whole `assets/` directory.

Playwright tests the built artifact using a local Python 3 static server on port 4173. On a fresh Linux runner use `npx playwright install --with-deps chromium`. For a manual preview, run `python3 -m http.server 8000 --directory dist` from `source/`.

## Deployment

The [Pages workflow](.github/workflows/deploy-pages.yml) checks pull requests to `main`. On `main` it deploys `source/dist/`. The build includes the `/csc138/` bookmark redirect, `/csc173/`, the standalone final practice quiz and their public stylesheets. Preserve both browser progress keys (`csc138-progress-v1` and `csc139-progress-v1`) when changing routes or lessons.

## Coding tools

[AGENTS.md](AGENTS.md#code-review-workflow) defines the review order and links the offline rubrics. Open the repository root in your coding tool.

- **OpenCode:** restart after a config change. [opencode.json](opencode.json) pins Ponytail `5.3.3`. Use `/ponytail-help` to see its commands. `opencode debug skill` should list `principle-subtract-before-you-add`, `thermo-nuclear-code-quality-review` and `unslop` from this checkout's `docs/agent-skills/`. First use of the plugin requires npm access or a populated OpenCode cache.
- **Cline:** enable the [workspace rules](.clinerules/) and start a new task. [Claude Code](CLAUDE.md), [Gemini CLI](GEMINI.md) and [Copilot](.github/copilot-instructions.md) each point to the same project instructions.

The [upstream revisions and MIT notices](docs/agent-skills/NOTICES.md) cover the local rubrics. On upgrade, review the Ponytail plugin pin and Cline rule together. These are development tools; the site build does not load them.
