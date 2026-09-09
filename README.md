# DorkWitAFork.github.io

Spencer Le Bleu's portfolio and study hub. **`source/` is the canonical Vite/React
application** for the root hub, CSC 138, and CSC 139. Make application changes
there, not in the generated root `index.html` or `assets/`.

## Develop and Publish

From `source/`, run:

```sh
npm ci
npm run dev
```

Before publishing, also from `source/`:

```sh
npm run check
npm test
npm run publish:site
```

`publish:site` builds into the ignored `source/dist/` staging directory, checks
the entry point's asset references, then copies only its `index.html` and
`assets/` to the repository root. It does not commit, push, or delete unrelated
pages. Do not configure Vite to empty the repository root as its output directory.
Old hashed assets are retained; remove only confirmed unused bundles if needed.

Review the Git diff, then commit the source and root build outputs together and
push to `main` to update GitHub Pages (published from the repository root).
For a local production preview, serve the repository root with
`python3 -m http.server 8000` and open `http://localhost:8000/`.

## Routes and Existing Pages

- `/#/` is the portfolio hub; `/#/student` lists both study guides.
- `/#/student/csc138/dashboard` and `/#/student/csc139/dashboard` open the courses.
- Course views are `dashboard`, `roadmap`, `chapter1`, `practice`, and `reference`.
- `/csc138/` and `/csc138/index.html` redirect legacy hashes such as `#/practice`
  to `/#/student/csc138/practice`; missing or invalid views open the dashboard.
- Existing CSC 173 pages, assignment files, and legacy CSC 138 assets are retained.
- Progress remains in the same origin's local storage under `csc138-progress-v1`
  and `csc139-progress-v1`; changing the URL path does not erase it.

The former `csc138/source/` tracked app has been replaced by `source/`.
The original `/root/school/Fall2026/CSC138/lesson-site` working copy is not part of
this repository and was deliberately left untouched during migration. Use this
repository's `source/` for future development.
