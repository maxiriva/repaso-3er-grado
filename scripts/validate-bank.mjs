// Valida banco.json. Sale con código 1 si encuentra algún problema (lo usa CI).
import { readFile } from "node:fs/promises";

const file = new URL("../" + (process.argv[2] || "banco.json"), import.meta.url);
const bank = JSON.parse(await readFile(file, "utf8"));
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const TYPES = ["mc", "tf", "fill", "match", "order"];
const ids = new Set();

if (!Array.isArray(bank.subjects) || !bank.subjects.length) err("banco", "no tiene materias");
for (const s of bank.subjects || []) {
  const sw = `materia ${s.id || "?"}`;
  for (const k of ["id", "name", "lang", "color"]) if (!s[k]) err(sw, `falta "${k}"`);
  if (!["es", "en"].includes(s.lang)) err(sw, `lang debe ser "es" o "en"`);
  if (!Array.isArray(s.cards) || !s.cards.length) err(sw, "no tiene tarjetas");
  (s.cards || []).forEach((c, i) => { if (!Array.isArray(c) || c.length !== 2 || !c[0] || !c[1]) err(`${sw} tarjeta ${i + 1}`, "debe ser [frente, dorso]"); });
  const count = { f: 0, m: 0, d: 0 };
  (s.questions || []).forEach((q, i) => {
    const w = `${sw} pregunta ${q.id || "#" + (i + 1)}`;
    if (!q.id) err(w, `falta "id"`);
    else if (ids.has(q.id)) err(w, `id repetido (${q.id})`);
    else ids.add(q.id);
    for (const k of ["lv", "t", "q"]) if (q[k] === undefined || q[k] === "") err(w, `falta "${k}"`);
    if (q.lv && !(q.lv in count)) err(w, `lv debe ser f, m o d`); else if (q.lv) count[q.lv]++;
    if (q.t && !TYPES.includes(q.t)) err(w, `tipo desconocido "${q.t}"`);
    if (q.t === "mc") {
      if (!Array.isArray(q.o) || q.o.length < 2) err(w, "mc necesita al menos 2 opciones en o");
      else if (!q.o.includes(q.a)) err(w, `la respuesta "${q.a}" no está entre las opciones`);
      else if (new Set(q.o).size !== q.o.length) err(w, "hay opciones repetidas");
    }
    if (q.t === "tf" && typeof q.a !== "boolean") err(w, "tf necesita a: true o false");
    if (q.t === "fill" && (!Array.isArray(q.a) || !q.a.length)) err(w, "fill necesita a: [respuestas aceptadas]");
    if (q.t === "fill" && q.num && q.a.some((x) => !/^\d+$/.test(String(x)))) err(w, "fill numérico: las respuestas van sin puntos ni espacios");
    if (q.t === "match" && (!Array.isArray(q.pairs) || q.pairs.length < 2)) err(w, "match necesita al menos 2 pares");
    if (q.t === "order" && (!Array.isArray(q.items) || q.items.length < 2)) err(w, "order necesita al menos 2 elementos");
    if (q.p && !(s.passages && s.passages[q.p])) err(w, `el texto "${q.p}" no existe en passages`);
  });
  if (count.f < 3) err(sw, `tiene ${count.f} preguntas fáciles (mínimo 3)`);
  if (count.m < 3) err(sw, `tiene ${count.m} preguntas medias (mínimo 3)`);
  if (count.d < 2) err(sw, `tiene ${count.d} desafíos (mínimo 2)`);
}
if (bank.subjects?.some((s) => s.dictation)) {
  if (!bank.dictation || !Object.keys(bank.dictation).length) err("dictado", "hay una materia con dictado pero no hay listas");
  for (const [k, v] of Object.entries(bank.dictation || {})) if (!Array.isArray(v) || v.length < 10) err(`dictado ${k}`, "necesita al menos 10 palabras");
}
const mixPool = (bank.subjects || []).flatMap((s) => (s.questions || []).filter((q) => !q.p));
for (const [lv, n] of [["f", 4], ["m", 3], ["d", 3]]) if (mixPool.filter((q) => q.lv === lv).length < n) err("relámpago", `faltan preguntas nivel ${lv} sin texto de lectura`);

if (errors.length) { console.error(`banco.json tiene ${errors.length} problema(s):\n- ` + errors.join("\n- ")); process.exit(1); }
const total = bank.subjects.reduce((a, s) => a + s.questions.length, 0);
console.log(`banco.json OK: ${bank.subjects.length} materias, ${total} preguntas.`);
