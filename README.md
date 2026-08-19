# lml-editor

Repositorio de referencia del editor LearningML: contiene el código fuente y publica
directamente en GitHub Pages (`https://learningml.org/lml-editor/`).

## Despliegue en GitHub Pages

La build que se publica en GitHub Pages se construye y despliega en este mismo repo, sin
depender de ningún otro.

### Flujo automático

1. Se crea y empuja un tag de versión con el patrón `vX.Y.Z` (por ejemplo `v2.0.1`) en este repo
   (`lml-editor`). Tags que no siguen ese patrón exacto (por ejemplo `v2.0.0-beta1` o `latest`)
   no disparan el despliegue.
2. El workflow `.github/workflows/deploy.yml` (disparado por `push: tags: v[0-9]+.[0-9]+.[0-9]+`):
   1. Instala dependencias con Bun y ejecuta `bun run test`.
   2. Construye el editor con `bun run build` (`vite build`).
   3. Publica `dist/` en GitHub Pages.

### Flujo manual

También se puede lanzar manualmente desde GitHub Actions: `Actions -> Deploy to GitHub Pages ->
Run workflow`, sobre la rama o tag que se quiera desplegar.

### Variables de entorno usadas en la build de Pages

En el paso `Build editor` de `deploy.yml` se compila con:

- `INIT_MESSAGE_SHOW="false"`
- `SHOW_FOOTER_SPONSORS="true"`
- `INIT_MESSAGE_TIMEOUT="0"`
- `URL_SCRATCH="https://learningml.org/lml-scratch-gui/?"`
- `BASE_URL="/lml-editor/"`

Con esto, el build queda preparado para publicarse en el subpath de GitHub Pages correspondiente
a `lml-editor`.

## Proceso de construcción de `lml-scratch` en GitHub Pages

Aunque este repositorio publica `lml-editor`, el flujo de `lml-scratch` está acoplado porque el
editor apunta a su URL pública. Este proceso vive en otros repos y no se ve afectado por lo
anterior.

### Flujo automático

1. Se crea un tag en `lml-scratch-gui`.
2. La action `lml-scratch-gui/.github/workflows/dispatch-public-deploy.yml` envía un
   `repository_dispatch` al repo público `lml-scratch` con el evento `lml-scratch-deploy`.
3. En `lml-scratch/.github/workflows/deploy-from-tag.yml`:
   1. Se clonan en ese tag: `lml-scratch-l10n`, `lml-scratch-vm` y `lml-scratch-gui`.
   2. Se construye `l10n`, se enlazan dependencias con `npm link`, y se genera el build de
      `lml-scratch-gui` con `BUILD_MODE=dist`.
   3. Se publica `lml-scratch-gui/build` en GitHub Pages.

### Flujo manual

En el repo `lml-scratch`:

1. Ir a `Actions -> Deploy from private tag -> Run workflow`.
2. Indicar el `tag` a desplegar.

### Variables de entorno relevantes

En la action de `lml-scratch` se usa:

- `MOBILENET_BASE_URL: ${{ vars.MOBILENET_BASE_URL }}`

El job está asociado al environment `github-pages`, por lo que esa variable debe definirse en ese
environment para que esté disponible en build.

## Entorno de desarrollo con docker

Requisitos: docker 27.1.1

1. Clonar el proyecto: 
```bash
git clone git@gitlab.com:lml-corp/lml-editor-lit.git
```

2. Clonar la dependencia lml-algorithm
```bash
git clone git@gitlab.com:lml-corp/lml-algorithms.git
```

3. Construir una imagen para el desarrollo
```bash
cd lml-editor-lit
docker build -t lml-editor . 
```

4. Arrancar un contenedor de desarrollo

```bash
docker run -v ${PWD}/src:/app/src \
    -v ${PWD}/public:/app/public \
    -v ${PWD}/xliff:/app/xliff \
    -v ${PWD}/vite.config.js:/app/vite.config.js \
    -v ${PWD}/.env:/app/.env \
    -v ${PWD}/../lml-algorithms:/app/node_modules/lml-algorithms \
    -p 5173:5173 \
    --rm -d lml-editor
```

Se accede a través de `http://localhost:5173`

Este procedimiento no arranca *lml-scratch*. Si se quiere trabajar con *lml-scratch* clonar el proyecto [`https://gitlab.com/lml-corp/lml-dev`](https://gitlab.com/lml-corp/lml-dev) y seguir las instrucciones del `README.md`. 

## Entorno de desarrollo sin docker

1. Clonar el proyecto: 
```bash
git clone git@gitlab.com:lml-corp/lml-editor-lit.git
```

2. Clonar la dependencia lml-algorithm (opcional si se va a tocar código de lml-algorithm)
```bash
git clone git@gitlab.com:lml-corp/lml-algorithms.git
```

2.1 Instalar dependencias lml-algorithms

```bash
cd lml-algorithms.git
bun install
bun link
cd ..
```

2. Instalar dependencias lml-editor-lit

```bash
cd lml-editor-lit.git
bun install
bun link lml-algorithms (opcional)
```

3. Levantar servidor de desarrollo

```
bun run dev
```

Con esto se tiene la aplicación corriendo en http://localhost:5173

### Dev: Scratch bajo el mismo dominio (localStorage compartido)

En desarrollo, Scratch suele correr en otro puerto (por ejemplo 8601). Para compartir `localStorage` con el editor (Vite en 5173), el dev server hace proxy de Scratch bajo `/scratch/`, de modo que ambos quedan en el mismo origen.

Pasos:
1. Arranca Scratch en `http://localhost:8601`.
2. Arranca el editor en `http://localhost:5173`.
3. Accede a Scratch a traves de `http://localhost:5173/scratch/`.

El proxy esta configurado en `vite.config.js` con `server.proxy` y reescritura de ruta.

### Uso de algoritmos locales vs API

Por defecto, el editor usa algoritmos locales (`LML_ALGO_MODE=client`).

Para ejecutar los algoritmos en el servidor:

```bash
LML_ALGO_MODE=server LML_ALGO_BASE_URL=http://localhost:3000 bun run dev
```

Para forzar el modo local:

```bash
LML_ALGO_MODE=client bun run dev
```

## Construcción de un desplegable de producción

1. Clonar el proyecto: 
```bash
git clone git@gitlab.com:lml-corp/lml-editor-lit.git
```

2. Construir la imagen de producción:
```bash
cd lml-editor-lit
docker build -t lml-editor:prod .
```

3. Arrancar el contendor:
```bash
docker run -p 8080:80 --rm -d lml-editor:prod
```

>Nota: 

## Fichero `.env`

En el despliegue de desarrollo, es decir, usando el `docker-compose.yml` del proyecto `lml-dev` (que usa `Dockerfile-dev`), la aplicación se configura a través de variables de entorno que se declara en el fichero `.env`. Pot tanto, se pueden cambiar los valores de estas variables en tiempo de ejecución. 

En el despliegue de producción (`Dockerfile`), la aplicación se configura a través de las variables de entorno de tipo ARG que se declaran en el `Dockerfile`. Si se desean cambiar hay que usar `--build-arg` en la instrucción de creación de la imagen. Solo se pueden cambiar estas variables en tiempo de construcción


|variable| Valor por defecto| Descripción|
|--|--|--|
|`INIT_MESSAGE_SHOW`|true| Para mostrar un mensaje de inicio|
|`INIT_MESSAGE_TITLE`|Atención|Título del mensaje de inicio|
|`INIT_MESSAGE_DESCRIPTION`|LearningML necesita tu ayuda|Descripción del mensahe de incio|
|`INIT_MESSAGE_TIMEOUT`|3000|Tiempo en milisegundos durante el que se mostrará el mensaje de incio|
|`SHOW_FOOTER_SPONSORS`|true|Mostrar o no la parte del footer dedicada a patrocinadores|
|`URL_SCRATCH`|/scratch/|URL de la instancia de Scratch|
|`BASE_URL`|/|Base path de despliegue cuando la app se sirve bajo un subpath (por ejemplo, `/lml-editor/`). Vite sustituye `%BASE_URL%` en `index.html` usando `base`.|
|`LML_ALGO_MODE`|client|Modo de ejecucion de algoritmos: `client` (local en navegador) o `server` (API `/api/lml/v2`)|
|`LML_ALGO_BASE_URL`|""|Base URL para la API de algoritmos cuando `LML_ALGO_MODE=server`|
|`FORCE_CPU_BACKEND_CHROME`|false|Si vale `true`, desactiva WebGL en Chrome forzando backend CPU en TensorFlow.js|

Ejemplo de build con `BASE_URL` para desplegar en subpath:

```bash
BASE_URL=/lml-editor/ \
URL_SCRATCH=https://learningml.org/lml-scratch-gui/? \
bun run build
```

## Tests

El proyecto usa dos runners de tests:

- `bun:test` para unitarios, de componentes y de integración ligera.
- `Playwright` para tests E2E en navegador real.

### Ejecutar tests unitarios e integración

La forma recomendada de ejecutar la suite de Bun es:

```bash
bun run test
```

Ese script encadena:

- `bun run test:unit` para `tests/unit` y `tests/components`
- `bun run test:integration` para `tests/integration`

Si se quiere lanzar toda la suite de `bun:test` directamente:

```bash
bun test
```

`bun test` ignora `tests/e2e` mediante `bunfig.toml`, por lo que no intenta ejecutar los tests de Playwright.

Con cobertura:

```bash
bun run test:coverage
```

Equivalente directo:

```bash
bun test --coverage
```

### Ejecutar tests E2E con Playwright

1. Instalar dependencias del proyecto:

```bash
bun install
```

2. Instalar navegadores de Playwright (una sola vez por entorno):

```bash
npx playwright install chromium
```

3. Ejecutar E2E:

```bash
bun run test:e2e
```

La configuración E2E está en `playwright.config.js`:

- Directorio de tests: `tests/e2e/`
- Navegador configurado: `chromium`
- El servidor de desarrollo se levanta automáticamente antes de ejecutar la suite

Ejecutar un test E2E concreto (por archivo):

```bash
bun run test:e2e -- tests/e2e/quadrants-learn-and-try.spec.js
```

Ejecutar un caso concreto por nombre del test (`--grep`):

```bash
bun run test:e2e -- -g "classify \"1,-4\" as \"IV\""
```

Modo visible (headed):

```bash
bun run test:e2e:headed
```


## Traducciones

En el archivo `lit-localize.json` se configura el sistema de traducción. Lo importante es el atributo `targetLocales`, donde se especifica en un array los idiomas a los que se traducirá la aplicación.

Para construir los archivos xliff se ejecuta el comando:
```

bunx lit-localize extract

```
Que genera la carpeta `xliff` con los archivos de traducción. Se editan estos ficheros con las traducciones correspondientes.

A continuación se generan los archivos javascript que usa la aplicación para traducir lanzando el comando:
```

bunx lit-localize build

```
Referencia: https://lit.dev/docs/localization/overview/
## Estructura de componentes

![Estructura de componentes](./doc/img-doc/Estructura-lml-editor-lit.excalidraw.png)
