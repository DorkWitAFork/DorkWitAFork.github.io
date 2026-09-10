# Spencer Le Bleu Portfolio

Portfolio and interactive study hub for Spencer Le Bleu, a computer science student and software developer.

## Site areas

- `#/` - audience welcome page
- `#/student` - CSC 138 and CSC 139 study guides
- `#/professor` - academic project preview
- `#/recruiter` - professional portfolio preview
- `#/student/csc138/dashboard` - Computer Network Fundamentals
- `#/student/csc138/chapter2` - CSC 138 application principles and HTTP
- `#/student/csc138/practice/chapter2` - CSC 138 Chapter 2 practice and quiz
- `#/student/csc139/dashboard` - Operating System Principles

## Run locally

```bash
npm ci
npm run dev
```

## Verify

```bash
npm run check
npm test
npm run build
```

This directory is the canonical app source. `npm run publish:site` builds into
`dist/` and copies the generated entry point and assets to the repository root
without touching other pages. See `../README.md` for the full deployment routine.

Student progress is stored independently in the browser under `csc138-progress-v1` and `csc139-progress-v1`. CSC 138 Chapters 1 and 2 and CSC 139 Chapter 1 follow their uploaded lecture decks; modules without source material remain provisional.
