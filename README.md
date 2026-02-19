# lml-editor

Repositorio público de despliegue de `lml-editor-lit` en GitHub Pages.

## Proceso de construcción de `lml-editor-lit` en GitHub Pages

La build que termina publicada en GitHub Pages **se ejecuta en este repo (`lml-editor`)**, pero el código fuente se toma desde el repo privado `lml-editor-lit`.

### Flujo automático (recomendado)

1. Se crea un tag en `lml-editor-lit`.
2. La action `lml-editor-lit/.github/workflows/dispatch-public-deploy.yml` dispara un `repository_dispatch` al repo `lml-editor` con el evento `lml-editor-deploy`.
3. En `lml-editor/.github/workflows/deploy-from-tag.yml`:
   1. Se recibe el tag.
   2. Se clona `lml-editor-lit` en ese tag.
   3. Se construye el editor con `vite build`.
   4. Se publica `dist/` en GitHub Pages.

### Flujo manual

También se puede lanzar manualmente desde GitHub Actions en `lml-editor`:

1. Ir a `Actions -> Deploy from private tag -> Run workflow`.
2. Indicar el `tag` de `lml-editor-lit` que quieres desplegar.

### Variables de entorno usadas en la build de Pages

En la action `lml-editor/.github/workflows/deploy-from-tag.yml`, el paso `Build editor` compila con:

- `INIT_MESSAGE_SHOW="false"`
- `SHOW_FOOTER_SPONSORS="false"`
- `INIT_MESSAGE_TIMEOUT="0"`
- `URL_SCRATCH="https://learningml-education.github.io/lml-scratch/?"`
- `BASE_URL="/lml-editor/"`

Con esto, el build queda preparado para publicarse en el subpath de GitHub Pages correspondiente a `lml-editor`.

## Proceso de construcción de `lml-scratch` en GitHub Pages

Aunque este repositorio publica `lml-editor`, el flujo de `lml-scratch` está acoplado porque el editor apunta a su URL pública.

### Flujo automático

1. Se crea un tag en `lml-scratch-gui`.
2. La action `lml-scratch-gui/.github/workflows/dispatch-public-deploy.yml` envía un `repository_dispatch` al repo público `lml-scratch` con el evento `lml-scratch-deploy`.
3. En `lml-scratch/.github/workflows/deploy-from-tag.yml`:
   1. Se clonan en ese tag: `lml-scratch-l10n`, `lml-scratch-vm` y `lml-scratch-gui`.
   2. Se construye `l10n`, se enlazan dependencias con `npm link`, y se genera el build de `lml-scratch-gui` con `BUILD_MODE=dist`.
   3. Se publica `lml-scratch-gui/build` en GitHub Pages.

### Flujo manual

En el repo `lml-scratch`:

1. Ir a `Actions -> Deploy from private tag -> Run workflow`.
2. Indicar el `tag` a desplegar.

### Variables de entorno relevantes

En la action de `lml-scratch` se usa:

- `MOBILENET_BASE_URL: ${{ vars.MOBILENET_BASE_URL }}`

El job está asociado al environment `github-pages`, por lo que esa variable debe definirse en ese environment para que esté disponible en build.
