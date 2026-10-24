import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const bank = JSON.parse(readFileSync(new URL("../banco.json", import.meta.url), "utf8"));
const ALL = bank.subjects.flatMap((s) => s.questions.map((q) => ({ ...q, sid: s.id })));

/* Cada test arranca con el almacenamiento vacío y vigila consola y red. */
test.beforeEach(async ({ page }, info) => {
  info.consoleErrors = [];
  info.foreign = [];
  page.on("console", (m) => { if (m.type() === "error") info.consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => info.consoleErrors.push(String(e)));
  page.on("request", (r) => { const u = new URL(r.url()); if (!["localhost", "127.0.0.1"].includes(u.hostname) && u.protocol.startsWith("http")) info.foreign.push(r.url()); });
});
test.afterEach(async ({ page }, info) => {
  expect(info.consoleErrors, "errores de consola").toEqual([]);
  expect(info.foreign, "peticiones a terceros").toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "scroll horizontal a 375 px").toBeLessThanOrEqual(0);
});

async function newPlayer(page, name) {
  await page.getByPlaceholder("Tu nombre").fill(name);
  await page.getByRole("button", { name: "¡Empezar!" }).click();
  await expect(page.getByRole("heading", { name: `¡Hola, ${name}!` })).toBeVisible();
}

/* Responde la pregunta en pantalla. right=false la contesta mal a propósito. */
async function answer(page, right = true) {
  const card = page.locator("section.card").last();
  const text = (await card.locator("p.q").innerText()).trim();
  const opts = await card.locator(".opt").allInnerTexts();
  let cands = ALL.filter((q) => q.q === text);
  if (cands.length > 1 && opts.length) cands = cands.filter((q) => opts.includes(q.a));
  const q = cands[0];
  expect(q, `pregunta del banco: ${text}`).toBeTruthy();
  if (q.t === "mc") {
    const target = right ? q.a : q.o.find((o) => o !== q.a);
    await card.locator(".opt", { hasText: new RegExp(`^${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).first().click();
  } else if (q.t === "tf") {
    await card.locator(".opt").nth(q.a === right ? 0 : 1).click();
  } else if (q.t === "fill") {
    await card.locator("input.fill").fill(right ? String(q.a[0]) : "zzz");
    await card.getByRole("button", { name: /Comprobar|Check/ }).click();
  } else if (q.t === "match") {
    const sels = card.locator("select");
    for (let i = 0; i < q.pairs.length; i++) {
      const val = right ? q.pairs[i][1] : q.pairs[(i + 1) % q.pairs.length][1];
      await sels.nth(i).selectOption({ label: val });
    }
    await card.getByRole("button", { name: /Comprobar|Check/ }).click();
  } else if (q.t === "order") {
    if (right) {
      for (let i = 0; i < q.items.length; i++) {
        const now = await card.locator(".oitem span:nth-child(2)").allInnerTexts();
        let j = now.indexOf(q.items[i]);
        while (j > i) { await card.locator(".oitem").nth(j).getByRole("button").first().click(); j--; }
      }
    }
    await card.getByRole("button", { name: /Comprobar|Check/ }).click();
  }
  await expect(card.locator(".fb")).toHaveClass(right || q.t === "order" ? /fb/ : /bad/);
  await card.getByRole("button", { name: /Siguiente|Next|Ver resultado|See my score/ }).click();
  return q;
}

async function playRound(page, n, right = true) {
  const seen = [];
  for (let i = 0; i < n; i++) seen.push(await answer(page, right));
  await expect(page.locator(".card.end h2")).toHaveText(new RegExp(`^${right ? n : 0} / ${n}$`));
  return seen;
}

test("pide nombre y lo recuerda al volver", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Sofi");
  await page.reload();
  await expect(page.getByRole("heading", { name: "¡Hola, Sofi!" })).toBeVisible();
});

test("partida completa en cada materia y el avance queda guardado", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Tomi");
  for (const s of bank.subjects) {
    await page.locator("button.subj", { hasText: s.name }).click();
    await page.locator("button.mode", { hasText: s.lang === "es" ? "Jugar" : "Play" }).click();
    const qs = await playRound(page, 8);
    const order = qs.map((q) => q.lv).join("");
    expect(order).toBe("fffmmmdd");
    await expect(page.locator(".bigstars b")).toHaveCount(3);
    await page.locator("button.back").click();
    await expect(page.locator(".band")).toContainText(s.lang === "es" ? `Dominás 8 de ${s.questions.length}` : `You know 8 of ${s.questions.length}`);
    await page.locator("button.back").click();
  }
  await page.reload();
  for (const s of bank.subjects) await expect(page.locator("button.subj", { hasText: s.name })).toContainText(`8/${s.questions.length}`);
  await page.getByRole("button", { name: /medallas/ }).click();
  for (const name of ["Primera partida", "Tres estrellas", "Partida perfecta", "Explorador", "Bilingüe"]) await expect(page.locator(".medal.got", { hasText: name })).toBeVisible();
});

test("la segunda partida trae primero preguntas que todavía no vio", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Ana");
  await page.locator("button.subj", { hasText: "Matemática" }).click();
  await page.locator("button.mode", { hasText: "Jugar" }).click();
  const first = (await playRound(page, 8)).map((q) => q.id);
  await page.getByRole("button", { name: "Jugar otra vez" }).click();
  const second = (await playRound(page, 8)).map((q) => q.id);
  expect(second.filter((id) => first.includes(id))).toEqual([]);
});

test("desafío relámpago", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Leo");
  await page.getByRole("button", { name: /Desafío relámpago/ }).click();
  const qs = await playRound(page, 10);
  expect(qs.every((q) => !q.p)).toBe(true);
  expect(qs.map((q) => q.lv).join("")).toBe("ffffmmmddd");
});

test("los errores quedan para repasar y se pueden corregir", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Juli");
  await page.locator("button.subj", { hasText: "Science and Health" }).click();
  await page.locator("button.mode", { hasText: "Play" }).click();
  await playRound(page, 8, false);
  await page.locator("button.back").click();
  const fix = page.locator("button.mode", { hasText: "Fix my mistakes" });
  await expect(fix).toContainText("8 questions");
  await fix.click();
  await playRound(page, 8, true);
  await page.locator("button.back").click();
  await expect(page.locator("button.mode", { hasText: "Fix my mistakes" })).toHaveCount(0);
  await expect(page.locator(".band")).toContainText("You know 8 of");
});

test("cada chico tiene su avance y el selector no muestra puntajes", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Mati");
  await page.getByRole("button", { name: /Desafío relámpago/ }).click();
  await playRound(page, 10);
  await page.locator("button.back").click();
  await page.getByRole("button", { name: "Cambiar de jugador" }).click();
  await expect(page.getByRole("heading", { name: "¿Quién juega?" })).toBeVisible();
  await expect(page.locator(".who-grid")).not.toContainText(/★|\d+\s*\//);
  await page.getByRole("button", { name: /Soy nuevo/ }).click();
  await newPlayer(page, "Caro");
  await expect(page.getByRole("button", { name: /0 de 14 medallas/ })).toBeVisible();
  await page.getByRole("button", { name: "Cambiar de jugador" }).click();
  await page.locator(".who-btn", { hasText: "Mati" }).click();
  await expect(page.getByRole("button", { name: /medallas/ })).not.toContainText("0 de 14");
});

test("el código de avance lleva el progreso a otro equipo", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await newPlayer(page, "Nico");
  await page.locator("button.subj", { hasText: "Guaraní" }).click();
  await page.locator("button.mode", { hasText: "Jugar" }).click();
  await playRound(page, 8);
  await page.locator("button.back").click();
  await page.locator("button.back").click();
  await page.getByRole("button", { name: /Llevar mi avance/ }).click();
  await expect(page.locator("textarea.code")).toHaveValue(/^R3[JZ]-/);
  const code = await page.locator("textarea.code").inputValue();
  await page.evaluate(() => localStorage.clear());
  await page.goto("/");
  await page.getByRole("button", { name: "Tengo un código de avance" }).click();
  await page.locator("textarea.code").fill(code);
  await page.getByRole("button", { name: "Recuperar mi avance" }).click();
  await expect(page.getByRole("heading", { name: "¡Hola, Nico!" })).toBeVisible();
  await expect(page.locator("button.subj", { hasText: "Guaraní" })).toContainText("8/");
  await page.getByRole("button", { name: /Mi informe/ }).click();
  await expect(page.locator(".report")).toContainText("Domina 8 de");
});

test("un código roto no rompe nada", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Tengo un código de avance" }).click();
  await page.locator("textarea.code").fill("R3Z-esto-no-sirve");
  await page.getByRole("button", { name: "Recuperar mi avance" }).click();
  await expect(page.locator(".fb.bad")).toContainText("no funciona");
});

test("tarjetas y dictado", async ({ page }) => {
  await page.goto("/");
  await newPlayer(page, "Vale");
  await page.locator("button.subj", { hasText: "Social Studies" }).click();
  await page.locator("button.mode", { hasText: "Flashcards" }).click();
  const n = bank.subjects.find((s) => s.id === "ss").cards.length;
  for (let i = 0; i < n; i++) {
    await page.getByRole("button", { name: "Flip", exact: true }).click();
    await expect(page.locator(".fcard .backside")).toBeVisible();
    if (i < n - 1) await page.getByRole("button", { name: "Next →" }).click();
  }
  await expect(page.locator(".toast")).toContainText("Mazo completo");
  await page.locator("button.back").click();
  await expect(page.locator("button.mode", { hasText: "Flashcards" })).toContainText(`${n}/${n}`);
  await page.locator("button.back").click();
  await page.locator("button.subj", { hasText: "Comunicación" }).click();
  await page.locator("button.mode", { hasText: "Dictado" }).click();
  await page.getByRole("button", { name: "Con LL" }).click();
  for (let i = 0; i < 10; i++) {
    await page.getByRole("button", { name: /Ver la palabra/ }).click();
    const w = await page.locator("p.word").innerText();
    await page.locator("input.fill").fill(w);
    await page.getByRole("button", { name: "Comprobar" }).click();
    await page.getByRole("button", { name: /Siguiente palabra|Ver resultado/ }).click();
  }
  await expect(page.locator(".card.end h2")).toHaveText("10 / 10");
  await expect(page.locator(".medal.got", { hasText: "Buena letra" })).toBeVisible();
});

test("se migra el avance de la versión anterior", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem("repaso3-v1", JSON.stringify({ name: "Pepa", best: { mat: 2 } })); });
  await page.reload();
  await expect(page.getByRole("heading", { name: "¡Hola, Pepa!" })).toBeVisible();
  await expect(page.locator("button.subj", { hasText: "Matemática" }).locator(".stars b")).toHaveCount(2);
});

test("funciona sin conexión después de la primera visita", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await newPlayer(page, "Offi");
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "¡Hola, Offi!" })).toBeVisible();
  await page.getByRole("button", { name: /Desafío relámpago/ }).click();
  await playRound(page, 10);
  await context.setOffline(false);
});
