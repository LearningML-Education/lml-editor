## Entorno de desarrollo

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
docker build -t lml-editor:dev . -f Dockerfile-dev
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
    --rm -d lml-editor:dev
```

Se accede a través de `http://localhost:5173`

Este procedimiento no arranca *lml-scratch*. Si se quiere trabajar con *lml-scratch* clonar el proyecto [`https://gitlab.com/lml-corp/lml-dev`](https://gitlab.com/lml-corp/lml-dev) y seguir las instrucciones del `README.md`. 

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
|`URL_SCRATCH`|http://localhost:8888/scratch|URL de la instancia de Scratch|

## Traducciones

En el archivo `lit-localize.json` se configura el sistema de traducción. Lo importante es el atributo `targetLocales`, donde se especifica en un array los idiomas a los que se traducirá la aplicación.

Para construir los archivos xliff se ejecuta el comando:
```

./node_modules/.bin/lit-localize extract

```
Que genera la carpeta `xliff` con los archivos de traducción. Se editan estos ficheros con las traducciones correspondientes.

A continuación se generan los archivos javascript que usa la aplicación para traducir lanzando el comando:
```

./node_modules/.bin/lit-localize build

```
Referencia: https://lit.dev/docs/localization/overview/
## Estructura de componentes

![Estructura de componentes](./doc/img-doc/Estructura-lml-editor-lit.excalidraw.png)
