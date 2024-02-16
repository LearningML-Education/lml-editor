import * as tf from '@tensorflow/tfjs';

/**
 * @typedef {Object} Dimensiones
 * @property {number} featureDim - dimensión del vector de características 
 * @property {number} numOfClasses - nº de clases
 */

/**
 * @typedef {Object} InOutTensors
 * @property {number} inputTensor - Tensor de shape = [n, featureDim], hay n ejemplares
 *                                  codificados con un vector de dimensión featureDim
 * @property {number} outputTensor - Tensor de shape = [n, numOfClasses], hay n ejemplares
 *                                   de vectores one-hot-encoded, cada uno de ellos representa 
 *                                   la clase a la que corresponde el ejemplar asociado.
 */

/**
 * Dado un Mapa con las características extraídas en el proceso de extracción de 
 * características del conjunto de datos, devuelve un objeto de tipo `Dimensiones`
 * con la información de la dimensión del vector de características y el nº de clases
 * 
 * 
 * @param {Map(String, tf.Tensor)} features - Mapa de las `features` que han resultado 
 *                                            del proceso de extracción de características
 * @returns {Dimensiones} el primer elemento es la dimensión del vector de características 
 *                        y el segundo es el nº de clases
 */
export function getFeatureAndNumOfClasses(features) {
    let featureDim = features.get(Array.from(features.keys())[0]).shape[1];
    let numOfClasses = features.size;

    return { featureDim, numOfClasses };
}


/**
 * Dado un Mapa con las características extraídas en el proceso de extracción de 
 * características del conjunto de datos, devuelve un objeto de tipo `InOutTensors`. 
 * Los tensores correspondientes serán usados  en proceso de aprendizaje mediante el
 * algoritmo de ML.
 * 
 * @param {Map(String, tf.Tensor)} features - Mapa de las `features` que han resultado 
 *                                            del proceso de extracción de características
 * @returns InOutTensors
 */
export function getInputAndOutputTensors(features) {

    let featuresArray = [];
    let labelsArray = [];

    let i = 0;
    let numOfEntries = 0;
    let inputTensorDim = features.get(Array.from(features.keys())[0]).shape[1];
    for (let label of features.keys()) {
        let t = features.get(label);
        featuresArray.push(t);
        for (let n = 0; n < t.shape[0]; n++) {
            labelsArray.push(tf.oneHot(i, features.size));
        }
        numOfEntries += t.shape[0];
        i++;
    }

    let inputTensor = tf.stack(featuresArray).reshape([numOfEntries, inputTensorDim]);
    let outputTensor = tf.stack(labelsArray);

    return { inputTensor, outputTensor };

}

/**
 * 
 * Creamos un modelo consistente en una red neuronal feedforward con una capa de entrada,
 * una capa oculta y una capa de salida. 
 * 
 * @param {Number} inputDim - Dimensión de la capa de entrada (dimensión de los vectores de características)
 * @param {Number} outputDim - Dimensión de la capa de salida (nº de clases)
 * @param {Number} learningRate 
 * 
 * @returns {tf.Sequential}
 */
export function buildModel(inputDim, outputDim, learningRate = 0.001) {

    let model = tf.sequential({
        layers: [
            tf.layers.dense({
                units: 200,
                inputDim: inputDim,
                activation: 'relu'
            }),
            tf.layers.dense({
                units: 100,
                activation: 'relu',
                kernelInitializer: 'varianceScaling',
                useBias: true
            }),
            tf.layers.dense({
                units: outputDim,
                kernelInitializer: 'varianceScaling',
                useBias: false,
                activation: 'softmax'
            })
        ]
    });

    // 0.0001 es el learning rate
    //const optimizer = tf.train.adamax();
    const optimizer = tf.train.adam(learningRate)

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

/**
 * 
 * @param {Map(String, tf.Tensor)} features - Mapa de las `features` que han resultado 
 *                                            del proceso de extracción de características
 * @param {InOutTensors} validationData - un par de tensores con las características del
 *                                        conjunto de validación y su clasificación (one-hot-encoded)
 * @returns {Promise()}
 */
export function train(features, validationData) {

    let dims = getFeatureAndNumOfClasses(features);
    let tensors = getInputAndOutputTensors(features);

    let model = buildModel(dims.featureDim, dims.numOfClasses);

    function onBatchEnd(batch, logs) {
        console.log('Accuracy', logs.acc);
    }

    //Train for 5 epochs with batch size of 32.
    return model.fit(tensors.inputTensor, tensors.outputTensor, {
        epochs: 5,
        batchSize: 8,
        callbacks: { onBatchEnd },
        shuffle: true,
        //validationSplit: this.params.neural_network.validationSplit/100,
        validationData: validationData
    }).then(info => {
        model.save('indexeddb://lml-sequential-model');
        return { model, info }
    });
}