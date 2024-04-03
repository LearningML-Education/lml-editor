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

# Construcción de un desplegable

Ejecutar la instrucción:
```
npm run build
```

En la carpeta `dist` se generará el código HTML/CSS/JS estático listo para ser desplegado en un servidor web.
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

- *configContext*, para almacenar la configuración de la aplicación. 
```javascript
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

- *statusContext*, para almacenar el estado de la aplicación.
```javascript
{
	modelEditor: "text",
	modelName: "Untitled",
	dimension: 0
}
```
- *datasetContext*, es un mapa de javascript (Map)  que almacena el conjunto de datos (textos, imágenes, números) y sus etiquetas. Las claves son las etiquetas y los valores son conjuntos de javascript (Set) con los textos, imágenes (en Base64) o conjuntos de números (números separados por comas).
	
Un ejemplo de dataset de textos
![[Pasted image 20240401173454.png]]

Un ejemplo de dataset de imágenes
![[Pasted image 20240401173819.png]]

- *featuresContext*, es un mapa (Map) que almacena el conjunto de datos (texto, imagen, número) codificados y sus etiquetas, es decir, almacena las características una vez extraídas de los datos originales. Tiene la misma estructura que el datasetConfig pero los elementos de cada conjunto son datos codificados, esto es, características extraídas desde los elementos originales usando algún tipo de codificación.

Un ejemplo de featureset. Valdría para cualquier tipo de datos (texto, imagen, número), pues la extracción de características o codificación se representa con un Tensor en todos los casos.
![[Pasted image 20240401181046.png]]

- *encodingContext*, es un objeto que almacena el extractor de características (o codificador) que se usará para cada tipo de datos (texto, imagen o número). Estos codificadores son funciones que se aplican sobre los elementos del dataset para construir el featureset.
```javascript
{
	text: useEncode,
	image: mobilenetEncoder,
	numerical: numericalEncoder
}
```
- *modelContext*, es un objeto que representa el modelo que será construido en el proceso de aprendizaje. Por ejemplo una red neuronal feedfoward  o un algoritmo KNN. En realidad modelContext contiene tanto al algoritmo de Machine Learning como al modelo.

En el componente `lml-app` se crean los proveedores de contextos asociados a los contextos anteriores y desde cualquier componente hijo se podrá acceder a los datos almacenados en estos proveedores a través de los consumidores de contexto. Por ejemplo para acceder a los datos del *datasetContext* se haría lo siguiente:

```javascript
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

Cuando emitimos un evento en un componente, este se transmite hacia arriba, de manera que cualquier componente padre puede capturarlo y actuar en consecuencia. Sin embargo, los componentes que están en una rama distinta a la de sus ascendientes, no lo pillan. Por ejemplo, un evento que se origina en el componente `mode-togle-menu` no se puede detectar en el componente `model-learn`. Sin embargo, necesitamos que cuando se haga clic en el botón que conmuta entre el modo básico y el avanzado

![[Pasted image 20240401191907.png]]
el componente `model-learn` oculte o muestre los controles del modo avanzado.  Este problema lo resolvemos de la siguiente manera. Cuando se hace clic en el botón, se lanza un evento desde el componente `mode-toggle-menu`:

```javascript
handleToggleClick() {
    this.advanced = !this.advanced;

    this.dispatchEvent(new CustomEvent('toggle-advanced-mode', {
      bubbles: true
    }));
  }
```

Y se captura en el componente raíz `lml-app` (a él llegan todos los eventos por ser el padre de todos los componentes). Una vez capturado se modifica la propiedad `advancedMode` del componente raíz:
```javascript
this.addEventListener("toggle-advanced-mode", e => {
	this.advancedMode = !this.advancedMode;
	this.requestUpdate();
});
```
Y esta propiedad es transmitida como atributo del único componente hijo que lleva hasta `model-learn`, es decir a través de `model-editor`. Esto significa que, tanto el componente `model-editor` como `model-learn` deben definir `advancedMode` como una propiedad. 
```javascript
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
```html
<model-editor advanced-mode='{"enabled": ${this.advancedMode}}'>
</model-editor>
```
y en `model-editor` se usa el componente `model-learn`
```html
<model-learn advanced-mode='{"enabled": ${this.advancedMode.enabled}}'>
</model-learn>
```

El siguiente diagrama muestra esquemáticamente todo lo anterior:
![[Paso-de-mensajes-entre-componentes.excalidraw.png]]

> [!info] Una alternativa más simple pero que no funciona (lo he probado)
> En principio, todo este trasiego de información desde el disparo del evento en `mode-togle-menu`hasta la reacción del componente `lml-learn` para mostrar/ocultar los controles del modo avanzado, podría simplificarse usando un contexto de lit. Por ejemplo se podría usar el `statusContext` y agregarle un atributo `advancedMode`. Cuando el usuario hace clic en el botón de cambio de modo, se modificaría este atributo, el cual estaría inmediatamente disponible en todos los componentes. Sin embargo, aunque esto es así, el DOM no detecta este cambio, con lo cual no puede reaccionar para mostrar/ocultar los controles del modo avanzado.

# Extractores de características (Feature extractors)

Los modelos de ML solo pueden operar con vectores numéricos, es decir, cualquier cosa que se quiera reconocer con un modelo de ML debe ser previamente convertida a un vector. A este proceso de codificación se le conoce como *extracción de características*.

A partir de ahora al artefacto que extrae las características le llamaremos *encoder*. Cada tipo de dato (texto, imagen, números, etcétera) tiene sus propios *encoders*. Observese que usamos el plural, pues un mismo tipo de datos puede tener muchos *encoders* distintos. Por ejemplo, los textos pueden ser codificados por los siguientes *encoders*:

- Bag Of Words with One hot encoding
- [Word2Vec](https://es.wikipedia.org/wiki/Word2vec)
- Text Embbedings (hay un montón de estos y están basados en transformers)
- y muchos más

El código de LearningML se ha diseñado para poder añadir tantos *encoders* como se quiera para cada tipo de datos. 

Cuando se carga el componente raíz `lml-app` se crea el proveedor de contexto `encodingProvider` cargando el contexto `encodingContext` que contiene un objeto cuyas claves son los tipos de modelos que se pueden crear. El valor de cada clave será el *encoder* que se usará para codificar los ítems.

```javascript
import { useEncode } from '../feature-extraction/useEncode';
import { mobilenetEncoder } from '../feature-extraction/mobilenet';
import { numericalEncoder } from '../feature-extraction/numerical';
...
		this.encodingProvider.setValue({
			text: useEncode,
			image: mobilenetEncoder,
			numerical: numericalEncoder
		});
...
```
Los *encoders* se deben alojar en el directorio `feature-extraction`. 

>[!info] Importante
>Los *encoders* deben implementarse como una función exportada a la que se le pasa como argumentos un array con los ítems a codificar y que devuelve una Promesa cuyo valor de retorno al resolverse es un Tensor con todos los ítems codificados. La *shape* de este Tensor es (N, D), siendo N el nº de ítems codificados y D la dimensión del vector resultante al codificar el ítem.

Por ejemplo, el *encoder* para transformar conjuntos de números en Tensores (posiblemente el más sencillo de todos, pero el más ilustrativo para mostrar la signatura de la función) se implementa en el archivo `feature-extraction/numerical.js` en la siguiente función:
```javascript
import * as tf from '@tensorflow/tfjs';

export function numericalEncoder(items) {
    return new Promise((resolve, reject) => {
        let features = [];
        for (let csv of items) {
            features.push(csv.split(",").map(v => parseFloat(v)));
        }
        resolve(tf.stack(features));
    });    
} 
```

# Modelo y algoritmo de ML

El objetivo del Machine Learning es construir un modelo capaz de reconocer cosas (texto, imágenes, números, etcétera). El algoritmo de Machine Learning es el encargado de construir dicho modelo. Existe una gran cantidad de algoritmos  de este tipo. Una de los objetivos de LearningML es el estudio de tantos algoritmos como se pueda. Para lo cual hay que permitir al usuario que elija un algoritmo de una lista para que compruebe si es o no adecuado para resolver su problema. Así que debemos  facilitar al desarrollador la incorporación de nuevos algoritmos.

Por tanto, podemos añadir tantos algoritmos como queramos. Cada algoritmo se implementará en un archivo javascript de nombre libre (a decidir por el desarrollador) y alojado en la carpeta `algorithms`. Dicho fichero debe implementar y exportar una clase, de nombre libre, con los siguientes métodos:

| Método                            | Descripción                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `train(features, validationData)` | Construye el modelo de ML a partir del argumento `features` el cual es un Tensor que contiene todos los datos del conjunto de datos de entrenamiento codificado.<br>El argumento `validationData` es opcional. Debe ser un Tensor con datos del conjunto de datos de validación codificados y, si se le pasa, se usará para construir una matriz de confusión. |
| `classify(inputTensor)`           | Una vez construido el modelo (después de ejecutar `train`) esta función se usa para realizar la clasificación de un ejemplar (texto, imagen, número, etcétera) codificado.                                                                                                                                                                                     |
| `setHyperParameters(params)`      | Define los [hyper-parámetros](https://en.wikipedia.org/wiki/Hyperparameter_(machine_learning)) que se usarán para llevar a cabo el proceso de construcción del  modelo de ML.  El argumento `params`es un objeto cuyos atributos son los hyper parámetros del algoritmo.                                                                                       |
Cuando añadamos un nuevo algoritmo, además de crear la clase que lo implemente, hay que modificar el archivo `components/model-editor/model-learn.js`. 
- En la función `getHyperParameters()` hay que añadir los hyper-parámetros del algoritmo en cuestión.
- Hay que añadir una función con el HTML para el formulario que recoge los hyperparámetros. Se le puede llamar como se quiera, pero se recomienda `template<NOMBREALGORITML>Params()`
- En la función `render()` hay que añadir el template que corresponda al nuevo algoritmo.
## Algoritmos implementados
### Sequential
Archivo: `algorithms/sequetial.js`.
Clase: `LMLSequential`

Es un wrapper a la clase `tf.sequential` de Tensorflow. Construye una red neuronal feedforward con tres capas: la entrada, una capa oculta y la de salida. Se pueden ajustar los siguientes hyperparámetros: `learning rate`, `batch size` y `epochs`