## Project purpose

This repository hosts my GitHub Pages website.

It contains multiple lesson sites for subjects I am studying.
Each lesson site should be self-contained and easy to navigate.

## General expectations

- Before making changes, inspect the existing structure and follow its conventions.
- Do not rewrite working code unnecessarily.
- Prefer small, targeted changes.
- Explain significant architectural changes before making them.
- Preserve existing lesson content unless I explicitly ask for it to be changed.
- Do not delete files unless I explicitly ask.

## Code review workflow

For changes to code, tests, build scripts or CI, use the native skills when available. Each link below also works as an offline rubric.

1. Before editing, apply [Ponytail](.clinerules/02-ponytail.md). Trace the affected route, callers and tests. Check both `source/dist/` (Pages) and the root mirror when changing the build.
2. Apply pstack's [Subtract Before You Add](docs/agent-skills/principle-subtract-before-you-add/SKILL.md). Look for a decision with two owners, an unused dependency or a file no public page references. Keep lesson IDs, deep links, accessible controls and saved quiz denominators intact.
3. Apply [Thermo-Nuclear Code Quality Review](docs/agent-skills/thermo-nuclear-code-quality-review/SKILL.md) twice. First inspect the whole patch, including new files, for redundant code or state. Then trace the result through callers, failure paths and tests. Recheck any edit from the second pass. Respect review-only requests.
4. Apply [Unslop](docs/agent-skills/unslop/SKILL.md) to new prose and the handoff. Preserve the author's voice, course terminology and quoted material. For prose-only tasks, check the prose and its links.

Follow the [site verification instructions](README.md#verification). Report the finding, what you changed or retained, and checks actually run. A skill is a review rubric; loading one is not a passing test.

## Lesson sites

Lesson sites are intended to be educational and beginner-friendly.

When creating lessons:

- Explain concepts from simple to more technical.
- Include examples.
- Use diagrams or visual aids when helpful.
- Keep navigation consistent with the existing lesson pages.
- Match the visual style of the existing site.

## Git

- Do not commit directly to main unless I explicitly request it.
- Prefer feature branches for significant changes.
- Do not force push.
