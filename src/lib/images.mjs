/** Keep the source CDN references readable, with responsive derivatives where supported.
 * @param {{ src: string, width: number, height: number }} image
 */
export function responsiveImage(image) {
  if (!image.src.startsWith('https://framerusercontent.com/images/') || image.width <= 512) {
    return { src: image.src, srcset: undefined };
  }
  const url = new URL(image.src);
  url.searchParams.set('width', String(image.width));
  url.searchParams.set('height', String(image.height));
  const variants = [512, 1024, 2048].filter(size => size < Math.max(image.width, image.height));
  const widths = new Set();
  const sources = variants.map(size => {
    const derivative = new URL(url);
    derivative.searchParams.set('scale-down-to', String(size));
    const width = Math.round(image.width * size / Math.max(image.width, image.height));
    widths.add(width);
    return `${derivative.href} ${width}w`;
  });
  if (!widths.has(image.width)) sources.push(`${url.href} ${image.width}w`);
  return { src: url.href, srcset: sources.join(', ') };
}
