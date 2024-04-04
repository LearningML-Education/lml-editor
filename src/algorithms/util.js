import * as tf from '@tensorflow/tfjs';

function suffle(tensor_inputs, tensor_labels) {
    let tensorInputArray = tensor_inputs.arraySync();
    let tensorLabelsArray = tensor_labels.arraySync();
    tf.util.shuffleCombo(tensorInputArray, tensorLabelsArray);
    let _tensor_inputs = tf.tensor(tensorInputArray);
    let _tensor_labels = tf.tensor(tensorLabelsArray);

    return [_tensor_inputs, _tensor_labels];
}

export function splitData(inputTensor, outputTensor, splitFraction) {
    if (splitFraction <= 0 || splitFraction >= 1) return [features, null];

    let [tensor_inputs, tensor_labels] = suffle(inputTensor, outputTensor);

    let totalNumberOfExamples = inputTensor.shape[0];
    let numberOfValidationExamples = Math.floor(totalNumberOfExamples * splitFraction);
    let numberOfDataExamples = totalNumberOfExamples - numberOfValidationExamples

    // take the  first numberOfValidationExamples for validation
    let tensor_inputs_data = tf.slice(tensor_inputs, 0, numberOfDataExamples);
    let tensor_labels_data = tf.slice(tensor_labels, 0, numberOfDataExamples);
    let tensor_inputs_validation = tf.slice(tensor_inputs, numberOfDataExamples, numberOfValidationExamples);
    let tensor_labels_validation = tf.slice(tensor_labels, numberOfDataExamples, numberOfValidationExamples);

    return [{
        tensor_inputs_data,
        tensor_labels_data
    }, [
        tensor_inputs_validation,
        tensor_labels_validation
    ]]
}

export function confusionMatrix() {
    let resultsPromise = []
    let numberOfSamples = this.validationDataset.tensor_inputs.shape[0];
    for (let i = 0; i < numberOfSamples; i++) {
      resultsPromise.push(this.classify(this.validationDataset.tensor_inputs.gather([i])))
    }

    let classificationResults = []
    return Promise.all(resultsPromise).then(results => {
      classificationResults = results.map(r => r[0][0]);
      let realResults = this.validationDataset.tensor_labels.arraySync()
        .map(r => this.validationDataset.text_labels[r.indexOf(1)]);

      this.validationDataset.tensor_inputs.dispose();
      this.validationDataset.tensor_labels.dispose();
      let result = { text_labels: this.validationDataset.text_labels, classified: classificationResults, real: realResults };
      return result;
    });
  }
