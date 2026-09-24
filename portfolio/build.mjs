import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';

const [tailwind, custom, icons, javascript] = await Promise.all([
    readFile('dist/output.css', 'utf8'),
    readFile('styles.css', 'utf8'),
    readFile('src/icons.css', 'utf8'),
    readFile('main.js', 'utf8'),
]);

let versionedIcons = icons;
for (const filename of ['fa-solid-900-subset.woff2', 'fa-brands-400-subset.woff2']) {
    const digest = createHash('sha256').update(await readFile(`assets/fonts/${filename}`)).digest('hex').slice(0, 12);
    versionedIcons = versionedIcons.replaceAll(filename, `${filename}?v=${digest}`);
}
const mobileHeroDigest = createHash('sha256').update(await readFile('assets/hero-food-mobile.webp')).digest('hex').slice(0, 12);
const versionedCustom = custom.replaceAll('hero-food-mobile.webp', `hero-food-mobile.webp?v=${mobileHeroDigest}`);
const css = await transform(`${tailwind}\n${versionedCustom}\n${versionedIcons}`, { loader: 'css', minify: true });
const js = await transform(javascript, { loader: 'js', minify: true, target: 'es2017' });
await Promise.all([
    writeFile('dist/style.min.css', css.code),
    writeFile('main.min.js', js.code),
]);

// Keep the Google Fonts subset in sync with page copy, including future edits.
let html = await readFile('index.html', 'utf8');
const characters = [...new Set(html.match(/[^\x00-\x7F]/gu) ?? [])].sort().join('');
html = html.replace(/(&text=)[^"&]+/g, (_, prefix) => prefix + encodeURIComponent(characters));

// Cloudflare caches stable filenames for hours. A content version keeps deploys fresh.
const localAssets = [...new Set(html.match(/(?:assets|dist)\/[\w./-]+\.(?:webp|jpe?g|svg|css)|main\.min\.js/g) ?? [])];
for (const path of localAssets) {
    const digest = createHash('sha256').update(await readFile(path)).digest('hex').slice(0, 12);
    const escapedPath = path.replaceAll('.', '\\.');
    html = html.replace(new RegExp(`${escapedPath}(?:\\?v=[0-9a-f]{12})?`, 'g'), `${path}?v=${digest}`);
}
await writeFile('index.html', html);
