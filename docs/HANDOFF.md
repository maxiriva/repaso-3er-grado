# Handoff: Repaso 3er grado — sitio para compartir con el grado

## Qué es

Un juego de repaso web para alumnos de 3er grado (8–9 años) del Colegio Internacional de Asunción. Cubre siete materias del temario de evaluaciones:

- Comunicación
- Guaraní
- Matemática
- Vida Social y Trabajo
- Language Arts (inglés)
- Science and Health (inglés)
- Social Studies (inglés)

Ya funciona como una sola página HTML. Ahora hay que convertirlo en un sitio estático y publicarlo con un link que se pueda mandar al grupo de padres.

## Qué hay en este paquete

| Archivo | Qué es |
| --- | --- |
| `index.html` | La app completa y funcional, con el banco de preguntas incluido. Se abre con doble clic. |
| `banco.json` | El banco de preguntas por separado: 125 preguntas, tarjetas de vocabulario y listas de dictado. Es la fuente de verdad del contenido. |
| `app.template.html` | La app sin datos. Tiene el marcador `/*BANK*/` donde se inserta el JSON. |
| `build.py` | Inserta `banco.json` en la plantilla y genera `index.html`. |

## Qué hace hoy la app

- Pide nombre o apodo al entrar. Se guarda solo en `localStorage`.
- Por materia ofrece tres modos:
  - **Jugar:** sortea 8 preguntas (3 fáciles, 3 medias, 2 desafíos) y las muestra siempre de fácil a difícil.
  - **Tarjetas:** vocabulario que se da vuelta.
  - **Dictado:** solo en Comunicación. Usa `speechSynthesis` en español y tiene un botón para que un adulto vea la palabra.
- **Desafío relámpago:** 10 preguntas mezcladas de todas las materias. Excluye las que dependen de un texto de lectura.
- Tipos de pregunta: `mc`, `tf`, `fill` (texto o numérica), `match` y `order`. Matemática incluye modelos de barras en HTML.
- Al terminar muestra estrellas (90 % o más = 3, 70 % o más = 2) y la lista de errores para repasar.
- Tiene modo claro y oscuro, funciona en celular y no carga librerías externas, salvo Google Fonts.

## Esquema de `banco.json`

```json
{
  "subjects": [{
    "id": "com", "name": "Comunicación", "tag": "Español", "lang": "es|en", "color": "com",
    "dictation": true,
    "passages": { "c1": { "title": "...", "text": "...", "gloss": "opcional" } },
    "cards": [["frente", "dorso"]],
    "questions": [
      { "lv": "f|m|d", "t": "mc",    "q": "...", "a": "texto correcto", "o": ["...", "..."], "p": "c1 (opcional)" },
      { "lv": "f",     "t": "tf",    "q": "...", "a": true, "labels": ["Añete", "Japu"] },
      { "lv": "m",     "t": "fill",  "q": "...", "a": ["respuestas aceptadas"], "num": true },
      { "lv": "m",     "t": "match", "q": "...", "pairs": [["izquierda", "derecha"]] },
      { "lv": "d",     "t": "order", "q": "...", "items": ["en el orden correcto"] }
    ]
  }],
  "dictation": { "G": ["..."], "J": ["..."], "H": ["..."], "LL": ["..."], "Y": ["..."] }
}
```

En `mc` la respuesta correcta tiene que estar dentro de `o`. Las opciones se mezclan al mostrarse. En `fill` numérico se ignoran puntos y espacios ("22.000" = "22000").

## Lo que hay que hacer

1. **Armar el repo.** Usar Vite + vanilla JS, o HTML estático puro. No hace falta framework.
    - Separar `banco.json` del código: cargarlo con `fetch` en lugar de insertarlo en el HTML.
    - Mantener el comportamiento actual tal cual.
2. **Validar el contenido.** Crear `scripts/validate-bank.mjs`, que corra en CI y falle si:
    - una pregunta no tiene `lv`, `t` o `q`;
    - en `mc`, `a` no está en `o`;
    - en `match` o `order` hay menos de 2 elementos;
    - una materia tiene menos de 3 preguntas fáciles, 3 medias o 2 desafíos;
    - un `p` apunta a un texto que no existe.
3. **Tests end-to-end con Playwright.**
    - Ingresar nombre.
    - Jugar una partida completa en cada materia y en el desafío relámpago.
    - Abrir tarjetas y dictado.
    - Verificar que no haya errores de consola ni scroll horizontal a 375 px.
4. **Que funcione sin conexión (PWA).** Agregar `manifest.webmanifest` y un service worker simple, para que se pueda "Agregar a pantalla de inicio" y usar sin internet después de la primera visita.
5. **Servir las fuentes desde el propio sitio** (Baloo 2 y Nunito, que incluyen los caracteres del guaraní: ẽ, ĩ, ũ, ỹ). Así no se llama a Google desde la página de los chicos.
6. **Deploy.** GitHub Pages, Netlify o Vercel, en plan gratuito, con HTTPS. Generar un código QR del link para mandar al grupo de padres.
7. **README para padres.** Una página corta: qué es, cómo se usa, que no guarda datos y que el contenido sigue el temario pero no reemplaza el libro.

## Restricciones (no negociables)

- **Privacidad de menores:**
    - sin login ni cuentas;
    - sin backend;
    - sin analytics ni cookies con identificadores;
    - el nombre nunca sale del dispositivo.
- **Sin rankings entre chicos** ni comparaciones públicas de puntajes.
- **Sin publicidad** ni scripts de terceros.
- **Sin nombres reales de alumnos** en el contenido. Los nombres de los textos son inventados.
- **Idiomas:** las materias en inglés siguen en inglés; el resto, en español.

## Fuera de alcance por ahora

- Panel para la maestra.
- Sincronizar progreso entre dispositivos.
- Generar preguntas con IA en vivo.

Si más adelante se quiere que la maestra agregue preguntas, la vía simple es editar `banco.json` en GitHub. El validador protege el formato.

## Contenido: qué revisar antes de compartir

- El banco fue escrito a partir del temario y no copia páginas del libro de texto. Donde un tema depende del libro, el material impreso dice "repasar en el libro".
- **Guaraní:** la grafía y el vocabulario pueden variar según el libro de la escuela. Conviene que un docente de guaraní lo revise.
- **Billetes:** se usan los de la lista oficial del BCP (2.000 a 100.000 Gs). El BCP está renovando el diseño de algunos billetes, pero los valores no cambian.
- Las preguntas de esta versión interactiva son **distintas** a las del cuadernillo impreso, a propósito. Mantener esa separación al agregar contenido.

## Criterios de aceptación

- [ ] El link abre en el celular de un padre sin pedir cuenta.
- [ ] Las 7 materias, el relámpago, las tarjetas y el dictado funcionan.
- [ ] `validate-bank` y los tests de Playwright pasan en CI.
- [ ] Funciona en modo avión después de la primera carga.
- [ ] No hay ninguna petición de red a dominios de terceros (verificar en DevTools).
- [ ] Lighthouse: accesibilidad ≥ 95 y PWA instalable.

## Prompt sugerido para pegar en Claude Code

> Leé HANDOFF.md y los archivos de esta carpeta. Convertí el juego "Repaso 3er grado" en un sitio estático listo para compartir con padres de un grado. Mantené el comportamiento actual, separá banco.json del código, agregá el validador, los tests de Playwright, la PWA offline y las fuentes servidas desde el sitio, y dejalo listo para GitHub Pages con un workflow de deploy. Respetá todas las restricciones de privacidad. Antes de escribir código, mostrame el plan y la estructura de carpetas.
