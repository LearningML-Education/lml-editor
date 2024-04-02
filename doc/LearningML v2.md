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

## Producir un evento en un componente y detectarlo en otro componente hermano

Cuando emitimos un evento en un componente, este se transmite hacia arriba, de manera que cualquier componente padre puede capturarlo y actuar en consecuencia. Sin embargo, los componentes que están en una rama distinta a la de sus ascendientes, no lo pillan. Por ejemplo, un evento que se origina en el componente `mode-togle-menu` no se puede detectar en el componente `model-learn`. Sin embargo, necesitamos que cuando se haga clic en el botón que cambia del modo básico al avanzado

![[Pasted image 20240401191907.png]]
el componente `model-learn` oculte o muestre los elementos avanzados.  Este problema lo resolvemos de la siguiente manera. Cuando se hace clic en el botón, se lanza un evento desde el componente `mode-toggle-menu`:

```
handleToggleClick() {
    this.advanced = !this.advanced;

    this.dispatchEvent(new CustomEvent('toggle-advanced-mode', {
      bubbles: true
    }));
  }
```

Y se captura en el componente raíz `lml-app` al que, llegan todos los eventos por ser el padre de todos los componentes. Una vez capturado se modifica la propiedad `advancedMode` del componente raíz:
```
this.addEventListener("toggle-advanced-mode", e => {
	this.advancedMode = !this.advancedMode;
	this.requestUpdate();
});
```
Y esta propiedad es transmitida como atributo del único componente hijo que lleva hasta `model-learn`, es decir a través de `model-editor`. Esto significa que, tanto el componente `model-editor` como `model-learn` deben definir `advancedMode` como una propiedad. 
```
static properties = {
	...
    advancedMode: { type: Object, attribute: 'advanced-mode' },
    ...
  }
```
>[!info] Atención
>Observa que la propiedad que se define en los componentes `model-editor` como `model-learn` no es booleana, es un objeto con un atributo booleano. La explicación de esto es un tanto sutil y se debe a que en HTML un atributo booleano no requiere un valor específico para ser válido. Si el atributo está presente en el elemento, se considera verdadero, mientras que si está ausente, se considera falso. Y esto en un problema para pasarlo dinámicamente desde un componente a otro.

Y la propiedad se pasa como en cualquier elemento HTML:

en `lml-app` se usa el componente `model-editor`
```
<model-editor advanced-mode='{"enabled": ${this.advancedMode}}'>
</model-editor>
```
y en `model-editor` se usa el componente `model-learn`
```
<model-learn advanced-mode='{"enabled": ${this.advancedMode.enabled}}'>
</model-learn>
```

El siguiente diagrama muestra esquemáticamente todo lo anterior:
![[Paso-de-mensajes-entre-componentes.excalidraw.png]]

> [!info] Una alternativa más simple pero que no funciona (lo he probado)
> En principio, en lugar de hacer todo este trasiego de información desde el disparo del evento en `mode-togle-menu`hasta la reacción del componente `lml-learn` para mostrar/ocultar los controles del modo avanzado, podría simplificarse usando un contexto de lit. Por ejemplo se podría usar el `statusContext` y agregarle un atributo `advancedMode`. Cuando el usuario hace clic en el botón de cambio de modo, se modificaría este atributo, el cual estaría inmediatamente disponible en todos los componentes. Sin embargo, aunque esto es así, el DOM no detecta este cambio, con lo cual no puede reaccionar para mostrar/ocultar los controles del modo avanzado.

# Extractores de características (Feature extractors)

Los modelos de ML solo pueden operar con vectores numéricos, es decir, cualquier cosa que se quiera reconocer con un modelo de ML debe ser previamente convertida a un vector. A este proceso de codificación se le conoce como *extracción de características*.

A partir de ahora al artefacto que extrae las características le llamaremos *encoder*. Cada tipo de dato tiene sus propios *encoders*. Observese que usamos el plural, pues un mismo tipo de datos puede tener muchos *encoders* distintos. Por ejemplo, los textos pueden ser codificados por los siguientes *encoders*:

- Bag Of Words with One hot encoding
- [Word2Vec](https://es.wikipedia.org/wiki/Word2vec)
- Text Embbedings (hay un montón de estos y están basados en transformers)
- y muchos más

El código de LearningML se ha diseñado para poder añadir tantos *encoders* como se quiera para cada tipo de datos. Los *encoders* deben implementarse como una función que devuelve una Promesa (Promise) cuyo valor devuelto una vez resuelta es un objeto con un atributo `embed`, que a su vez es una función con un argumento, que se corresponde con un array de ítems para codificar y devuelve otra Promesa cuyo valor devuelto al resolverse es un Tensor con todos los ítems codificados cuya shape es (N, D), siendo N el nº de ítems codificados y D la dimensión del vector resultante al codificar el ítem.