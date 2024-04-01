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
  
## Proveedores de contexto
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
- datasetProvider, es un mapa de javascript (Map)  que almacena el conjunto de datos (textos, imágenes, números) y sus etiquetas. Las claves son las etiquetas y los valores son conjuntos de javascript (Set) con los textos, imágenes (en Base64) o conjuntos de números (números separados por comas).
	
Un ejemplo de dataset de textos
![[Pasted image 20240401173454.png]]

Un ejemplo de dataset de imágenes
![[Pasted image 20240401173819.png]]

Un ejemplo de dataset de números
![[Pasted image 20240401180127.png]]

- featuresProvider, es un mapa (Map) que almacena el conjunto de datos (texto, imagen, número) codificados y sus etiquetas, es decir, almacena las características una vez extraídas de los datos originales. Tiene la misma estructura que el datasetProvider pero los elementos de cada conjunto son datos codificados, esto es, características extraídas desde los elementos originales usando algún tipo de codificación.

Un ejemplo de featureset. Valdría para cualquier tipo de datos (texto, imagen, número), pues la extracción de características o codificación se representa con un Tensor en todos los casos.
![[Pasted image 20240401181046.png]]

- encodingContext, es un objeto que almacena el extractor de características (o codificador) que se usará para cada tipo de datos (texto, imagen o número). Estos codificadores se aplican sobre los elementos del dataset para construir el featureset.
```
{
	text: use.load(),
	image: mobilenet.get(),
	numerical: numericalEncoder()
}
```
- modelContext, es un objeto que representa el modelo que será construido en el proceso de aprendizaje. Por ejemplo una red neuronal feedfoward  o un algoritmo KNN. En realidad modelContext contiene tanto al algoritmo de Machine Learning como al modelo.

Desde cualquier componente hijo se puede acceder a los datos almacenados en estos proveedores a través de los consumidores de contexto. Por ejemplo para acceder a los datos del datasetProvider se haría lo siguiente:

```
import {datasetContext} from 'ruta/a/context.js'
...
export class ComponenteQueSea extends LitElement {
	_datasetConsumer = new ContextConsumer(this, { context: datasetContext });
...
funcionQueSea(){
	let dataset = this._datasetConsumer.value;
}
...
```

