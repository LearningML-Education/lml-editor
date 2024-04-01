# Entorno de desarrollo

Requisitos: node 20.11.0

1. clonar el proyecto: 
```
git@gitlab.com:lml-corp/lml-editor-lit.git
cd lml-editor-lit
```
2. Ejecutar el servidor de desarrollo
```
npm run dev
```
3. Apuntar el navegador web a `http://localhost:5173`

# Traducciones

En el archivo `lit-localize.json` se configura el sistema de traducción. Lo importante es el atributo `targetLocales`, donde se especifica en un array los idiomas a los que se traducirá la aplicación.

Para construir los archivos xliff se ejecuta el comando:
```

./node_modules/@lit/localize-tools/bin/lit-localize.js extract

```
Que genera la carpeta `xliff` con los archivos de traducción. Se editan estos ficheros con las traducciones correspondientes.

A continuación se generan los archivos javascript que usa la aplicación para traducir lanzando el comando:
```

./node_modules/@lit/localize-tools/bin/lit-localize.js build

```
Referencia: https://lit.dev/docs/localization/overview/

# Arquitectura
## Estructura de componentes

Fichero fuente: [[Estructura-lml-editor-lit.excalidraw]]

  ![[Estructura-lml-editor-lit.excalidraw.png]]
  
El primer componente que se carga, denominado componente raíz, es `lml-app`. Este componente crea todos los proveedores de contextos que usa la aplicación. Un [proveedor de contexto](https://lit.dev/docs/data/context/) es un mecanismo que *lit* utiliza para gestionar datos que son transversales a todos los componentes. Se crean lo siguientes contextos:

- configContext, para almacenar la configuración de la aplicación. 
```
{
    defaultLanguage: "es",
    initMessage: {
        show: true,
        title: "Atención",
        message: "LearningML necesita tu ayuda."
    },
    urlBase: "http://localhost:5173"
}
```

- statusContext, para almacenar el estado de la aplicación.
```
{
	modelEditor: "text",
	modelName: "Untitled",
	dimension: 0
}
```
- datasetProvider, es un mapa (Map) de javascript que almacena el conjunto de datos (textos, imágenes, números) y sus etiquetas:
```

```