import assert from 'node:assert/strict'
import test from 'node:test'
import { generateOgImageUrl } from '../src/utils/ogp-image.mjs'

test('OGP uses the local fallback when Cloudinary is not configured', () => {
  assert.equal(generateOgImageUrl('Title'), undefined)
  assert.equal(generateOgImageUrl('Title', ''), undefined)
})

test('OGP keeps the image layout and safely encodes multilingual titles', () => {
  for (const title of ['Hello, world', '日本語 / 中文 & #?%', 'title/c_fill,w_1\n次の行']) {
    const url = new URL(generateOgImageUrl(title, 'example'))
    assert.equal(url.origin, 'https://res.cloudinary.com')
    assert.equal(url.search, '')
    assert.equal(url.hash, '')
    assert.ok(url.pathname.includes('/c_fill,w_1200,h_630,g_center/'))
    const overlay = url.pathname.split('/').find(part => part.startsWith('l_text:'))
    const encoded = overlay.match(/^l_text:Sawarabi%20Gothic_50_bold:(.+),co_rgb:333333,c_fit,w_800$/)[1]
    assert.equal(decodeURIComponent(decodeURIComponent(encoded)), title)
    assert.ok(url.pathname.endsWith('/fl_layer_apply,fl_no_overflow/c_limit,w_1200/f_jpg/q_auto/v1/krkyniwuclyojie7rt6f'))
  }
})
