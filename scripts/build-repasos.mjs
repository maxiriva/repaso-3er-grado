// Arma un PDF por materia: las páginas de esa materia del cuadernillo + sus respuestas al final.
// Uso: npm run repasos  → repasos/repaso-<materia>.pdf
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { readFile, writeFile } from "node:fs/promises";
import { subjects, intro } from "../repasos/respuestas.mjs";

const root = new URL("../", import.meta.url);
const src = await PDFDocument.load(await readFile(new URL("repasos/fuente/cuadernillo-repaso-3er-grado.pdf", root)));
// Las fuentes van incrustadas (data:) porque la página se arma con setContent, sin acceso a archivos.
let fontCss = await readFile(new URL("fonts/fonts.css", root), "utf8");
for (const [, file] of fontCss.matchAll(/url\("\.\/([^"]+)"\)/g))
  fontCss = fontCss.replaceAll(`url("./${file}")`, `url("data:font/woff2;base64,${(await readFile(new URL(`fonts/${file}`, root))).toString("base64")}")`);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Página de respuestas con el mismo estilo del cuadernillo (A4, Baloo 2 + Nunito, banda de color).
function answersHtml(s) {
  let n = 0;
  const levels = s.levels.map(([title, items]) => `<h3>${esc(title)}</h3><ol start="${n + 1}">${items.map((it) => { n++; return `<li>${esc(it)}</li>`; }).join("")}</ol>`).join("");
  const d = s.dictation;
  const dict = d ? `<section class="box"><h3>${esc(d.title)}</h3><table><tr>${d.lists.map(([t]) => `<th>${esc(t)}</th>`).join("")}</tr><tr>${d.lists.map(([, w]) => `<td>${esc(w)}</td>`).join("")}</tr></table>
    <p><strong>Oraciones:</strong> ${esc(d.sentences)}</p><p class="small"><strong>Pistas:</strong> ${esc(d.tips)}</p></section>` : "";
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${fontCss}
    @page{size:A4;margin:15mm 15mm 18mm}
    body{font-family:"Nunito",sans-serif;font-size:10.5pt;line-height:1.45;color:#1B2539;margin:0}
    .band{background:${s.color};color:#fff;border-radius:10px;padding:10px 16px;display:flex;justify-content:space-between;align-items:baseline}
    .band h1{font-family:"Baloo 2",sans-serif;font-size:22pt;margin:0;line-height:1.1}
    .band span{font-weight:800;font-size:9.5pt;letter-spacing:.06em;text-transform:uppercase}
    .lead{margin:10px 0 4px;color:#56627A}
    .cols{columns:2;column-gap:22px}
    h3{font-family:"Baloo 2",sans-serif;font-size:13pt;margin:10px 0 2px;border-bottom:1.5px solid #1B2539;break-after:avoid}
    ol{margin:0;padding-left:22px} li{margin:2px 0;break-inside:avoid} li::marker{font-weight:800}
    .box{margin-top:14px;border:1.5px solid ${s.color};border-radius:10px;padding:8px 12px;break-inside:avoid}
    .box h3{border:none;margin-top:0}
    table{width:100%;border-collapse:collapse;margin:4px 0 8px} th,td{border:1px solid #AEB8C8;padding:5px 6px;vertical-align:top;text-align:left;font-size:9.5pt} th{background:#F4F7FB}
    p{margin:4px 0} .small{font-size:9pt;color:#56627A}
    .note{margin-top:12px;font-size:9pt;color:#56627A;border-top:1px solid #D2DAE6;padding-top:6px}
  </style></head><body>
    <div class="band"><h1>Respuestas · ${esc(s.name)}</h1><span>Para el adulto</span></div>
    <p class="lead">${esc(intro)} Esta parte se puede separar antes de entregar el repaso.</p>
    <div class="cols">${levels}</div>${dict}${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}
  </body></html>`;
}

// Pie de cada página: franja blanca que tapa "Cuadernillo · N / 20" y la numeración nueva.
function footerHtml(labels) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
    @page{size:A4;margin:0} html,body{margin:0;background:transparent}
    .pg{position:relative;width:210mm;height:297mm;break-after:page}
    .ft{position:absolute;left:0;right:0;bottom:0;height:9.2mm;background:#fff;display:flex;justify-content:space-between;align-items:center;padding:0 14mm;box-sizing:border-box;
      font-family:"Nunito",sans-serif;font-size:7.5pt;color:#56627A}
  </style></head><body>${labels.map(([l, r]) => `<div class="pg"><div class="ft"><span>${esc(l)}</span><span>${esc(r)}</span></div></div>`).join("")}</body></html>`;
}
async function render(page, html) {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  return PDFDocument.load(await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true }));
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const s of subjects) {
  const ans = await render(page, answersHtml(s));
  const out = await PDFDocument.create();
  out.setTitle(`Repaso de ${s.name} — 3er grado`);
  out.setCreator("repaso-3er-grado");
  const [from, to] = s.pages, nEx = to - from + 1;
  for (const p of await out.copyPages(src, Array.from({ length: nEx }, (_, i) => from - 1 + i))) out.addPage(p);
  for (const p of await out.copyPages(ans, ans.getPageIndices())) out.addPage(p);

  const total = out.getPageCount();
  const labels = Array.from({ length: total }, (_, i) => [`Repaso de ${s.name} · 3er grado${i >= nEx ? " · Respuestas" : ""}`, `${i + 1} / ${total}`]);
  const ft = await render(page, footerHtml(labels));
  const stamps = await out.embedPdf(ft, ft.getPageIndices());
  out.getPages().forEach((p, i) => p.drawPage(stamps[i], { x: 0, y: 0, width: p.getWidth(), height: p.getHeight() }));

  await writeFile(new URL(`repasos/repaso-${s.id}.pdf`, root), await out.save());
  console.log(`repaso-${s.id}.pdf · ${nEx} págs. de ejercicios + ${ans.getPageCount()} de respuestas`);
}
await browser.close();
