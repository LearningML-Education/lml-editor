# Traducciones

En el archivo lit-localize.json se configura el sistema de traducción. Lo importante es el `targetLocales`, donde se especifica en un array los idiomas a los que se traducirá la aplicación.

Para construir los archivos xliff se ejecuta el comando:

```
./node_modules/@lit/localize-tools/bin/lit-localize.js extract
```

Que genera la carpeta `xliff` con los archivos de traducción. Se editan estos ficheros con las traducciones correspondientes. 

A continuación se generán los archivos javascript que usa la aplicación para traducir lanzando el comando:

```
./node_modules/@lit/localize-tools/bin/lit-localize.js build 
```

Referencia: https://lit.dev/docs/localization/overview/

## Estructura de componentes

![Estructura de componentes](./doc/img-doc/Estructura-lml-editor-lit.excalidraw.png)
