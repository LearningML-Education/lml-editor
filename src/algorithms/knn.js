import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

export  class KNN {
    constructor(){

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
    getInputAndOutputTensors(features) {

        let featuresArray = [];
        let labelsArray = [];

        let j = 0;
        for (let label of features.keys()) {
            let i = 0;
            this.labels.push(label);
            let t = features.get(label);
            let f = tf.unstack(t);
            for (let n = 0; n < t.shape[0]; n++) {
                labelsArray.push(tf.oneHot(j, features.size));
                featuresArray.push(f[i]);
                i++;
            }
            j++;

        }

        let inputTensor = tf.stack(featuresArray);
        let outputTensor = tf.stack(labelsArray);

        return { inputTensor, outputTensor };

    }

    setHyperParameters(params){
        this.hyperparams = params;
    }

    train(features, validationData) {
        const classifier = knnClassifier.create();
        let tensors = this.getInputAndOutputTensors(features);
        let inputs = tf.unstack(tensors.inputTensor);
        classifier.addExample(logits0, 0);
    }

    classify(inputTensor) {}


    buildModel(features) {
        this.mlModel = knnClassifier.create();
        let labels = tf.unstack(features.tensor_labels);
        let inputs = tf.unstack(features.tensor_inputs);

        for (let index in labels) {
            this.mlModel.addExample(inputs[index], labels[index]);
        }
        return true
    }
}