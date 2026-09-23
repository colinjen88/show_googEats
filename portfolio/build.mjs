import { readFile, writeFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const [tailwind, custom, javascript] = await Promise.all([
    readFile('dist/output.css', 'utf8'),
    readFile('styles.css', 'utf8'),
    readFile('main.js', 'utf8'),
]);

const css = await transform(`${tailwind}\n${custom}`, { loader: 'css', minify: true });
const js = await transform(javascript, { loader: 'js', minify: true, target: 'es2017' });
await Promise.all([
    writeFile('dist/style.min.css', css.code),
    writeFile('main.min.js', js.code),
]);

// Keep the Google Fonts subset in sync with page copy, including future edits.
let html = await readFile('index.html', 'utf8');
const characters = [...new Set(html.match(/[^\x00-\x7F]/gu) ?? [])].sort().join('');
html = html.replace(/(&text=)[^"&]+/g, (_, prefix) => prefix + encodeURIComponent(characters));
await writeFile('index.html', html);
