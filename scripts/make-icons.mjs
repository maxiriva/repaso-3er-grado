// Genera los PNG de la PWA a partir de icons/icon.svg (usa el Chromium de Playwright).
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const svg = await readFile(new URL("../icons/icon.svg", import.meta.url), "utf8");
const browser = await chromium.launch();
const page = await browser.newPage();
// [tamaño, maskable, nombre]. El de Apple va con fondo lleno: iOS pinta de negro lo transparente.
for (const [size, maskable, name] of [[180,true,"icon-180"],[192,false,"icon-192"],[512,false,"icon-512"],[512,true,"icon-512-maskable"]]) {
  await page.setViewportSize({ width: size, height: size });
  // La versión maskable deja margen de seguridad y fondo lleno (sin esquinas redondeadas).
  const inner = maskable ? `<div style="width:100%;height:100%;background:#2B64C8;display:grid;place-items:center"><div style="width:80%;height:80%">${svg}</div></div>` : svg;
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{width:100%;height:100%;display:block}</style>${inner}`);
  await page.screenshot({ path: `icons/${name}.png`, omitBackground: !maskable });
}
await browser.close();
console.log("íconos listos");
