import { copyFileSync, cpSync, readFileSync, existsSync } from 'node:fs'

const output = new URL('../dist/', import.meta.url)
const root = new URL('../../', import.meta.url)
const html = readFileSync(new URL('index.html', output), 'utf8')
const assets = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+)"/g)]
if (!assets.length || assets.some(([, path]) => !existsSync(new URL(path, output)))) {
  throw new Error('Build is missing root asset links or their files')
}

// Publish only Vite outputs; never empty the repository's other static pages.
cpSync(new URL('assets/', output), new URL('assets/', root), { recursive: true })
copyFileSync(new URL('index.html', output), new URL('index.html', root))
console.log(`Published index.html and assets/ to ${root.pathname}`)
