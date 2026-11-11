/**
 * @param {string} title
 * @param {string} [cloudName]
 */
export function generateOgImageUrl(title, cloudName) {
  if (!cloudName) return undefined
  // Cloudinary text layers require double escaping reserved characters.
  const text = encodeURIComponent(encodeURIComponent(title))
  return [
    `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload`,
    'c_fill,w_1200,h_630,g_center',
    `l_text:Sawarabi%20Gothic_50_bold:${text},co_rgb:333333,c_fit,w_800`,
    'fl_layer_apply,fl_no_overflow',
    'c_limit,w_1200/f_jpg/q_auto/v1/krkyniwuclyojie7rt6f',
  ].join('/')
}
