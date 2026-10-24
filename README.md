# Repaso 3er grado

Juego de repaso para 3er grado: Comunicación, Guaraní, Matemática, Vida Social y Trabajo, Language Arts, Science and Health y Social Studies. Tiene partidas de 8 preguntas, desafío relámpago, tarjetas y dictado.

La guía para padres está en [`padres.html`](padres.html) (también se abre desde el sitio).

## Cómo se guarda el avance

- Cada chico crea su perfil (nombre o apodo y un dibujito). En un mismo celular puede haber varios hermanos, cada uno con su avance.
- Todo queda en el navegador de ese equipo (`localStorage`, clave `repaso3-v2`). No hay servidor, cuentas, analytics ni cookies.
- Por pregunta se guarda: intentos, aciertos y si la última vez salió bien. "Dominada" = la última vez salió bien.
- Las partidas traen primero las preguntas nunca vistas, después las erradas. "Repasar mis errores" juega solo las erradas.
- Hay misión del día, racha de días, 14 medallas y un informe por chico que se puede imprimir.
- **Código de avance:** el chico lo copia y lo pega en otro equipo. Solo viaja si una persona lo manda.
- El selector "¿Quién juega?" muestra nombres y dibujitos, nunca puntajes.

> En iPhone, Safari puede borrar los datos de un sitio que no se abre en 7 días, salvo que esté agregado a la pantalla de inicio. Por eso la guía para padres pide agregarlo, y el código de avance sirve de copia de seguridad.

## Desarrollo

```bash
npm install
npm run serve        # http://localhost:8806
npm run validate     # valida banco.json
npm test             # Playwright, celular de 375 px
```

- `banco.json` es la fuente de verdad del contenido. Cada pregunta tiene un `id` estable (`mat-07`): **no reutilizar ni renumerar ids**, porque el avance de los chicos está atado a ellos. Para agregar una pregunta, usar el siguiente número libre.
- Al publicar cambios, subir `VERSION` en `sw.js` para que los equipos bajen la versión nueva.
- Las fuentes (Baloo 2 y Nunito, licencia OFL) están en `fonts/`, con los subconjuntos que incluyen ẽ ĩ ũ ỹ.

## Publicar en GitHub Pages

1. Crear el repo en GitHub y subir esta carpeta a `main`.
2. En *Settings → Pages*, elegir **GitHub Actions** como fuente.
3. El workflow valida el banco, corre los tests y publica.
4. Generar el QR: `npm run qr -- https://USUARIO.github.io/repaso-3er-grado/`

El handoff original está en `docs/HANDOFF.md`.
