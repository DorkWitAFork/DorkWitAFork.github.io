import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'

const dist = new URL('../dist/', import.meta.url)
const root = new URL('../../', import.meta.url)
const built = new Set(readdirSync(dist, { recursive: true }).filter(path => statSync(new URL(path, dist)).isFile()).map(path => path.replaceAll('\\', '/')))
assert(built.has('index.html'), 'Run npm run build first')
for (const path of built) {
  const mirror = new URL(path, root)
  assert(existsSync(mirror) && readFileSync(mirror).equals(readFileSync(new URL(path, dist))), `Root copy differs: ${path}. Run npm run publish:site.`)
}

// Report obsolete tracked files. Local experiments and other static pages are not ours to delete.
const tracked = execFileSync('git', ['ls-files', '-z', '--', 'assets/'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
const stale = tracked.filter(path => !built.has(path) && existsSync(new URL(path, root)))
assert.equal(stale.length, 0, `Tracked assets absent from this build; review before removing:\n${stale.join('\n')}`)
console.log(`Root mirror matches all ${built.size} files in the Pages build.`)
