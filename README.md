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
URL_SCRATCH=https://learningml-education.github.io/scratch/? \
bun run build
```

## Tests

El proyecto usa dos tipos de ejecución de tests:

- `bun test` para unitarios, componentes e integración ligera.
- `playwright` para tests E2E en navegador real.

### Ejecutar tests unitarios e integración

Ejecutar toda la suite de `bun:test`:

```bash
bun test
```

Con cobertura:

```bash
bun test --coverage
```

También se puede usar el script de `package.json`:

```bash
npm run test
npm run test:coverage
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

Modo visible (headed):

```bash
bun run test:e2e:headed
```

Notas:
- La configuración está en `playwright.config.js`.
- Los tests E2E están en `tests/e2e/`.


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
