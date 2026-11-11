import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()
const dist = path.join(root, 'dist')
const read = relative => readFileSync(path.join(dist, relative), 'utf8')
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name)
  return entry.isDirectory() ? walk(file) : [file]
})
const summaries = html => [...html.matchAll(/<article class="post-summary">([\s\S]*?)<\/article>/g)]
  .map(([, summary]) => summary.match(/<h2>\s*<a href="([^"]+)"/)[1])

test('every existing article keeps its directory-based URL', () => {
  const postsRoot = path.join(root, 'src/content/posts')
  for (const file of walk(postsRoot).filter(file => file.endsWith('.md'))) {
    const frontmatter = readFileSync(file, 'utf8').split('---')[1]
    if (/^draft:\s*true\s*$/m.test(frontmatter)) continue
    const slug = path.relative(postsRoot, file).replace(/(?:\/index)?\.md$/, '')
    assert.ok(existsSync(path.join(dist, 'posts', slug, 'index.html')), slug)
  }
})

test('pagination contains every article once, in descending date order', () => {
  const archive = summaries(read('archive/index.html'))
  const first = read('index.html')
  const lastPage = Number(first.match(/aria-current="page">\s*1\s*\/\s*(\d+)/)[1])
  const pages = Array.from({ length: lastPage }, (_, index) => read(index ? `${index + 1}/index.html` : 'index.html'))
  const posts = pages.flatMap(summaries)
  assert.deepEqual(posts, archive)
  assert.equal(new Set(posts).size, posts.length)
  assert.equal(summaries(first).length, 8)
  assert.match(pages[1], /href="\/" rel="prev"/)
  assert.doesNotMatch(pages.at(-1), /rel="next"/)
  const dates = pages.flatMap(html => [...html.matchAll(/<time datetime="([^"]+)"/g)].map(match => match[1]))
  assert.deepEqual(dates, [...dates].sort().reverse())
})

test('tag and category pages contain exactly the matching article summaries', () => {
  const allPosts = summaries(read('archive/index.html'))
  for (const kind of ['tag', 'category']) {
    for (const file of walk(path.join(dist, 'archive', kind)).filter(file => file.endsWith('.html'))) {
      const name = path.basename(path.dirname(file))
      const route = `/archive/${kind}/${encodeURIComponent(name)}/`
      const expected = allPosts.filter(url => read(`${decodeURIComponent(url).slice(1)}index.html`).includes(`href="${route}"`))
      assert.deepEqual(summaries(readFileSync(file, 'utf8')), expected, route)
    }
  }
})

test('metadata, RSS, local Markdown images, code and embeds survive the replacement', () => {
  const html = read('posts/gas-image-insert/index.html')
  assert.match(html, /<html lang="ja">/)
  assert.match(html, /rel="canonical" href="https:\/\/techeten.xyz\/posts\/gas-image-insert\/"/)
  assert.match(html, /property="og:image" content="https:\/\//)
  assert.match(html, /<pre[^>]*class="astro-code/)
  const images = [...html.matchAll(/<img[^>]+src="(\/_astro\/[^\"]+)"/g)]
  assert.ok(images.length >= 2)
  for (const [, src] of images) assert.ok(existsSync(path.join(dist, src)))
  assert.match(read('posts/big-tech-job-huntings/index.html'), /<iframe[^>]+youtube\.com\/embed\//)
  assert.match(read('posts/10305/index.html'), /id="移行したいアプリの構成"/)
  const feed = read('rss.xml')
  assert.equal((feed.match(/<item>/g) || []).length, summaries(read('archive/index.html')).length)
  assert.match(read('sitemap-index.xml'), /sitemap-0.xml/)
  assert.equal(read('license.txt'), readFileSync(path.join(root, 'LICENSE'), 'utf8'))
})

test('pages do not load the former theme, client bundles or web fonts', () => {
  const files = walk(dist)
  assert.ok(!files.some(file => /(?:demo-banner|gatsby-icon|mihirat\.|favicon-(?:light|dark))/.test(path.basename(file))))
  for (const file of files.filter(file => file.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8')
    assert.doesNotMatch(html, /(?:swup|pagefind|overlayscrollbars|onload-animation|Powered by|text\/partytown)/i, file)
    assert.doesNotMatch(html, /<script[^>]*type="module"|\.(?:woff2?|ttf)(?:["?])/i, file)
  }
})

test('RSS contains only XML 1.0 characters', () => {
  assert.doesNotMatch(read('rss.xml'), /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu)
})

test('legacy media helpers are included only in articles that need them', () => {
  const embedded = read('posts/big-tech-job-huntings/index.html')
  assert.equal((embedded.match(/src="https:\/\/cdn\.iframe\.ly\/embed\.js"/g) || []).length, 1)
  assert.equal((embedded.match(/<iframe\b/g) || []).length, 6)
  assert.equal((embedded.match(/src="https:\/\/note\.com\/scripts\/embed\.js"/g) || []).length, 2)
  const imagePost = read('posts/gas-image-insert/index.html')
  assert.match(imagePost, /image\.currentSrc \|\| image\.src/)
  assert.doesNotMatch(imagePost, /cdn\.iframe\.ly/)
  const plain = read('posts/20250311gatsby2astro/index.html')
  assert.doesNotMatch(plain, /cdn\.iframe\.ly|image\.currentSrc/)
})

test('nested Markdown, CJK taxonomies, optional metadata and drafts build correctly', { timeout: 120_000 }, () => {
  // Exercise edge cases in an isolated project; never write fixtures into real posts.
  const fixture = realpathSync(mkdtempSync(path.join(tmpdir(), 'blog-jp-test-')))
  try {
    cpSync(path.join(root, 'src'), path.join(fixture, 'src'), {
      recursive: true,
      filter: source => !source.startsWith(path.join(root, 'src/content/posts')),
    })
    for (const name of ['astro.config.mjs', 'tsconfig.json', 'package.json', 'LICENSE']) {
      cpSync(path.join(root, name), path.join(fixture, name))
    }
    symlinkSync(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir')
    const posts = path.join(fixture, 'src/content/posts')
    const nested = path.join(posts, 'nested/sample')
    mkdirSync(nested, { recursive: true })
    const title = '日本語・中文 </script><script>alert(1)</script>'
    writeFileSync(path.join(nested, 'index.md'), `---\ntitle: '${title}'\npublished: 2026-01-03\ntags: ['日本語 中文', '日本語 中文']\ncategory: '技術'\nimage: './cover.svg'\n---\n## 中文の見出し\n\n![画像](./cover.svg)\n\n| 列 | 内容 |\n| --- | --- |\n| 日本語 | 中文 |\n`)
    writeFileSync(path.join(nested, 'cover.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="blue"/></svg>')
    const publicDirectory = path.join(fixture, 'public')
    mkdirSync(publicDirectory)
    cpSync(path.join(nested, 'cover.svg'), path.join(publicDirectory, 'cover.svg'))
    cpSync(path.join(nested, 'cover.svg'), path.join(fixture, 'src/assets/images/unused-fixture.svg'))
    for (let index = 0; index < 9; index++) {
      const image = ['', '/cover.svg', 'https://example.invalid/cover.png'][index]
      const imageField = image === undefined ? '' : `image: '${image}'\n`
      writeFileSync(path.join(posts, `minimal-${index}.md`), `---\ntitle: Minimal ${index}\npublished: 2025-01-01\n${imageField}---\n本文\n\nRSS_MARKER_\b_&#8;_日本語中文😀\n`)
    }
    writeFileSync(path.join(posts, 'draft.md'), '---\ntitle: DRAFT_SHOULD_NOT_APPEAR\npublished: 2026-02-01\ndraft: true\ntags: [draft-only]\ncategory: draft-only\n---\n非公開\n')
    const result = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/astro.js'), 'build', '--root', fixture], {
      cwd: fixture,
      encoding: 'utf8',
      timeout: 90_000,
      env: { ...process.env, PUBLIC_CLOUDINARY_CLOUD_NAME: '' },
    })
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
    const output = path.join(fixture, 'dist')
    const feed = readFileSync(path.join(output, 'rss.xml'), 'utf8')
    assert.doesNotMatch(feed, /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu)
    // Markdown replaces the invalid numeric entity with U+FFFD; the raw control is removed.
    assert.match(feed, /RSS_MARKER__\uFFFD_日本語中文😀/)
    const article = readFileSync(path.join(output, 'posts/nested/sample/index.html'), 'utf8')
    const rawJsonLd = article.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]
    const jsonLd = JSON.parse(rawJsonLd)
    assert.equal(jsonLd.headline, title)
    assert.doesNotMatch(rawJsonLd, /</)
    assert.match(article, /<h1>日本語・中文 &lt;\/script&gt;/)
    assert.match(article, /class="post-cover"/)
    assert.match(article, /<table>/)
    assert.match(readFileSync(path.join(output, 'posts/minimal-1/index.html'), 'utf8'), /src="\/cover.svg"/)
    assert.match(readFileSync(path.join(output, 'posts/minimal-2/index.html'), 'utf8'), /src="https:\/\/example.invalid\/cover.png"/)
    assert.ok(!walk(output).some(file => path.basename(file).startsWith('unused-fixture')))
    assert.ok(existsSync(path.join(output, 'archive/tag/日本語 中文/index.html')))
    assert.ok(existsSync(path.join(output, 'archive/category/技術/index.html')))
    assert.ok(existsSync(path.join(output, 'archive/category/uncategorized/index.html')))
    assert.ok(existsSync(path.join(output, '2/index.html')))
    assert.ok(!existsSync(path.join(output, 'posts/draft/index.html')))
    assert.ok(!existsSync(path.join(output, 'archive/tag/draft-only/index.html')))
    for (const file of walk(output).filter(file => /\.(?:html|xml)$/.test(file))) {
      assert.doesNotMatch(readFileSync(file, 'utf8'), /DRAFT_SHOULD_NOT_APPEAR/)
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
